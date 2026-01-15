import { createPostWithImages } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreatePost(callbacks?: useMutationCallback) {
  const queryClient = useQueryClient(); // 모든 쿼리를 관리하는 중앙 관리자.

  return useMutation({
    mutationFn: createPostWithImages,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      queryClient.resetQueries({
        queryKey: QUERY_KEYS.post.list, // 해당 키를 갖는 모든 데이터 전부 초기화.
      });
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
