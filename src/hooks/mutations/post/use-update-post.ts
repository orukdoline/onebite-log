import { updatePost } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { Post, useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdatePost(callbacks?: useMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      // React Query 캐시를 직접 수정.
      queryClient.setQueryData<Post>(
        QUERY_KEYS.post.byId(updatedPost.id),
        (prevPost) => {
          // prevPost는 setQueryData가 실행될 때 현재 캐시에 들어있는 값을 자동으로 넘겨줌.
          if (!prevPost)
            throw new Error(
              `${updatedPost.id}에 해당하는 포스트를 캐시 데이터에서 찾을 수 없습니다.`,
            ); // 잘못된 로직 설계로 인해 prevPost 데이터를 불러올 수 없다면 예외 처리.
          return { ...prevPost, ...updatedPost }; // 수정할 게시글의 기존 데이터에서 변경된 필드만 덮어씀.
        },
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
