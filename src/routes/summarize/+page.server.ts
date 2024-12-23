import { queryGPTJSONSchema } from "$lib/server/openAIFunctions";
import { checkIfAllowed, parseURL } from "$lib/server/parser.js";
import type { ChatCompletionTool } from "$lib";
import type { PageServerLoad } from "./$types";

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

export const load: PageServerLoad = async () => {
  return {
    seo: {
      title: "Summarize | DinoDino",
      description: "Summarize tab where you can summarize the content of a URL"
    }
  };
}

async function generateScriptContent(url: string) {
  if (!(new URL(url))) {
    throw new Error("Invalid URL");
  }

  if (await checkIfAllowed(url)) {
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

      const { summary } = await generateScriptContent(url);

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
