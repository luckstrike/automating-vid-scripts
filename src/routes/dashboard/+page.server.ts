import { getScripts } from "$lib/server/dbFunctions";
import type { PageServerLoad } from "./$types";

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
