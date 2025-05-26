// src/hooks/useToast.js
import { useEffect, useState } from "react";

const TOAST_DURATION = 3000;
const TOAST_LIMIT = 3;

let count = 0;
const genId = () => (++count).toString();

const listeners = [];
let memoryState = { toasts: [] };

const dispatch = (action) => {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId ? { ...t, open: false } : t
        ),
      };
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

export const toast = ({ message, type = "info", duration = TOAST_DURATION }) => {
  const id = genId();
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  const toastData = {
    id,
    message,
    type,
    open: true,
    onOpenChange: (open) => {
      if (!open) dismiss();
    },
  };

  dispatch({ type: "ADD_TOAST", toast: toastData });

  setTimeout(() => {
    dismiss();
    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", toastId: id });
    }, 500); // Give some time for close animation
  }, duration);

  return { id, dismiss };
};

export const useToast = () => {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
};
