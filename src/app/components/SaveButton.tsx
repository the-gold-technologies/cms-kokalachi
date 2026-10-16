import React from "react";
import { Save, Check, Loader2 } from "lucide-react";

interface SaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  saved?: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  label = "Save Changes",
  icon,
  className = "",
  disabled,
  loading = false,
  saved = false,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`w-full bg-[#0E5A60] cursor-pointer text-white px-8 py-3.5 rounded-xl font-semibold tracking-wide hover:bg-[#0A4347] transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2.5 ${
        isDisabled ? "opacity-75 cursor-not-allowed" : ""
      } ${saved ? "bg-emerald-600 hover:bg-emerald-700" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : saved ? (
        <Check className="w-4 h-4" />
      ) : icon ? (
        icon
      ) : (
        <Save className="w-4 h-4" />
      )}
      <span>{loading ? "Saving..." : saved ? "Saved!" : label}</span>
    </button>
  );
};
