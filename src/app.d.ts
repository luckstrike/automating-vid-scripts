// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SupabaseClient } from '@supabase/supabase-js';
import 'unplugin-icons/types/svelte';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
      session: Session | null
      user: User | null
    }
    interface PageData {
      session: Session | null
    }
    interface Env {
      OPENAI_API_KEY: string;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
