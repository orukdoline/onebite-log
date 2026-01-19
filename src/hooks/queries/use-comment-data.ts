import { fetchComments } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useCommentData(postId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.comment.post(postId), // 쿼리 키 설정.
    queryFn: () => fetchComments(postId), // 댓글을 조회하는 비동기 함수 호출.
  });
}
