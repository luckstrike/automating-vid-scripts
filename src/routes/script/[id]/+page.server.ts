import type { PageServerLoad } from "../$types";
import { fail } from "@sveltejs/kit";
import { getScript, updateScript } from "$lib/server/dbFunctions";

const baseURL: string =
  import.meta.env.VITE_PUBLIC_BASE_URL ||
  import.meta.env.PUBLIC_BASE_URL ||
  "";
const API_URL: string = `${baseURL}/api`;

async function getAiResult(actionType: string, userSelection: string, accessToken: string) {
  const response = await fetch(API_URL + '/script', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ action: actionType, user_selection: userSelection })
  });

  if (!response.ok) {
    throw new Error(`Generation failed: {response.status}`)
  }

  return await response.json();
}

export const load: PageServerLoad = async ({ params, locals: { supabase, session } }) => {
  try {
    const { id } = params;

    if (!session) {
      return {
        script: null,
        session: null
      };
    }

    // Grabbing the script from the database
    const script = await getScript(supabase, id, session.user.id);

    return {
      script: script,
      session: session
    }
  } catch (error) {
    return {
      script: null,
      session: null,
      error: 'Failed to load script'
    }
  }
}

export const actions = {
  updateTitle: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const scriptId = formData.get('id')

    if (!scriptId) {
      return fail(400, {
        success: false,
        message: 'No script selected'
      })
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return fail(401);
    }


    try {
      await updateScript(
        supabase,
        scriptId as string,
        {
          title: formData.get('title') as string,
          content: formData.get('content') as string
        },
        session.user.id
      )
      return { success: true }
    } catch (error) {
      console.log(error)
      return fail(500, { error: 'Failed to update' })
    }
  },
  updateScript: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const scriptId = formData.get('id');

    if (!scriptId) {
      return fail(400, {
        success: false,
        message: 'No script selected'
      })
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return fail(401);
    }


    try {
      await updateScript(
        supabase,
        scriptId as string,
        {
          content: formData.get('content') as string
        },
        session.user.id
      )
      return { success: true }
    } catch (error) {
      console.log(error)
      return fail(500, { error: 'Failed to update' })
    }
  },
  editSelection: async ({ request, locals: { session } }) => {
    const formData = await request.formData();
    const actionType = formData.get('action')?.toString();
    const userSelection = formData.get('user_selection')?.toString();

    if (!actionType) {
      return fail(400, {
        success: false,
        error: "No action type was received"
      })
    }

    if (!userSelection) {
      return fail(400, {
        success: false,
        error: "No user selection was received"
      })
    }

    try {
      const { gptContent } = await getAiResult(actionType, userSelection, session.access_token)

      return {
        success: true,
        gptContent
      }
    } catch (error) {
      return fail(400, {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to rephrase the text'
      })
    }
  }
}
