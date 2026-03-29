require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function getNewIdeas() {
  const res = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "Status",
      status: {
        equals: "new",
      },
    },
  });

  return res.results;
}

function splitText(text, maxLength = 2000) {
  const chunks = [];
  let i = 0;

  while (i < text.length) {
    chunks.push(text.slice(i, i + maxLength));
    i += maxLength;
  }

  return chunks;
}

async function saveContent(content, ideaId) {
  const chunks = splitText(content);

  // 1. Create page FIRST
  const page = await notion.pages.create({
    parent: { database_id: process.env.NOTION_CONTENT_DB_ID },
    properties: {
      Type: { select: { name: "Generated" } },
      Name: {
        title: [
          {
            text: { content: content.slice(0, 50) },
          },
        ],
      },

      "Linked Idea": {
        relation: [{ id: ideaId }],
      },
    },
  });

  // 2. Then append content blocks
  await notion.blocks.children.append({
    block_id: page.id,
    children: chunks.map(chunk => ({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: { content: chunk },
          },
        ],
      },
    })),
  });
}

async function markProcessed(pageId) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Status: { status: { name: "processed" } },
    },
  });
}

module.exports = { getNewIdeas, saveContent, markProcessed };