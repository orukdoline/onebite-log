import { Link } from "react-router";
import defaultAvatar from "@/assets/default-avatar.jpg";
import type { Comment } from "@/types";
import { formatTimeAgo } from "@/lib/time";
import { useSession } from "@/store/session";
import { useState } from "react";
import CommentEditor from "./comment-editor";
import { useDeleteComment } from "@/hooks/mutations/comment/use-delete-comment";
import { toast } from "sonner";
import { useOpenAlertModal } from "@/store/alert-modal";

export default function CommentItem(props: Comment) {
  const session = useSession();
  const isMine = session?.user.id === props.author_id;

  const [isEditing, setIsEditing] = useState(false); // 댓글 입력창 노출과 관련된 state.

  // 수정 버튼을 클릭하거나 수정 후 작성 버튼을 클릭하면 isEditing을 반전.
  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };

  // 댓글 삭제와 관련된 mutation.
  const { mutate: deleteComment, isPending: isDeleteCommentPending } =
    useDeleteComment({
      onError: (error) => {
        toast.error("댓글 삭제을 실패했습니다.", { position: "top-center" });
      },
    });

  const openAlertModal = useOpenAlertModal(); // 모달 창을 여닫는 store 호출.

  // 댓글 삭제 버튼과 관련된 이벤트 핸들러.
  const handleDeleteClick = () => {
    openAlertModal({
      title: "댓글 삭제",
      description: "삭제된 댓글은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?",
      onPositive: () => {
        deleteComment(props.id); // 사용자가 긍적적인 응답을 하면 댓글 삭제 mutation 호출.
      },
    });
  };

  return (
    <div className={"flex flex-col gap-8 border-b pb-5"}>
      <div className="flex items-start gap-4">
        <Link to={"#"}>
          <div className="flex h-full flex-col">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={props.author.avatar_url || defaultAvatar}
            />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-2">
          <div className="font-bold">{props.author.nickname}</div>
          {
            // 댓글 수정 중이면 댓글 입력 관련 컴포넌트 노출.
            isEditing ? (
              <CommentEditor
                type={"EDIT"}
                commentId={props.id}
                initialContent={props.content}
                onClose={toggleIsEditing}
              />
            ) : (
              // 댓글 수정 중이 아니라면 댓글 내용 노출.
              <div>{props.content}</div>
            )
          }

          <div className="text-muted-foreground flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer hover:underline">댓글</div>
              <div className="bg-border h-[13px] w-[2px]"></div>
              <div>{formatTimeAgo(props.created_at)}</div>
            </div>
            {
              // 로그인한 사용자의 댓글만 수정, 삭제 버튼 노출.
              isMine && (
                <div className="flex items-center gap-2">
                  <div
                    onClick={toggleIsEditing}
                    className="cursor-pointer hover:underline"
                  >
                    수정
                  </div>
                  <div className="bg-border h-[13px] w-[2px]"></div>
                  <div
                    onClick={handleDeleteClick}
                    className="cursor-pointer hover:underline"
                  >
                    삭제
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
