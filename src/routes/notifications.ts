import { writable, derived } from "svelte/store";

const NOTIFICATION_TIMEOUT = 3000;

const createNotificationStore = () => {
  const _notifications = writable([]);

  const send = (message: string, type = "default") => {
    _notifications.update((state) => {
      console.log(state);
      if (state.length && message == state[state.length - 1].message) {
        if (state[state.length - 1].shake) {
          state[state.length - 1].shake = false;
        } else {
          state[state.length - 1].shake = true;
        }
        return state;
      } else {
        return [...state, { id: id(), type, message }];
      }
    });
  };

  let timers = [];

  const notifications = derived(_notifications, ($_notifications, set) => {
    set($_notifications);
    if ($_notifications.length > 0) {
      const timeout = setTimeout(() => {
        _notifications.update((state) => {
          state.shift();
          return state;
        });
      }, NOTIFICATION_TIMEOUT);
      return () => {
        clearTimeout(timeout);
      };
    }
  });
  const { subscribe } = notifications;

  return {
    subscribe,
    send,
    danger: (msg: string) => send(msg, "danger"),
    warning: (msg: string) => send(msg, "warning"),
    info: (msg: string) => send(msg, "info"),
    success: (msg: string) => send(msg, "success"),
  };
};

function id() {
  return "_" + Math.random().toString(36).substring(7);
}

export const notifications = createNotificationStore();
