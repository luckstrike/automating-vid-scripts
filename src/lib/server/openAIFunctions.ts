import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function queryGPT(
  initialPrompt: string,
  userInput: string,
  aiModel: string
): Promise<string | null> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: initialPrompt,
      },
      {
        role: "user",
        content: userInput,
      },
    ],
    model: aiModel,
  });

  return completion.choices[0].message.content;
}
