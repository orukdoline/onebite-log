import CommentItem from "@/components/comment/comment-item";
import { useCommentData } from "@/hooks/queries/use-comment-data";
import FallBack from "../fallback";
import Loader from "../loader";

export default function CommentList({ postId }: { postId: number }) {
  // 댓글 조회와 관련된 reactQuery.
  const {
    data: comments,
    error: fetchCommentsError,
    isPending: isFetchCommentPending,
  } = useCommentData(postId);

  if (fetchCommentsError) return <FallBack />; // 댓글 조회를 실패하면 오류 페이지 노출.
  if (isFetchCommentPending) return <Loader />; // 댓글 조회를 진행 중이면 로딩 페이지 노출.

  return (
    <div className="flex flex-col gap-5">
      {comments.map((comment) => (
        // comments에 저장되어있는 댓글들을 순회하며 하나씩 노출.
        <CommentItem key={comment.id} {...comment} />
      ))}
    </div>
  );
}
