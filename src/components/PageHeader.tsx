import React, { Dispatch, SetStateAction } from "react";
import { Plus, Trash2 } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
  action?: {
    label: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
  };
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  deleteAction?: {
    label: string;
    onDelete: () => void;
  };
}

export function PageHeader({
  title,
  description,
  badge,
  children,
  action,
  setIsOpen,
  deleteAction,
}: PageHeaderProps) {
  return (
    <header className="flex justify-between items-center w-full">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight flex items-center gap-3">
          {title}
          {badge && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#D8232A]">
              {badge}
            </span>
          )}
        </h3>
        {description && (
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {deleteAction && (
          <button
            type="button"
            onClick={deleteAction.onDelete}
            className="inline-flex items-center gap-2 px-6 py-3 border border-red-100 text-red-500 font-semibold rounded-full hover:bg-red-50 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            {deleteAction.label}
          </button>
        )}

        {action && (
          <div className="mt-4 sm:ml-4 sm:mt-0">
            <button
              type="button"
              onClick={() => {
                if (action.onClick) {
                  action.onClick();
                } else {
                  setIsOpen?.(true);
                }
              }}
              className="inline-flex items-center gap-2 w-fit px-6 bg-[#0B0F29] text-white font-semibold py-3 rounded-full hover:bg-black transition-all hover:border-[#D8232A] hover:shadow-[0_0_25px_rgba(216,35,42,0.4)] cursor-pointer text-sm"
            >
              {action.icon ? action.icon : <Plus className="-ml-0.5 h-4 w-4" strokeWidth={3} />}
              {action.label}
            </button>
          </div>
        )}

        {children}
      </div>
    </header>
  );
}
