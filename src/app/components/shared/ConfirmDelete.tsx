import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { deleteHabit } from "@/lib/storage";

export function ConfirmDelete({ slug, id }: { slug: string; id: string }) {
  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  const handleDelete = () => {
    deleteHabit(id);
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={open}
        data-testid={`habit-delete-${slug}`}
        className="p-3 hover:text-secondary transition-colors"
        aria-label="Delete Habit"
      >
        <Trash2 size={20} />
      </Button>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/25">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="max-w-md rounded-xl p-4 bg-white text-black w-[96%] backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <DialogTitle as="h3">Confirm Delete</DialogTitle>
              <p className="mt-2 text-black/60">
                Are you sure you want to delete habit {slug}? <br /> This action
                cannot be undone
              </p>
              <div className="mt-6 flex gap-4 justify-end">
                <Button
                  variant="outline"
                  className="inline-flex text-black items-center gap-2 px-3 py-1.5"
                  onClick={close}
                >
                  Cancel
                </Button>
                <Button
                  data-testid="confirm-delete-button"
                  variant="secondary"
                  className="inline-flex items-center gap-2 px-3 py-1.5"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
