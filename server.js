const express = require("express");
const app = express();

app.use(express.json());

async function returnJSON(input, depth) {
  const learningResources = `Do what i tell you exactly,i want to build tech ${input}.provide me ${depth} topics and make them as short as possible that i need to learn with appropriate resources in an EXACT format dont add anything else (not even code).Format from the easiest to the hardest:
        Topic,resource(only the link) one topic is one new line.dont add anything else other than what i told you ONLY TOPIC THEN COMMA THEN RESOURCE.if you think what i inputed is not valid (not a project or gibbirish) output ONLY State,Error`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "user",
              content: learningResources,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const outStr = data.choices[0].message.content;
    return parseInputAndSaveJSON(outStr);
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to fetch data" };
  }
}

function parseInputAndSaveJSON(inputString) {
  const lines = inputString.trim().split("\n");
  const result = lines
    .map((line) => {
      const lastCommaIndex = line.lastIndexOf(",");
      if (lastCommaIndex === -1) return null;

      const name = line.substring(0, lastCommaIndex).trim();
      const resource = line.substring(lastCommaIndex + 1).trim();

      return { name, resource };
    })
    .filter((item) => item !== null);

  return result;
}

app.get("/api", async (req, res) => {
  const inputString = req.query.input;
  if (!inputString) {
    return res.status(400).json({ error: "Missing 'input' query parameter" });
  }

  try {
    const result = await returnJSON(inputString, 10);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
