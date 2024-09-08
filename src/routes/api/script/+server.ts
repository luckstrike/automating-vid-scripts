import type { UserSelection } from '$lib';
import { json, type RequestHandler } from '@sveltejs/kit'
import OpenAI from "openai";
import * as dotenv from 'dotenv';

dotenv.config()

// Setting up access to the OpenAI API
const OPENAI_API_KEY: string | undefined = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const generatePrompt: string = `You are an excellent writer who can reword and expand on any type of text. A user
                                has provided you with text that you are to help them rewrite. If the text is too short
                                to expand upon or rewrite you can simply just return the text back and write something
                                in your response like [not enough text provided].`

async function sendToGPT(openai: OpenAI, prompt: string, userInput: string): Promise<string | null> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt
      },
      {
        role: "user",
        content: userInput
      }
    ],
    model: "gpt-4o-mini",
  });

  return completion.choices[0].message.content;
}

export const POST: RequestHandler = async ({ request }) => {

  let data: UserSelection | null = null;

  try {
    data = await request.json() as UserSelection;
  } catch (e) {
    console.error("Unable to handle a POST request /api/script")
    return json({ success: false, error: "Bad request" }, { status: 400 })
  }

  // Use the OpenAI API here
  let gptResult: string | null = "";

  if (data && data.userSelection) {
    gptResult = await sendToGPT(openai, generatePrompt, data.userSelection);
  }
  if (gptResult) {
    return json({ success: true, gptContent: gptResult })
  } else {
    return json({ success: false, gptContent: "" })
  }
}
