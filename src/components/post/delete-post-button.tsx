import { useOpenAlertModal } from "@/store/alert-modal";
import { Button } from "../ui/button";
import { useDeletePost } from "@/hooks/mutations/post/use-delete-post";
import { toast } from "sonner";

export default function DeletePostButton({ id }: { id: number }) {
  const openAlertModal = useOpenAlertModal();

  const { mutate: deletePost, isPending: isDeletePostPending } = useDeletePost({
    onError: (error) => {
      toast.error("포스트 삭제에 실패했습니다.", { position: "top-center" });
    },
  });

  // 삭제 버튼을 클릭했을 때 실행.
  const handleDeleteClick = () => {
    // 삭제를 확인하는 모달창 열기.
    openAlertModal({
      title: "포스트 삭제",
      description: "삭제된 포스트는 되돌릴 수 없습니다. 정말 삭제하시겠습니까?",
      onPositive: () => {
        deletePost(id); // 긍정적으로 응답하였을 때 포스트 mutation을 통해 삭제 요청.
      },
    });
  };

  return (
    <Button
      disabled={isDeletePostPending}
      onClick={handleDeleteClick}
      className="cursor-pointer"
      variant={"ghost"}
    >
      삭제
    </Button>
  );
}
