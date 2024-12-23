import { json } from '@sveltejs/kit';
import { checkIfAllowed } from '$lib/server/parser';

export async function POST({ request, locals }) {
  const { url } = await request.json();

  try {
    new URL(url);
  } catch (error) {
    return json({ isAllowed: false, success: false }); // URL isn't valid
  }

  try {
    let result = await checkIfAllowed(url);
    return json({
      isAllowed: result,
      success: true
    });
  } catch (error) {
    return json({ isAllowed: true, success: true }); // If no robots.txt or error, assume allowed
  }
}
