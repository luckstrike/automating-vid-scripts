import robotsParser from "robots-parser";
import * as cheerio from "cheerio";

export async function checkIfAllowed(userAgent: string, url: string) {
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

export async function parseURL(url: string) {
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
