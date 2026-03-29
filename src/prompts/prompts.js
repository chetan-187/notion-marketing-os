function buildPrompt(idea) {
  return `
You are an expert content strategist and creator.

Convert the following idea into:

1. Instagram Reel Script (Hook, Body, CTA)
2. LinkedIn Post
3. Twitter Thread (5 tweets)

Make it:
- Insightful
- Non-generic
- Practical

Idea:
${idea}
`;
}

module.exports = { buildPrompt };