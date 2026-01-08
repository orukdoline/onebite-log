import { signUp } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

// 회원가입을 요청하는 Mutation.
export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  });
}
