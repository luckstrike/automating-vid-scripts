import { queryGPTJSONSchema } from "$lib/server/openAIFunctions";
import { checkIfAllowed, parseURL } from "$lib/server/parser.js";
import type { ChatCompletionTool, ChatMessage } from "$lib";
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

async function generateScriptContent(url: string, summaryOption: string) {
  if (!(new URL(url))) {
    throw new Error("Invalid URL");
  }

  let gptPrompt: string = "";

  if (summaryOption == "detailed") {
    gptPrompt = `You are helpful assistant that summarizes HTML and text content. You are to
                  summarize the content you receive into a detailed summary to the user as text.`
  } else if (summaryOption == "bullet") {
    gptPrompt = `You are a helpful assistant that summarizes HTML and text content. You are to
                  summarize the content you receive into bullet points. The bullet points should
                  contain key points of the HTML or text that you receive from the user.`
  }

  if (await checkIfAllowed(url)) {
    const pageHTMLResult = await parseURL(url);

    if (pageHTMLResult) {
      const message: ChatMessage[] = [{ role: "system", content: gptPrompt }, { role: "user", content: pageHTMLResult }]
      const response = await queryGPTJSONSchema(message, summarizeSchema, GPT_MODEL);
      return response;
    } else {
      throw new Error("Issue when trying to parse the website...")
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
      const summaryOption = formData.get('summary');

      if (!url) {
        console.log("URL")
        return {
          success: false,
          summary: null,
          error: 'No URL was provided'
        }
      } else if (!summaryOption) {
        return {
          success: false,
          summary: null,
          error: 'No summary option was selected'
        }
      } else if (summaryOption != "detailed" && summaryOption != "bullet") {
        return {
          success: false,
          summary: null,
          error: 'Invalid summary option was selected'
        }
      }

      const { summary } = await generateScriptContent(url, summaryOption);

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
