import { PlusCircleIcon } from "lucide-react";
import { useOpenCreatePostModal } from "@/store/post-editor-modal";

export default function CreatePostButton() {
  const openCreateModal = useOpenCreatePostModal();

  return (
    <div
      onClick={openCreateModal}
      className="bg-muted text-muted-foreground cursor-pointer rounded-xl px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div>나누고 싶은 이야기가 있나요?</div>
        <PlusCircleIcon className="h-5 w-5" />
      </div>
    </div>
  );
}
