import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

export function Logout() {
  let [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <Button
        data-testid="auth-logout-button"
        variant="ghost"
        className="flex items-center text-secondary hover:bg-[#fefefe] transition-colors py-2 px-4"
        aria-label="Logout"
        onClick={open}
      >
        <LogOut size={24} />
        <span className="hidden sm:inline">Logout</span>
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
              <DialogTitle as="h3">Confirm Logout</DialogTitle>
              <p className="mt-2 text-black/60">
                Are you sure you want to logout?
              </p>
              <div className="mt-6 flex gap-4 justify-end">
                <Button
                  variant="outline"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-black"
                  onClick={close}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  data-testid="auth-confirm-logout-button"
                  className="inline-flex items-center gap-2 px-3 py-1.5"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
