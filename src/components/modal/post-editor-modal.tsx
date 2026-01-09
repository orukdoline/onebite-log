import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { useEffect, useRef, useState } from "react";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { toast } from "sonner";

export default function PostEditorModal() {
  // 모달 창 여닫는 기능.
  const { isOpen, close } = usePostEditorModal();

  const handleCloseModal = () => {
    close();
  };

  // 게시글 등록 기능.
  const [content, setContent] = useState("");

  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
    onSuccess: () => {
      close(); // 게시글 등록을 성공하면 모달을 닫음.
    },
    onError: (error) => {
      toast.error("포스트 생성에 실패했습니다.", { position: "top-center" }); // 게시글 등록을 실패하면 실패 문구 출력.
    },
  });

  const handleCreatePostClick = () => {
    if (content.trim() == "") return;
    createPost(content);
  };

  // 사용자 편의 기능.
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    if (!isOpen) return;
    textareaRef.current?.focus();
    setContent("");
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-h-[90vh]">
        <DialogTitle>포스트 작성</DialogTitle>
        <textarea
          disabled={isCreatePostPending}
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="max-h-125 min-h-25 focus:outline-none"
          placeholder="무슨 일이 있었나요?"
        />
        <Button
          disabled={isCreatePostPending}
          variant={"outline"}
          className="cursor-pointer"
        >
          <ImageIcon />
          이미지 추가
        </Button>
        <Button
          disabled={isCreatePostPending}
          onClick={handleCreatePostClick}
          className="cursor-pointer"
        >
          저장
        </Button>
      </DialogContent>
    </Dialog>
  );
}
