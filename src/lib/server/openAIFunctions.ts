import OpenAI from "openai";
import type { ChatCompletionTool } from "$lib";
import { OPENAI_API_KEY } from "$env/static/private";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

// Used for when you just need a simple reponse back
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

// Used when a JSON response is needed, this is better for that
export async function queryGPTJSONSchema(
  userPrompt: string,
  schema: ChatCompletionTool,
  aiModel: string
): Promise<any> {
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
    ],
    tool_choice: { type: "function", function: { name: schema.function.name } }
  });

  const message = completion.choices[0]?.message;

  if (!message) {
    throw new Error('No message in response');
  }

  if (!message.tool_calls?.[0].function?.arguments) {
    throw new Error('No tool calls found in the response');
  }

  try {
    return JSON.parse(message.tool_calls![0].function.arguments);
  } catch (error) {
    console.error('Error in queryGPTJSONSchema: ', error);
  }
}
