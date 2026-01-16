import { Button } from "../ui/button";
import { useOpenProfileEditorModal } from "@/store/profile-editor-modal";

export default function EditProfileButton() {
  // 프로필 수정 모달을 여는 함수 호출.
  const openProfileEditorModal = useOpenProfileEditorModal();

  return (
    <Button
      onClick={openProfileEditorModal}
      variant={"secondary"}
      className="cursor-pointer"
    >
      프로필 수정
    </Button>
  );
}
