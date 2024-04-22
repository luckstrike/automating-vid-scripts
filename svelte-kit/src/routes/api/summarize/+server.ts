import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {

    let data: string | null = null;

    try {
        data = await request.json();
    } catch (e) {
        console.error("Unable to handle a POST request /api/randomidea")
        return json({ success: false, error: "Bad request" }, { status: 400 })
    }
}