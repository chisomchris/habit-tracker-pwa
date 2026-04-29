import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useRoute = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (filters: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(filters).forEach(([key, value]) => {
        params.set(key, value);
      });
      return params.toString();
    },
    [searchParams],
  );

  const goTo = (filters: Record<string, string> | null) => {
    console.log("Go To Internal");
    if (filters === null) {
      return router.push(pathname);
    }
    router.push(pathname + "?" + createQueryString(filters));
  };
  return { goTo };
};
