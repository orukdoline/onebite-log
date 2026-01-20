import { createComment } from "@/api/comment";
import { useProfileData } from "@/hooks/queries/use-profile-data";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";
import type { Comment, useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateComment(callbacks?: useMutationCallback) {
  const queryClient = useQueryClient();
  const session = useSession();
  const { data: profile } = useProfileData(session?.user.id);

  return useMutation({
    mutationFn: createComment, // 새로운 댓글을 데이터베이스에 삽입하는 비동기 함수 호출.
    onSuccess: (newComment) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      // 데이터베이스에 삽입한 새로운 댓글을 comments키 캐시 저장소에 삽입.
      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.comment.post(newComment.post_id),
        (comments) => {
          if (!comments)
            throw new Error("댓글이 캐시 데이터에 보관되어있지 않습니다.");
          if (!profile)
            throw new Error("사용자의 프로필 정보를 찾을 수 없습니다.");
          return [...comments, { ...newComment, author: profile }];
        },
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
