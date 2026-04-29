"use client";

import { useEffect, useRef, useState } from "react";
import { Habit } from "@/types/habit";
import { cn } from "@/lib/utils";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { createHabit, updateHabit } from "@/lib/storage";
import { useSession } from "@/app/hooks/useSession";
import { useRoute } from "@/app/hooks/useRoute";
import { useHabits } from "@/app/hooks/useHabits";
import { validateHabitName } from "@/lib/validators";
import { getHabitSlug } from "@/lib/slug";

type Mode = "create" | "edit";

type FormErrors = Partial<Record<string, string>>;

export function HabitForm({
  open,
  mode,
  onClose,
  targetId,
}: {
  open: boolean;
  mode: Mode;
  targetId: string | null;
  onClose: () => void;
}) {
  const session = useSession();
  const { habits } = useHabits();
  const { goTo } = useRoute();
  const { getHabit } = useHabits();
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      // 1. Store the element that triggered the open (e.g., the "Add" button)
      previousFocusRef.current = document.activeElement as HTMLElement;

      // 2. Focus the input after the modal enters the DOM
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 60); // Slightly longer delay for mobile keyboard stability

      return () => clearTimeout(timer);
    } else {
      // 3. Return focus to the trigger element when the form closes
      // We check if it exists to avoid errors on initial mount
      previousFocusRef.current?.focus();
    }
  }, [open]);

  let defaultValues: Pick<Habit, "id" | "name" | "description"> = {
    id: "",
    name: "",
    description: "",
  };

  if (targetId) {
    defaultValues = getHabit(targetId) as Habit;
  }
  const title =
    mode === "edit" ? (
      <>
        Edit Habit: <span className="text-primary">{defaultValues?.name}</span>
      </>
    ) : (
      <>
        Create a <span className="text-primary">New Habit</span>
      </>
    );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const description = (formData.get("description") || "") as string;
    if (typeof name !== "string") {
      throw Error("Invalid input");
    }
    if (typeof description !== "string") {
      throw Error("Invalid input");
    }
    const parsedName = validateHabitName(name);
    if (!parsedName.valid) {
      setErrors({ name: parsedName.error as string });
      return;
    }

    if (!session) return;
    if (mode === "create") {
      const slugExists = habits.some(
        (habit) => getHabitSlug(habit.name) === getHabitSlug(name),
      );

      if (slugExists) {
        setErrors({ name: "Please use another name" });
        return;
      }
      createHabit(session.userId, {
        name: parsedName.value,
        description,
        frequency: "daily",
      });
    }

    if (mode === "edit") {
      updateHabit(defaultValues.id, {
        name,
        description,
      });
    }

    goTo(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close invoice form"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <aside
        className={cn(
          "absolute left-0 top-0 h-full w-full bg-background shadow-2xl rounded-tr-2xl overflow-hidden min-[640px]:rounded-br-2xl",
          "sm:w-150 md:w-170",
        )}
      >
        <div className="wrapper pt-8 pb-4 border-b border-border">
          <h2>{title}</h2>
        </div>
        <form
          className="flex h-full flex-col"
          data-testid="habit-form"
          onSubmit={onSubmit}
        >
          <div className="flex-1 overflow-auto px-6 pb-28">
            <Field label="Habit Name" error={errors["name"]}>
              <Input
                error={errors["bill_from.address.street"]}
                name="name"
                data-testid="habit-name-input"
                defaultValue={defaultValues?.name || ""}
                ref={inputRef}
                onChange={() => setErrors({})}
              />
            </Field>

            <Field label="Description" error={errors["description"]}>
              <textarea
                name="description"
                data-testid="habit-description-input"
                defaultValue={defaultValues?.description || ""}
                className={cn(
                  "w-full h-24 rounded-md bg-card border px-4 py-3 text-foreground outline-none transition-colors",
                  "placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/40",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  `${errors.description ? "border-secondary" : "border-border"}`,
                )}
              ></textarea>
            </Field>

            <Field label="Frequency">
              <select
                name="description"
                data-testid="habit-frequency-input"
                defaultValue={"daily"}
                disabled
                className={cn(
                  "w-full rounded-md bg-card border px-4 py-3 text-foreground outline-none transition-colors",
                  "placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/40",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  `${errors.description ? "border-secondary" : "border-border"}`,
                )}
              >
                <option value="daily">Daily</option>
                <option value="daily">Weekly</option>
              </select>
            </Field>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-card px-6 py-4 min-[640px]:rounded-tr-2xl min-[640px]:rounded-br-2xl">
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                className="bg-card-muted px-4 text-nowrap"
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>

              <Button
                className="px-4 text-nowrap"
                type="submit"
                data-testid="habit-save-button"
              >
                {mode === "edit" ? "Update" : "Create"} Habit
              </Button>
            </div>
          </div>
        </form>
      </aside>
    </div>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mt-4 ">
      <div className="flex items-center justify-between">
        <span className={cn("text-subtle-foreground")}>{label}</span>
        {error ? <span className="text-secondary">{error}</span> : null}
      </div>
      <div className="mt-2">{children}</div>
    </label>
  );
}
