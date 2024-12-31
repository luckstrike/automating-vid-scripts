import type { SupabaseClient } from '@supabase/supabase-js/dist/module/types'
import type { Script } from '$lib';

export async function getScripts(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('scripts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getScript(supabase: SupabaseClient, scriptId: string, userId: string) {
  const { data, error } = await supabase
    .from('scripts')
    .select('*')
    .eq('id', scriptId)
    .eq('user_id', userId)
    .single()

  if (error) {
    throw error;
  }

  return data;
}

export async function createScript(
  supabase: SupabaseClient,
  script: Omit<Script, 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('scripts')
    .insert(script)
    .select()
    .single()

  if (error) {
    console.log(error)
    throw error;
  }

  return data;
}

export async function updateScript(
  supabase: SupabaseClient,
  scriptId: string,
  updates: Partial<Omit<Script, 'id' | 'created_at' | 'updated_at'>>,
  userId: string
) {

  const { error } = await supabase
    .from('scripts')
    .update(updates)
    .eq('id', scriptId)
    .eq('user_id', userId) // ensure the user owns the script
    .select()
    .single()

  console.log("Past dbFunctions updateScript (actual DB update)");

  if (error) {
    console.error('Database update failed: ', error)
    throw error;
  }

  return true;
}

export async function deleteScript(supabase: SupabaseClient, scriptId: string, userId: string) {
  const { error } = await supabase
    .from('scripts')
    .delete()
    .eq('id', scriptId)
    .eq('user_id', userId)

  if (error) {
    throw error;
  }

  return true;
}
