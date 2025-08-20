import React from "react";
import { Loader2 } from "lucide-react";

type ButtonType = "primary" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pending?: boolean;
  typeStyle?: ButtonType; 
}

const Button: React.FC<ButtonProps> = ({
  pending = false,
  disabled = false,
  typeStyle = "primary",
  children,
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium flex items-center justify-center transition-colors duration-200";

  const typeClasses =
    typeStyle === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-200 text-gray-900 hover:bg-gray-300";

  const disabledClasses = disabled || pending ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseClasses} ${typeClasses} ${disabledClasses}`}
      disabled={disabled || pending}
      {...props}
    >
      {pending && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
      {children}
    </button>
  );
};

export default Button;
