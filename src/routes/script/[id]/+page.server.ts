import type { PageServerLoad } from "../$types";
import { fail } from "@sveltejs/kit";
import { getScript, updateScript } from "$lib/server/dbFunctions";
import { queryGPTJSONSchema } from "$lib/server/openAIFunctions";
import type { ChatCompletionTool } from "$lib";

const GPT_MODEL = "gpt-4o-mini";

const expandSchema: ChatCompletionTool = {
  type: "function",
  function: {
    name: "expand_text",
    description: "Generate text that further expands on the provided input text",
    parameters: {
      type: "object",
      properties: {
        resultText: {
          type: "string",
          description: "The provided user input but further expanded upon",
          examples: ["Example content"]
        }
      },
      required: ["resultText"]
    }
  }
};

const rephraseSchema: ChatCompletionTool = {
  type: "function",
  function: {
    name: "rephrase_text",
    description: "Generate a rephrased version of the provided input text",
    parameters: {
      type: "object",
      properties: {
        resultText: {
          type: "string",
          description: "The provided user input but rephrased more elegantly",
          examples: ["Example content"]
        }
      },
      required: ["resultText"]
    }
  }
};

async function getAiResponse(actionType: string, userSelection: string) {

  let response;

  try {
    if (actionType === "expand") {
      response = await queryGPTJSONSchema(userSelection, expandSchema, GPT_MODEL);
    } else if (actionType === "rephrase") {
      response = await queryGPTJSONSchema(userSelection, rephraseSchema, GPT_MODEL);
    }
  } catch (error) {
    console.error("Failed to generate data: ", error);
  }

  return response;
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
      const { resultText } = await getAiResponse(actionType, userSelection)

      return {
        success: true,
        resultText
      }
    } catch (error) {
      return fail(400, {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to rephrase or expand on the text'
      })
    }
  }
}
