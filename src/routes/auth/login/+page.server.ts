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
      return redirect(303, '/auth/error')
    }

    return redirect(303, data.url)
  },

  // TODO: Change this to googleSignIn
  handleAuthCallback: async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get('code')

    if (code) {
      await supabase.auth.exchangeCodeForSession(code)
    }

    return redirect(303, '/dashboard')
  }
}
