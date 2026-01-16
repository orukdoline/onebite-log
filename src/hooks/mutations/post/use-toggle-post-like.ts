import { togglePostLike } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { Post, useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useTogglePostLike(callbacks?: useMutationCallback) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: togglePostLike,
    onMutate: async ({ postId }) => {
      // 이미 진행 중인 fetchPostById(postId)가 있으면 취소 처리.
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.post.byId(postId),
      });

      // 좋아요 요청을 실패하였을 때 낙관적으로 업데이트한 캐시 데이터를 복구하기 위해 현재 캐시에 있는 원래 상태를 저장.
      const prevPost = queryClient.getQueryData<Post>(
        QUERY_KEYS.post.byId(postId),
      );

      // 캐시 데이터를 낙관적으로 업데이트.
      // queryKey : 수정할 캐시 대상, updater 함수 : 이전 캐시 값을 받아서 새로운 캐시 값을 반환.
      queryClient.setQueryData<Post>(QUERY_KEYS.post.byId(postId), (post) => {
        if (!post) throw new Error("포스트가 존재하지 않습니다.");
        return {
          ...post,
          isLiked: !post.isLiked,
          like_count: post.isLiked ? post.like_count - 1 : post.like_count + 1,
        };
      });

      return {
        prevPost, // context 값.
      };
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error, _, context) => {
      // 에러가 발생했다면 context를 활용하여 onMutate에서 저장해둔 prevPost를 캐시에 다시 넣어 원래 상태로 복구.
      if (context && context.prevPost) {
        queryClient.setQueryData(
          QUERY_KEYS.post.byId(context.prevPost.id),
          context.prevPost,
        );
      }
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
