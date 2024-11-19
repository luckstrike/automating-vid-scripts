import { getScripts, getScript, createScript, updateScript, deleteScript } from "$lib/server/dbFunctions";
import { fail } from "@sveltejs/kit";
import { get } from "svelte/store";
import { scriptIdStore } from "$lib/stores/scriptStore";

export const actions = {
  update: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const scriptId = formData.get('scriptId')

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
      return fail(500, { error: 'Failed to update' })
    }
  }
}
