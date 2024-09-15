import axios from "axios";
import robotsParser from "robots-parser";
import * as cheerio from "cheerio";

// Importing Svelte Stuff
import type { UserProvidedURL } from "$lib";
import { json, type RequestHandler } from "@sveltejs/kit";

import type { UserPrompt } from "$lib";
import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();

// Setting up access to the OpenAI API
const OPENAI_API_KEY: string | undefined = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

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

    // Fetch the robots.txt using axios
    const response = await axios.get(robotsTxtUrl);
    const robotsTxt = response.data;

    // Parse robots.txt
    const robots = robotsParser(robotsTxtUrl, robotsTxt);

    // Check if allowed
    const isAllowed = robots.isAllowed(url, userAgent);

    return isAllowed;
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
    // Fetch the webpage
    const { data } = await axios.get(url);

    // Load the HTML into Cheerio
    const $ = cheerio.load(data);

    const pageText: string = $("body").text();

    return pageText;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Axios error: ${error.message}`);
      console.error(`Response status: ${error.response?.status}`);
      console.error(`Response data: ${error.response?.data}`);
    } else {
      console.error(`Unexpected error: ${error}`);
    }
    return "";
  }
}

async function runParser(
  userAgent: string,
  url: string,
): Promise<string | null> {
  let pageHTMLResult: string | null;
  let summarizedResult: string | null;

  if (await checkIfAllowed(userAgent, url)) {
    pageHTMLResult = await parseURL(url);

    // Now summarize the result using ChatGPT
    if (pageHTMLResult != "") {
      summarizedResult = await summarizeParsedInfo(openai, pageHTMLResult);
      return summarizedResult;
    } else {
      console.error("Error in runParser, no data was parsed!");
      return null;
    }
  } else {
    console.error(
      "Uh oh, seems like we're not allowed to scrape this website :(",
    );
  }

  return null;
}

export const POST: RequestHandler = async ({ request }) => {
  let data: UserProvidedURL | null = null;

  let URLSummary: string | null = null;

  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    data = (await request.json()) as UserProvidedURL;
  } catch (e) {
    console.error("Unable to handle a POST request /api/randomidea");
    return json({ success: false, error: "Bad request" }, { status: 400 });
  }

  if (data && data.url) {
    URLSummary = await runParser(userAgent, data.url);
  }

  if (URLSummary) {
    return json({ success: true, summary: URLSummary });
  } else {
    return json({ success: false, summary: null });
  }
};
