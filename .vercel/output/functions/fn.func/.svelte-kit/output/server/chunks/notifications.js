import { w as writable, d as derived } from "./index2.js";
import { g as generateID } from "./utils.js";
const NOTIFICATION_TIMEOUT = 3e3;
const createNotificationStore = () => {
  const _notifications = writable([]);
  const send = (message, type) => {
    _notifications.update((state) => {
      if (state.length && message === state[state.length - 1].message) {
        if (state[state.length - 1].shake) {
          state[state.length - 1].shake = false;
        } else {
          state[state.length - 1].shake = true;
        }
        return state;
      } else {
        return [
          ...state,
          { id: "_" + generateID(), type, message, shake: false }
        ];
      }
    });
  };
  const notifications2 = derived(_notifications, ($_notifications, set) => {
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
  const { subscribe } = notifications2;
  return {
    subscribe,
    send,
    danger: (msg) => send(msg, "danger"),
    warning: (msg) => send(msg, "warning"),
    info: (msg) => send(msg, "info"),
    success: (msg) => send(msg, "success")
  };
};
const notifications = createNotificationStore();
export {
  notifications as n
};
