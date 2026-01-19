import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCreateComment } from "@/hooks/mutations/comment/use-create-comment";
import { toast } from "sonner";
import { useUpdateComment } from "@/hooks/mutations/comment/use-update-comment";

type CreateMode = {
  type: "CREATE";
  postId: number;
};

type EditMode = {
  type: "EDIT";
  commentId: number;
  initialContent: string;
  onClose: () => void;
};

type Props = CreateMode | EditMode;

export default function CommentEditor(props: Props) {
  const [content, setContent] = useState(""); // 댓글 내용과 관련된 state.

  // 댓글 추가와 관련된 mutation.
  const { mutate: createComment, isPending: isCreateCommentPending } =
    useCreateComment({
      onSuccess: () => {
        setContent(""); // 댓글 추가를 성공하면 content state를 초기화.
      },
      onError: () => {
        toast.error("댓글 추가를 실패했습니다.", { position: "top-center" });
      },
    });

  // 댓글 수정과 관련된 mutation.
  const { mutate: updateComment, isPending: isUpdateCommentPending } =
    useUpdateComment({
      onSuccess: () => {
        (props as EditMode).onClose(); // 댓글 수정을 성공하면 isEditing 값을 반전시켜 입력 창을 미노출.
      },
      onError: () => {
        toast.error("댓글 수정을 실패했습니다.", { position: "top-center" });
      },
    });

  // 댓글 작성 버튼과 관련된 이벤트 핸들러.
  const handleSubmitClick = () => {
    if (content.trim() === "") return;

    if (props.type === "CREATE") {
      // props의 type이 CREATE라면 댓글 추가 mutation 호출.
      createComment({ postId: props.postId, content });
    } else {
      // props의 type이 EDIT라면 댓글 수정 mutation 호출.
      updateComment({
        id: props.commentId,
        content,
      });
    }
  };

  // 댓글 추가 로직이나 댓글 수정 로직이 수행 중이라면 true 반환.
  const isPending = isCreateCommentPending || isUpdateCommentPending;

  // props의 type이 EDIT라면 content state에 기존 댓글 내용을 저장.
  useEffect(() => {
    if (props.type === "EDIT") {
      setContent(props.initialContent);
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        disabled={isPending}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        {
          // props의 type이 EDIT라면 취소 버튼 노출.
          props.type === "EDIT" && (
            <Button
              disabled={isPending}
              variant={"outline"}
              onClick={() => props.onClose()}
            >
              취소
            </Button>
          )
        }
        <Button disabled={isPending} onClick={handleSubmitClick}>
          작성
        </Button>
      </div>
    </div>
  );
}
