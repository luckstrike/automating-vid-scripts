import { writable } from 'svelte/store';   

export const scriptIdStore = writable<string | null>(null);