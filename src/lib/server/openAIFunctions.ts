import OpenAI from "openai";
import type { FunctionParameters, ChatCompletionTool } from "$lib";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function queryGPT(
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
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0].message.content;

  if (!content) {
    throw new Error('No content received from OpenAI')
  }

  return JSON.parse(content);
}

export async function queryGPTJSONSchema(
  userPrompt: string,
  schema: any,
  aiModel: string
): Promise<string | null> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userPrompt
      }
    ],
    model: aiModel,
    tools: [
      schema
    ]
  })
}
