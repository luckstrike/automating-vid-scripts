import type { PageServerLoad } from "../$types";
import { fail } from "@sveltejs/kit";
import { getScript, updateScript } from "$lib/server/dbFunctions";

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
  update: async ({ request, locals: { supabase } }) => {
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
      console.log("No?")
      return fail(500, { error: 'Failed to update' })
    }
  }
}
