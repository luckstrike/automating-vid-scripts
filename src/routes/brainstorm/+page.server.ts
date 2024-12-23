import { createScript } from "$lib/server/dbFunctions";
import { queryGPTJSONSchema } from "$lib/server/openAIFunctions";
import type { ChatCompletionTool, ChatMessage } from "$lib";
import type { PageServerLoad } from "./$types";

const GPT_MODEL = "gpt-4o-mini";

const brainstormSchema: ChatCompletionTool = {
  type: "function",
  function: {
    name: "generate_script",
    description: "Generate a script with title and HTML-formatted content",
    parameters: {
      type: "object",
      properties: {
        scriptTitle: {
          type: "string",
          description: "The title of the script"
        },
        scriptContent: {
          type: "string",
          description: "The script content wrapped in HTML tags",
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
      title: "Brainstorm | DinoDino",
      description: "Brainstorm tab where you can brainstorm a starting point for a script"
    }
  };

}

export const actions = {
  generateScript: async ({ request, locals: { supabase, session } }) => {
    try {
      if (!session) {
        throw new Error('No user session found');
      }

      const formData = await request.formData();
      const type = formData.get('type')?.toString();
      let prompt = formData.get('prompt')?.toString() || '';

      // If it's a random request, override the prompt
      if (type === 'random') {
        prompt = "Give me a random creative writing prompt";
      } else if (!prompt) {
        throw new Error('No prompt provided');
      }

      // Calling the GPT API
      const message: ChatMessage[] = [{ role: "user", content: prompt }];
      const response = await queryGPTJSONSchema(message, brainstormSchema, GPT_MODEL);

      if (!response) {
        throw new Error("No response from OpenAI");
      }

      if (!response.scriptTitle || !response.scriptContent) {
        throw new Error("No response / missing field in response from OpenAI");
      }

      const newScript = {
        user_id: session.user.id,
        content: response.scriptContent,
        title: response.scriptTitle,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const createdScript = await createScript(supabase, newScript)

      return {
        success: true,
        script_id: createdScript.id
      };

    } catch (error) {
      return {
        script_id: null,
        error: error instanceof Error ? error.message : 'Failed to create a new script'
      }
    }
  }
}
