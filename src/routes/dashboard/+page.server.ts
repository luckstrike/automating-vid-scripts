import { getScripts, createScript } from "$lib/server/dbFunctions";
import type { PageServerLoad } from "./$types";
import type { Script } from "$lib";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return {
        scripts: [],
        session: null
      };
    }

    const scripts = await getScripts(supabase, session.user.id);

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
  createScript: async ({ request, locals: { supabase } }) => {
    const { data: { session } } = await supabase.auth.getSession();

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

      createScript(supabase, newScript)
    } catch (error) {
      return {
        error: 'Failed to create a new script'
      }
    }
  }
}
