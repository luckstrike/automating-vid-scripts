import type { UserSelection } from "$lib";
import { json, type RequestHandler } from "@sveltejs/kit";
import OpenAI from "openai";

const generatePrompt: string = `You are an excellent writer who can expand on any provided text. A user
                                has provided you with text that you are to help them expand upon. If the text is too 
                                short to expand upon you can simply just return the text back and write something
                                in your response like [not enough text provided]. Try to make the responses not too long,
                                maybe around two to three times the amount that was provided. If that seems too long then
                                you can go ahead and shorten the response.`;

const rephrasePrompt: string = `You are an incredible editor who can rephrase any provided text. A user
                                has provided you with text that you are to help them rewrite. If the text is too short
                                to rewrite you can simply just return the text back and write something in your
                                response like [not enough text provided]. Try to make the rephrased response not too long,
                                maybe around the same length to about twice as long. If that still seems too long then
                                you can go ahead and return a reponse that seems of a reasonable length to you.`;

async function sendToGPT(
  openai: OpenAI,
  prompt: string,
  userInput: string,
): Promise<string | null> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: userInput,
      },
    ],
    model: "gpt-4o-mini",
  });

  return completion.choices[0].message.content;
}

export const POST: RequestHandler = async ({ request }) => {
  // Get the API key from the environment
  const OPENAI_API_KEY =
    (typeof process !== "undefined" && process.env.OPENAI_API_KEY) || // Node.js environment
    import.meta.env.VITE_OPENAI_API_KEY; // Vite environment

  if (!OPENAI_API_KEY) {
    console.error("OpenAI API key not found");
    return json(
      { success: false, error: "Server configuration error" },
      { status: 500 },
    );
  }

  // Initialize OpenAI client here
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  let data: UserSelection | null = null;

  try {
    data = (await request.json()) as UserSelection;
  } catch (e) {
    console.error("Unable to handle a POST request /api/script");
    return json({ success: false, error: "Bad request" }, { status: 400 });
  }

  // Use the OpenAI API here
  let gptResult: string | null = "";

  if (data && data.userSelection) {
    if (data.actionType == "expand") {
      gptResult = await sendToGPT(openai, generatePrompt, data.userSelection);
    } else if (data.actionType == "rephrase") {
      gptResult = await sendToGPT(openai, rephrasePrompt, data.userSelection);
    } else {
      return json({ success: false, gptContent: "" });
    }
  }
  if (gptResult) {
    return json({ success: true, gptContent: gptResult });
  } else {
    return json({ success: false, gptContent: "" });
  }
};
