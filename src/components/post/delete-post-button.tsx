import { useOpenAlertModal } from "@/store/alert-modal";
import { Button } from "../ui/button";
import { useDeletePost } from "@/hooks/mutations/post/use-delete-post";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function DeletePostButton({ id }: { id: number }) {
  const openAlertModal = useOpenAlertModal();
  const navigate = useNavigate();

  const { mutate: deletePost, isPending: isDeletePostPending } = useDeletePost({
    onSuccess: () => {
      // 사용자가 게시물 상세페이지에서 게시물 삭제 요청을 했을 때 성공하면 메인 페이지로 리다이렉트.
      const pathname = window.location.pathname;
      if (pathname.startsWith(`/post/${id}`)) {
        navigate("/", { replace: true });
      }
    },
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
