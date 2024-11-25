import { createScript } from "$lib/server/dbFunctions";
import { redirect } from "@sveltejs/kit";

const baseURL: string =
  import.meta.env.VITE_PUBLIC_BASE_URL ||
  import.meta.env.PUBLIC_BASE_URL ||
  "";
const API_URL: string = `${baseURL}/api`;

// TODO: Maybe move this to another file?
async function generateScriptContent(userPrompt: string) {
  const response = await fetch(API_URL + '/brainstorm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: userPrompt })
  });

  if (!response.ok) {
    throw new Error(`Generation failed: {response.status}`)
  }

  const { scriptContent, scriptTitle } = await response.json();

  return { scriptContent, scriptTitle }
}

export const actions = {
  generateScript: async ({ request, locals: { supabase } }) => {
    const { data: { session } } = await supabase.auth.getSession();

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
      const { scriptContent, scriptTitle } = await generateScriptContent(prompt);

      const newScript = {
        user_id: session.user.id,
        content: scriptContent,
        title: scriptTitle,
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
