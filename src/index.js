const { getNewIdeas } = require("./notion/notion");
const { processIdea } = require("./ai-agent/processor");

async function run() {
  const ideas = await getNewIdeas();

  for (const idea of ideas) {
    await processIdea(idea);
  }

  console.log("Done 🚀");
}

run();