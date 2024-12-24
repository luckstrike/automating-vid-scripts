import { queryGPTJSONSchema } from "$lib/server/openAIFunctions";
import { checkIfAllowed, parseURL } from "$lib/server/parser.js";
import type { ChatCompletionTool } from "openai/resources/chat/completions"
import type { ChatMessage } from "$lib";
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

const bulletPointSchema: ChatCompletionTool = {
  type: "function",
  function: {
    name: "generate_bullet_points",
    description: "Generate a bullet-point summary of the provided content",
    parameters: {
      type: "object",
      properties: {
        summary: {
          type: "object",
          description: "The bullet-point summary structure",
          properties: {
            bullet_points: {
              type: "array",
              description: "Array of bullet points",
              items: {
                type: "object",
                properties: {
                  point: {
                    type: "string",
                    description: "The content of the bullet point"
                  },
                  order: {
                    type: "integer",
                    description: "The order of the bullet point"
                  }
                },
                required: ["point", "order"]
              }
            },
            metadata: {
              type: "object",
              properties: {
                total_points: {
                  type: "integer",
                  description: "Total number of bullet points"
                },
                source_text_length: {
                  type: "integer",
                  description: "Length of the source text"
                }
              },
              required: ["total_points", "source_text_length"]
            }
          },
          required: ["bullet_points", "metadata"]
        }
      },
      required: ["summary"]
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

  let gptSchema: ChatCompletionTool | null = null;

  if (summaryOption == "detailed") {
    gptSchema = summarizeSchema;
  } else if (summaryOption == "bullet") {
    gptSchema = bulletPointSchema;
  } else {
    throw new Error("Invalid summary schema")
  }

  if (await checkIfAllowed(url)) {
    const pageHTMLResult = await parseURL(url);

    if (pageHTMLResult) {
      const message: ChatMessage[] = [{ role: "user", content: pageHTMLResult }]
      const response = await queryGPTJSONSchema(message, gptSchema, GPT_MODEL);
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
