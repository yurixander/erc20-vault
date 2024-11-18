"use client";

import { create } from "zustand";
import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/Toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 10_000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

interface ToastState {
  toasts: ToasterToast[];
  addToast: (toast: Omit<ToasterToast, "id">) => void;
  updateToast: (toast: Partial<ToasterToast> & { id: string }) => void;
  dismissToast: (toastId?: string) => void;
  removeToast: (toastId: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = genId();

    const newToast = {
      ...toast,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) get().dismissToast(id);
      },
    };

    set((state) => ({
      toasts: [newToast, ...state.toasts].slice(0, TOAST_LIMIT),
    }));

    setTimeout(() => get().removeToast(id), TOAST_REMOVE_DELAY);
  },
  updateToast: (toast) => {
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === toast.id ? { ...t, ...toast } : t
      ),
    }));
  },
  dismissToast: (toastId) => {
    if (toastId) {
      set((state) => ({
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      }));
      setTimeout(() => get().removeToast(toastId), TOAST_REMOVE_DELAY);
    } else {
      const { toasts } = get();

      set(() => ({
        toasts: toasts.map((t) => ({ ...t, open: false })),
      }));

      toasts.forEach((toast) =>
        setTimeout(() => get().removeToast(toast.id), TOAST_REMOVE_DELAY)
      );
    }
  },
  removeToast: (toastId) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== toastId),
    }));
  },
}));

// Helper function to generate unique IDs
let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;

  return count.toString();
}

const useToast = () => {
  const { toasts, addToast, updateToast, dismissToast } = useToastStore();

  const toast = React.useCallback(
    (props: Omit<ToasterToast, "id">) => {
      addToast(props);
    },
    [addToast]
  );

  return {
    toasts,
    toast,
    dismiss: dismissToast,
    update: updateToast,
  };
};

export default useToast;
