import { signInWithPassword } from "@/api/auth";
import type { useMutationCallback } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useSignInWithPassword(callbacks?: useMutationCallback) {
  return useMutation({
    mutationFn: signInWithPassword,
    onError: (error) => {
      // 로그인 에러가 발생하였을 때.
      console.error(error);

      if (callbacks?.onError) callbacks?.onError(error);
    },
  });
}
