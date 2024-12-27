import { getScripts, createScript, deleteScript, getScript } from "$lib/server/dbFunctions";
import type { PageServerLoad } from "./$types";
import type { Script } from "$lib";
import { error, fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
  try {
    if (!session) {
      return {
        scripts: [],
        session: null,
        error: 'No user session is active'
      };
    }

    const scripts = await getScripts(supabase, session.user.id);

    // Ensuring scripts is always an array
    const safeScripts = Array.isArray(scripts) ? scripts : [];

    return {
      scripts: safeScripts,
      session,
      seo: {
        title: "Dashboard | DinoDino",
        description: "Website dashboard where you can create, delete and select a script to edit"
      }
    };
  } catch (err) {
    throw error(500, 'Failed to load scripts')
  }
}

export const actions = {
  createScript: async ({ request, locals: { supabase, session } }) => {
    if (!session) {
      throw error(401, 'Not authenticated');
    }
    try {
      const newScript = {
        title: "Untitled Script",
        content: "",
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } satisfies Omit<Script, 'id'>

      const createdScript = await createScript(supabase, newScript)

      return {
        script_id: createdScript.id
      }
    } catch (err) {
      return fail(500, {
        error: 'Failed to create a new script'
      })
    }
  },
  deleteScript: async ({ request, locals: { supabase, session } }) => {
    if (!session) {
      throw new Error('No user session found')

    }
    const formData = await request.formData();
    const scriptIdValue = formData.get('script_id');

    if (!scriptIdValue || typeof scriptIdValue !== 'string') {
      return fail(400, {
        error: 'Script ID is required'
      })
    }

    try {
      await deleteScript(supabase, scriptIdValue, session.user.id);

      return {
        success: true
      };
    } catch (err) {
      return fail(500, {
        error: 'Failed to delete script',
        scriptIdValue
      });
    }
  }
}
