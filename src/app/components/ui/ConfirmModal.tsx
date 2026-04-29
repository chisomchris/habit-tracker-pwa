"use client";

import { useEffect } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />
      <div className="relative z-10 mx-auto w-[min(92vw,520px)] rounded-xl bg-card p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-3 text-subtle-foreground">{description}</p>
        ) : null}

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            className="bg-card-muted px-6"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            variant={destructive ? "secondary" : "primary"}
            className={cn(
              "px-6",
              destructive && "bg-secondary hover:bg-secondary-hover",
            )}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
