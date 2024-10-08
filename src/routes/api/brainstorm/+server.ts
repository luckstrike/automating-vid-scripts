import type { UserPrompt, Env } from "$lib";
import { json, type RequestHandler } from "@sveltejs/kit";
import OpenAI from "openai";

// NOTE: This prompt can be refined over time, maybe even be a feature for the user to change
const brainstormPrompt: string = `You are a helpful assistant who provides, users with key bullet points
                                related to a user provided video topic. If the user specifies that they want
                                ideas related to a random topic you should provided bullet points to them
                                about a random topic that could be turned into a video. The topic may be
                                about anything, you can decide that! Just make sure to focus on one topic 
                                and if you feel like it provide the user with some pointers they can use to
                                branch from that idea. Also please make sure to format all of this as HTML,
                                so that it can be read by an HTML Script parser. Make sure that everything
                                you state in the response is in HTML please.`;

const brainstormTitlePrompt: string = `You are a helpful assitant who provides, users with a good document title
                                    based on the prompt they provide. Assume that you have already given the user
                                    a bunch of key helpful pointers to help them out with a video. Provide a title
                                    for this document based on the prompt you are provided. Try to keep it under 10
                                    words or less. The less words you provide the better, but don't be shy of
                                    providing more words for the title if needed.`;

async function brainstormGPT(
  openai: OpenAI,
  userInput: string,
): Promise<string | null> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: brainstormPrompt,
      },
      {
        role: "user",
        content: userInput,
      },
    ],
    model: "gpt-4o",
  });

  return completion.choices[0].message.content;
}

async function brainstormTitleGPT(
  openai: OpenAI,
  userInput: string,
): Promise<string | null> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: brainstormTitlePrompt,
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

export const POST: RequestHandler = async ({ request, platform }) => {
  // Get the API key from the environment
  let OPENAI_API_KEY: string | undefined;

  if (typeof platform !== "undefined" && "env" in platform) {
    // Cloudflare Pages environment
    OPENAI_API_KEY = (platform.env as Env).OPENAI_API_KEY;
  } else {
    // SvelteKit local development environment
    OPENAI_API_KEY =
      import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  }

  // Initialize OpenAI client here
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  let data: UserPrompt | null = null;

  try {
    data = (await request.json()) as UserPrompt;
  } catch (e) {
    console.error("Unable to handle a POST request /api/brainstorm");
    return json({ success: false, error: "Bad request" }, { status: 400 });
  }

  // Use the OpenAI API here
  let gptResult: string | null;
  let gptTitleResult: string | null;

  if (data && data.prompt) {
    gptResult = await brainstormGPT(openai, data.prompt);
    gptTitleResult = await brainstormTitleGPT(openai, data.prompt);
  } else {
    let randomIdea: string = "";
    gptResult = await brainstormGPT(
      openai,
      "I'm not really sure what to write about",
    );
    gptTitleResult = "Random Ideas";
  }

  if (gptResult && gptTitleResult) {
    return json({
      success: true,
      scriptContent: gptResult,
      scriptTitle: gptTitleResult,
    });
  } else {
    return json({ success: false, scriptContent: "", scriptTitle: "" });
  }
};
