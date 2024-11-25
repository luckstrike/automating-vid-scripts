import { writable } from 'svelte/store';

export const scriptIdStore = writable<string | null>(null);
export const saveStatus = writable<'saved' | 'saving' | 'error'>('saved');
