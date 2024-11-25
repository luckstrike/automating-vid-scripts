import { createScript } from "$lib/server/dbFunctions";
import { redirect } from "@sveltejs/kit";

const baseURL: string =
  import.meta.env.VITE_PUBLIC_BASE_URL ||
  import.meta.env.PUBLIC_BASE_URL ||
  "";
const API_URL: string = `${baseURL}/api`;

// TODO: Maybe move this to another file?
async function generateScriptContent(userProvidedUrl: string) {
  const response = await fetch(API_URL + '/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: userProvidedUrl })
  });

  if (!response.ok) {
    throw new Error(`Generation failed: {response.status}`)
  }

  return await response.json();
}

export const actions = {
  generateSummary: async ({ request, locals: { supabase } }) => {
    const { data: { session } } = await supabase.auth.getSession();

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
