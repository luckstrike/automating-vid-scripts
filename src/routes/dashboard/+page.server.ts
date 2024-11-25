import { getScripts, createScript, deleteScript, getScript } from "$lib/server/dbFunctions";
import type { PageServerLoad } from "./$types";
import type { Script } from "$lib";

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const { session } = await locals.safeGetSession();

    if (!session) {
      return {
        scripts: [],
        session: null
      };
    }

    const scripts = await getScripts(locals.supabase, session.user.id);

    // Ensuring scripts is always an array
    const safeScripts = Array.isArray(scripts) ? scripts : [];

    return { scripts: safeScripts, session };
  } catch (error) {
    return {
      scripts: [],
      session: null,
      error: 'Failed to load scripts'
    };
  }
}

export const actions = {
  createScript: async ({ request, locals }) => {
    // TODO: Add redirecting logic somewhere in this action
    const { session } = await locals.safeGetSession();

    try {
      if (!session) {
        throw new Error('No user session found');
      }

      const newScript = {
        title: "Untitled Script",
        content: "",
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } satisfies Omit<Script, 'id'>

      const createdScript = await createScript(locals.supabase, newScript)

      return {
        script_id: createdScript.id
      }
    } catch (error) {
      return {
        script_id: null,
        error: 'Failed to create a new script'
      }
    }
  },
  deleteScript: async ({ request, locals }) => {
    const { session } = await locals.safeGetSession();

    try {
      if (!session) {
        throw new Error('No user session found')
      }

      const formData = await request.formData();
      const scriptIdValue = formData.get('script_id');

      if (!scriptIdValue || typeof scriptIdValue !== 'string') {
        return {
          success: false,
          error: 'Script ID is required'
        };
      }

      await deleteScript(locals.supabase, scriptIdValue, session.user.id);

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete script'
      };
    }
  }
}
