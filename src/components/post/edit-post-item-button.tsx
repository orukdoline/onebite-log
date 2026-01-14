import { useOpenEditPostModal } from "@/store/post-editor-modal";
import { Button } from "../ui/button";
import type { PostEntity } from "@/types";

export default function EditPostItemButton(props: PostEntity) {
  const openPostEditorModal = useOpenEditPostModal();

  const handleButtonClick = () => {
    // 게시물 번호, 게시물 내용, 게시물 이미지 주소 정보를 프로퍼티로 넘기면서 openPostEditorModal 훅을 호출.
    openPostEditorModal({
      postId: props.id,
      content: props.content,
      imageUrls: props.image_urls,
    });
  };

  return (
    <Button
      onClick={handleButtonClick}
      className="cursor-pointer"
      variant={"ghost"}
    >
      수정
    </Button>
  );
}
