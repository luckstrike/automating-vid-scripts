import type { PageServerLoad } from "../$types";
import { error, fail } from "@sveltejs/kit";
import { getScript, updateScript } from "$lib/server/dbFunctions";
import { queryGPTJSONSchema } from "$lib/server/openAIFunctions";
import type { ChatCompletionTool, ChatMessage } from "$lib";

const GPT_MODEL = "gpt-4o-mini";

const expandSchema: ChatCompletionTool = {
  type: "function",
  function: {
    name: "expand_text",
    description:
      `Expand the input text by adding relevant details, examples, and elaboration. 
      For short inputs (under 50 words), expand by roughly 2-3x. For more medium inputs (50-200 words), 
      expand by 1.5-2x. For longer inputs (200+ words), expand by 1.3-1.5x. Main the original tone and style 
      while adding meaningful content.`,
    parameters: {
      type: "object",
      properties: {
        resultText: {
          type: "string",
          description:
            `The expanded version of the input text, with added depth and details
            while maintaining natural flow and relevance. Should follow the length
            multiplication guidelines based on input size.`,
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
    description:
      `Generate an elegantly rephrased version of the input text.
      Maintain the original meaning and key information while improving clarity and flow.
      Use varied sentence structures and sophisticated vocabulary where appropriate.
      Keep the same tone but enhance the overall writing quality.`,
    parameters: {
      type: "object",
      properties: {
        resultText: {
          type: "string",
          description:
            `A more polished and elegant version of the input text, 
            maintaing core meaning while improving style and readablity.`,
          examples: ["Example content"]
        }
      },
      required: ["resultText"]
    }
  }
};

async function getAiResponse(actionType: string, userSelection: string) {

  let response;
  const message: ChatMessage[] = [{ role: "user", content: userSelection }];

  try {
    if (actionType === "expand") {
      response = await queryGPTJSONSchema(message, expandSchema, GPT_MODEL);
    } else if (actionType === "rephrase") {
      response = await queryGPTJSONSchema(message, rephraseSchema, GPT_MODEL);
    }
  } catch (error) {
    console.error("Failed to generate data: ", error);
  }

  return response;
}

export const load: PageServerLoad = async ({ params, locals: { supabase, session } }) => {
  const { id } = params;

  if (!session) {
    return {
      script: null,
      session: null
    };
  }

  try {
    // Grabbing the script from the database
    const script = await getScript(supabase, id, session.user.id);

    return {
      script: script,
      session: session,
      seo: {
        title: `${script.title} | DinoDino`,
        description: "Script tab where you can edit a script"
      }
    }
  } catch (err) {
    throw error(500, 'Failed to load script')
  }
}

export const actions = {
  updateTitle: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const scriptId = formData.get('id')

    if (!scriptId) {
      return fail(400, {
        error: 'No script was selected'
      })
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return fail(401, {
        error: 'Not authenticated'
      });
    }

    try {
      await updateScript(
        supabase,
        scriptId as string,
        {
          title: formData.get('title') as string,
        },
        session.user.id
      )
      return { success: true }
    } catch (error) {
      console.log(error)
      return fail(500, {
        error: 'Failed to update'
      });
    }
  },
  updateScript: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const scriptId = formData.get('id');
    const scriptContent = formData.get('content');

    console.log("Yes this is even more debug...")
    console.log("server formData: ", formData);
    console.log("server formData.id: ", scriptId);
    console.log("server formData.content: ", scriptContent);

    if (!scriptId) {
      return fail(400, {
        error: 'No script was selected'
      })
    }

    console.log("Past scriptId")

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw error(401, 'Not authenticated');
    }

    console.log("Past active session check");

    if (!scriptContent) {
      return fail(400, {
        error: 'No script content provided'
      });
    }

    console.log("Past script content check");

    try {
      await updateScript(
        supabase,
        scriptId as string,
        {
          content: scriptContent as string
        },
        session.user.id
      )

      console.log("Past dbFunctions updateScript function")

      return { success: true }
    } catch (error) {
      // For debugging
      console.error('Script update error', error);
      return fail(500, {
        error: error instanceof Error ? error.message : 'Failed to update the script',
        details: error instanceof Error ? error.stack : "Stack not available"
      });
    }
  },
  editSelection: async ({ request, locals: { session } }) => {
    const formData = await request.formData();
    const actionType = formData.get('action')?.toString();
    const userSelection = formData.get('user_selection')?.toString();

    if (!actionType) {
      return fail(400, {
        error: 'No action type was received'
      })
    }

    if (!userSelection) {
      return fail(400, {
        error: 'No user selection was received'
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
        error: error instanceof Error ? error.message : 'Failed to rephrase or expand on the text'
      })
    }
  }
}
