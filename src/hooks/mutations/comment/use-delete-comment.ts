import { deleteComment } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { Comment, useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteComment(callbacks?: useMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment, // 댓글을 데이터베이스에서 삭제하는 비동기 함수 호출.
    onSuccess: (deletedComment) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      // 데이터베이스에서 삭제한 댓글을 comments키 캐시 저장소에서 찾아서 삭제.
      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.comment.post(deletedComment.post_id),
        (comments) => {
          if (!comments)
            throw new Error("댓글이 캐시 데이터에 보관되어 있지 않습니다.");
          return comments.filter((comment) => comment.id !== deletedComment.id);
        },
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
