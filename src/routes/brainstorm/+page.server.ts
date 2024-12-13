import { createScript } from "$lib/server/dbFunctions";
import { redirect } from "@sveltejs/kit";
import { queryGPT } from "$lib/server/openAIFunctions";

const baseURL: string =
  import.meta.env.VITE_PUBLIC_BASE_URL ||
  import.meta.env.PUBLIC_BASE_URL ||
  "";
const API_URL: string = `${baseURL}/api`;

const brainstormPrompt: string = `You are a helpful assistant who provides, users with key bullet points
                                related to a user provided video topic. If the user specifies that they want
                                ideas related to a random topic you should provided bullet points to them
                                about a random topic that could be turned into a video. The topic may be
                                about anything, you can decide that! Just make sure to focus on one topic 
                                and if you feel like it provide the user with some pointers they can use to
                                branch from that idea. Also please make sure to format all of this in HTML,
                                just the tags, you dont have to specify it's html at the start or end.`;

const aiModel = "gpt-4o-mini";

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
      let response: string | null;
      try {
        response = await queryGPT(brainstormPrompt, prompt, aiModel);
      } catch (e) {
        console.error("An error occured: ", e)
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
