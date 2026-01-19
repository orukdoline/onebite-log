import { updateComment } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { Comment, useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateComment(callbacks?: useMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComment, // 수정한 댓글을 데이터베이스에 저장하는 비동기 함수 호출.
    onSuccess: (updatedComment) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      // 데이터베이스에서 수정한 댓글을 comments키 캐시 저장소에서 찾아서 수정.
      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.comment.post(updatedComment.post_id),
        (comments) => {
          if (!comments)
            throw new Error("댓글이 캐시 데이터가 보관되어 있지 않습니다.");
          return comments.map((comment) => {
            if (comment.id === updatedComment.id)
              return { ...comment, ...updatedComment };
            return comment;
          });
        },
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
