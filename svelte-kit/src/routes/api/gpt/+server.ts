import { json, type RequestHandler } from '@sveltejs/kit'
import OpenAI from "openai";

// Setting up access to the OpenAI API
const OPENAI_API_KEY: string | undefined = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// NOTE: This prompt can be refined over time, maybe even be a feature for the user to change
const brainstormPrompt: string = `You are a helpful assistant who provides, users with key bullet points
                                related to a user provided video topic. If the user specifies that they want
                                ideas related to a random topic you should provided bullet points to them
                                about a random topic that could be turned into a video. The topic may be
                                about anything, you can decide that! Just make sure to focus on one topic 
                                and if you feel like it provide the user with some pointers they can use to
                                branch from that idea`

// TODO: Make GPT format this is bullet point HTML so it can generate a new script
async function brainstormGPT(openai: OpenAI, userInput: string) {
    const completion = await openai.chat.completions.create({
        messages: [
            { 
                role: "system", 
                content: brainstormPrompt
            },
            {
                role: "user",
                content: userInput
            }
        ],
        model: "gpt-3.5-turbo",
    });
  
    console.log(completion.choices[0].message.content);
}

// /api/randomidea POST
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();

    console.log(data)

    // Use the OpenAI API here
    if (data.prompt != "") {
        brainstormGPT(openai, data.prompt);
    } else {
        let randomIdea: string = "";
        brainstormGPT(openai, "I'm not really sure what to write about");
    }
    

    return json({
        success: true
    })
}