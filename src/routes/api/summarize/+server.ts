import axios from "axios";
import robotsParser from "robots-parser";
import * as cheerio from "cheerio";

// Importing Svelte Stuff
import type { UserProvidedURL } from "$lib";
import { json, type RequestHandler } from "@sveltejs/kit";

import type { UserPrompt } from "$lib";
import OpenAI from "openai";

const summarizePrompt: string = `You are a helpful assitant that summarizes the input from a user.
                                 The user will typically provide a URL which is then parsed for data,
                                 what you will receive can either be raw text or HTML that contains the
                                 parsed data from a website. Your goal is to take that data that you are
                                 provided and then summarize into a more concise piece of text. Make sure
                                 to just remove any HTML tags or from the text and return back the text
                                 from what you received.`;

async function checkIfAllowed(userAgent: string, url: string) {
  try {
    const robotsTxtUrl = new URL("/robots.txt", url).href;
    const response = await fetch(robotsTxtUrl);
    const robotsTxt = await response.text();
    const robots = robotsParser(robotsTxtUrl, robotsTxt);
    return robots.isAllowed(url, userAgent);
  } catch (error) {
    console.error(`Error fetching robots.txt for ${url}:`, error);
    return false;
  }
}

async function summarizeParsedInfo(
  openai: OpenAI,
  HTMLResult: string,
): Promise<string | null> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: summarizePrompt,
      },
      {
        role: "user",
        content: HTMLResult,
      },
    ],
    model: "gpt-4o-mini",
  });

  return completion.choices[0].message.content;
}

async function parseURL(url: string) {
  try {
    const response = await fetch(url);
    const data = await response.text();
    const $ = cheerio.load(data);
    return $("body").text();
  } catch (error) {
    console.error(`Error parsing URL ${url}:`, error);
    return "";
  }
}

async function runParser(
  openai: OpenAI,
  userAgent: string,
  url: string,
): Promise<string | null> {
  if (await checkIfAllowed(userAgent, url)) {
    const pageHTMLResult = await parseURL(url);
    if (pageHTMLResult) {
      return await summarizeParsedInfo(openai, pageHTMLResult);
    }
    console.error("Error in runParser, no data was parsed!");
  } else {
    console.error("Not allowed to scrape this website.");
  }
  return null;
}

export const POST: RequestHandler = async ({ request, platform }) => {
  const OPENAI_API_KEY =
    import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY || "";

  if (!OPENAI_API_KEY) {
    console.error("OpenAI API key not found");
    return json(
      { success: false, error: "Server configuration error" },
      { status: 500 },
    );
  }

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  let data: UserProvidedURL | null = null;
  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    data = (await request.json()) as UserProvidedURL;
  } catch (e) {
    console.error("Unable to handle a POST request /api/summarize");
    return json({ success: false, error: "Bad request" }, { status: 400 });
  }

  if (data?.url) {
    const URLSummary = await runParser(openai, userAgent, data.url);
    if (URLSummary) {
      return json({ success: true, summary: URLSummary });
    }
  }

  return json({ success: false, summary: null });
};
