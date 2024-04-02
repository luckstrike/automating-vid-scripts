import { writable } from 'svelte/store';   

export const scriptIdStore = writable<string | null>(null);
export const scriptMetaIdStore = writable<string | null>(null);

export const scriptSaveStatus = writable<boolean>(false);