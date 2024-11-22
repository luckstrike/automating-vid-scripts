import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { getScript } from "$lib/server/dbFunctions";

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const { id } = params;

    if (!session) {
      return {
        script: null,
        session: null
      };
    }

    // Grabbing the script from the database
    const script = await getScript(supabase, id, session.user.id);
    console.log(script)

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
