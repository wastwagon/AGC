"use client";

import { Trash2 } from "lucide-react";

type DeleteButtonProps = {
  action: () => Promise<void>;
  label?: string;
  confirmMessage?: string;
};

export function DeleteButton({
  action,
  label = "Delete",
  confirmMessage = "Are you sure you want to delete this? This cannot be undone.",
}: DeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      className="inline"
    >
      <button
        type="submit"
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-700"
        aria-label={label}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
