const { buildPrompt } = require("../prompts/prompts");
const { generateContent } = require("./claude/claude");
const { saveContent, markProcessed } = require("../notion/notion");

async function processIdea(ideaPage) {
  const ideaText =
    ideaPage.properties.Name.title[0].plain_text;

  const prompt = buildPrompt(ideaText);

  const output = await generateContent(prompt);

  await saveContent(output, ideaPage.id);
  await markProcessed(ideaPage.id);

  console.log("Processed:", ideaText);
}

module.exports = { processIdea };