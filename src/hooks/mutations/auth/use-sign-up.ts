import { signUp } from "@/api/auth";
import type { useMutationCallback } from "@/types";
import { useMutation } from "@tanstack/react-query";

// 회원가입을 요청하는 Mutation.
export function useSignUp(callbacks?: useMutationCallback) {
  return useMutation({
    mutationFn: signUp,
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
