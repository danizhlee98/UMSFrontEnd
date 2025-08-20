"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { ToastType } from "../../type/toastType";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // in ms, default 3000
  onClose?: () => void;
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={clsx(
        "fixed bottom-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white animate-fade-in",
        type === "success" && "bg-green-600",
        type === "error" && "bg-red-600",
        type === "info" && "bg-blue-600"
      )}
    >
      {message}
    </div>
  );
}
