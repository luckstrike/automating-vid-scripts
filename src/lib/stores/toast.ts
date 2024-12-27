// src/lib/stores/toast.ts
import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const MAX_TOASTS: number = 3;
const DEFAULT_DURATION: number = 3000;

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);
  let queue: Toast[] = [];

  function processQueue() {
    update(toasts => {
      if (toasts.length < MAX_TOASTS && queue.length > 0) {
        const nextToast = queue.shift()!;
        scheduleRemoval(nextToast.id, nextToast.duration);
        return [...toasts, nextToast];
      }
      return toasts;
    });
  }

  function scheduleRemoval(id: string, duration = DEFAULT_DURATION) {
    setTimeout(() => {
      remove(id);
      processQueue();
    }, duration);
  }

  function show(message: string, type: ToastType = 'info', duration = DEFAULT_DURATION) {
    const toast: Toast = {
      id: crypto.randomUUID(),
      message,
      type,
      duration
    };

    update(toasts => {
      if (toasts.length >= MAX_TOASTS) {
        queue.push(toast);
        return toasts;
      }

      scheduleRemoval(toast.id, duration);
      return [...toasts, toast];
    });
  }

  function remove(id: string) {
    update(toasts => toasts.filter(t => t.id !== id));
  }

  return {
    subscribe,
    show,
    remove,
    clearAll: () => {
      queue = [];
      update(() => []);
    }
  };
}

export const toastStore = createToastStore();
