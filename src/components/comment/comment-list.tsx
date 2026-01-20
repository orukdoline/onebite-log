import CommentItem from "@/components/comment/comment-item";
import { useCommentData } from "@/hooks/queries/use-comment-data";
import FallBack from "../fallback";
import Loader from "../loader";
import type { Comment, NestedComment } from "@/types";

// supabase에서 불러온 댓글 데이터들을 트리 형식으로 변환하는 함수.
function toNestedComments(comments: Comment[]): NestedComment[] {
  const result: NestedComment[] = [];

  comments.forEach((comment) => {
    // 만약 순회 중인 댓글에 루트 댓글이 없다면 result 배열에 저장.
    if (!comment.root_comment_id) {
      result.push({ ...comment, children: [] });
    }
    // 만약 루트 댓글이 있다면 루트 댓글의 index 정보를 찾은 후 루트 댓글의 children 배열에 저장.
    else {
      const rootCommentIndex = result.findIndex(
        (item) => item.id === comment.root_comment_id,
      );
      // supabase에서 불러온 댓글 데이터들 중 부모 댓글에 해당하는 데이터 추출.
      const parentComment = comments.find(
        (item) => item.id === comment.parent_comment_id,
      );

      // 비정상적인 접근 예외 처리.
      if (rootCommentIndex === -1) return;
      if (!parentComment) return;

      result[rootCommentIndex].children.push({
        ...comment,
        children: [],
        parentComment: parentComment,
      });
    }
  });
  return result;
}

export default function CommentList({ postId }: { postId: number }) {
  // 댓글 조회와 관련된 reactQuery.
  const {
    data: comments,
    error: fetchCommentsError,
    isPending: isFetchCommentPending,
  } = useCommentData(postId);

  if (fetchCommentsError) return <FallBack />; // 댓글 조회를 실패하면 오류 페이지 노출.
  if (isFetchCommentPending) return <Loader />; // 댓글 조회를 진행 중이면 로딩 페이지 노출.

  const NestedComments = toNestedComments(comments); // 댓글 데이터들을 트리 형식으로 변환.

  return (
    <div className="flex flex-col gap-5">
      {NestedComments.map((comment) => (
        // NestedComments에 저장되어있는 댓글들을 순회하며 하나씩 노출.
        <CommentItem key={comment.id} {...comment} />
      ))}
    </div>
  );
}
