import { json, type RequestHandler } from '@sveltejs/kit'

// /api/randomidea POST
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();

    console.log(data.prompt)

    return json({
        success: true,
        response: 'Hello from the server!'
    })
}