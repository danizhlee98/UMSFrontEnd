// toastProvider.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Toast } from "./toast";
import { ToastType } from "@/app/type/toastType";

type ToastMessage = {
  id: number;
  message: string;
  type?: ToastType;
  duration?: number;
};

interface ToastContextProps {
  showToast: (msg: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (msg: Omit<ToastMessage, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...msg }]);

    // auto remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, msg.duration ?? 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} duration={t.duration} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.showToast;
};
