import { redirect } from '@sveltejs/kit'

import type { Actions } from '../$types'

export const actions: Actions = {
  githubSignIn: async ({ locals: { supabase }, url }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: url.origin + "/auth/callback" // Send the user back to the homepage
      }
    })

    if (error) {
      console.error(error)
      throw redirect(303, '/auth/error')
    }

    throw redirect(303, data.url)
  },

  googleSignIn: async ({ locals: { supabase }, url }) => {
    console.log('Starting OAuth flow');
    console.log('Redirect URL:', `${url.origin}/auth/callback`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${url.origin}/auth/callback`,
        scopes: 'email profile'
      }
    });

    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('OAuth error:', error);
      throw redirect(303, '/auth/error');
    }

    return { status: 303, headers: { location: data.url } };
  }
}
