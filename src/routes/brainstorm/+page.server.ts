import { createScript } from "$lib/server/dbFunctions";
import { queryGPTJSONSchema } from "$lib/server/openAIFunctions";
import type { ChatCompletionTool } from "openai/resources/chat/completions"
import type { ChatMessage } from "$lib";
import type { PageServerLoad } from "./$types";
import { error, fail } from "@sveltejs/kit";

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
    if (!session) {
      throw error(401, 'Not authenticated');
    }

    const formData = await request.formData();
    const type = formData.get('type')?.toString();
    let prompt = formData.get('prompt')?.toString() || '';

    try {
      // If it's a random request, override the prompt
      if (type === 'random') {
        prompt = "Give me a random creative writing prompt";
      } else if (!prompt) {
        throw fail(400, {
          error: 'No prompt provided'
        });
      }

      // Calling the GPT API
      const message: ChatMessage[] = [{ role: "user", content: prompt }];
      const response = await queryGPTJSONSchema(message, brainstormSchema, GPT_MODEL);

      if (!response) {
        throw fail(500, {
          error: 'No response received from the AI model'
        });
      }

      if (!response.scriptTitle || !response.scriptContent) {
        throw fail(400, {
          error: 'Missing field in response from the AI model'
        });
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
      console.log("Error: ", error)
      return fail(500, {
        error: 'Failed to create a new script'
      });
    }
  }
}
