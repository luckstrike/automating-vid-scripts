import { queryGPTJSONSchema } from "$lib/server/openAIFunctions";
import type { ChatCompletionTool } from "$lib";
import { checkIfAllowed, parseURL } from "$lib/server/parser.js";

const GPT_MODEL = "gpt-4o-mini";

const summarizeSchema: ChatCompletionTool = {
  type: "function",
  function: {
    name: "generate_summary",
    description: "Generate a summary of the provided scrapped HTML content",
    parameters: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "The summary of the scrapped HTML content",
          examples: ["<p>Example content</p>"]
        }
      },
      required: ["scriptTitle", "scriptContent"]
    }
  }
};

async function generateScriptContent(userAgent: string, url: string) {
  if (await checkIfAllowed(userAgent, url)) {
    const pageHTMLResult = await parseURL(url);

    if (pageHTMLResult) {
      const response = await queryGPTJSONSchema(pageHTMLResult, summarizeSchema, GPT_MODEL);
      return response;
    } else {
      throw new Error("Issue when trying to parse a website...")
    }
  }
}

export const actions = {
  generateSummary: async ({ request, locals: { session } }) => {
    try {
      if (!session) {
        throw new Error('No user session found');
      }

      const formData = await request.formData();
      const url = formData.get('url')?.toString();


      if (!url) {
        return {
          success: false,
          summary: null,
          error: 'No URL was provided'
        }
      }

      const userAgent: string = request.headers.get("user-agent") || "unknown";
      const { summary } = await generateScriptContent(userAgent, url);

      return {
        success: true,
        summary
      };

    } catch (error) {
      return {
        script_id: null,
        summary: null,
        error: error instanceof Error ? error.message : 'Failed to generate a summary'
      }
    }
  }
}
