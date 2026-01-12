import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { useSession } from "@/store/session";
import { useOpenAlertModal } from "@/store/alert-modal";

export default function PostEditorModal() {
  // 모달 창 여닫는 기능.
  const { isOpen, close } = usePostEditorModal();

  const openAlertModal = useOpenAlertModal();

  const handleCloseModal = () => {
    // 입력 칸에 글을 입력했거나 이미지가 등록했으면
    if (content !== "" || images.length !== 0) {
      // Alert 모달 열기.
      openAlertModal({
        title: "게시글 작성이 마무리 되지 않았습니다.",
        description: "이 화면에서 나가면 작성중이던 내용이 사라집니다.",
        onPositive: () => {
          close();
        },
      });
      return;
    }
    close(); // 모달 띄우지 않고 닫기.
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

  const session = useSession();

  const handleCreatePostClick = () => {
    if (content.trim() == "") return;
    createPost({
      content,
      images: images.map((image) => image.file),
      userId: session!.user.id,
    });
  };

  // 이미지 등록 기능.
  const fileInputRef = useRef<HTMLInputElement>(null);

  type Image = {
    file: File;
    previewUrl: string;
  };
  const [images, setImages] = useState<Image[]>([]); // Image 타입으로 구성된 배열을 타입으로 명시하고 빈 배열로 초기화.

  const handleSelectImages = (e: ChangeEvent<HTMLInputElement>) => {
    // 이미지를 실시간으로 등록하는 역할.
    if (e.target.files) {
      const files = Array.from(e.target.files); // 현재 선택된 파일들을 자바스크립트 배열 형태로 변환해서 담아줌.

      files.forEach((file) => {
        setImages((prev) => [
          ...prev,
          { file, previewUrl: URL.createObjectURL(file) }, // 인수로 전달한 이미지 파일에 임시용 URL 주소를 만들어서 반환.
        ]);
      });
    }
    e.target.value = ""; // 입력값 초기화.
  };

  // 이미지 삭제 기능.
  const handleDeleteImage = (image: Image) => {
    setImages((prevImages) =>
      prevImages.filter((item) => item.previewUrl !== image.previewUrl),
    );
    // 이미지를 삭제하기 전 image state에 보관된 해당 이미지를 브라우저의 메모리로부터 제거.
    URL.revokeObjectURL(image.previewUrl);
  };

  // 사용자 편의 기능.
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // 입력하는 게시글의 길이가 길어지면 입력칸의 높이 높아짐.
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    // 모달 창이 열리면 게시글 입력 칸에 자동 포커스되며 state 값들 초기화.
    if (!isOpen) {
      // 모달이 닫히기 전 image state에 보관된 모든 이미지들을 브라우저의 메모리로부터 제거.
      images.forEach((images) => URL.revokeObjectURL(images.previewUrl));
      return;
    }
    textareaRef.current?.focus();
    setContent("");
    setImages([]);
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
        <input
          onChange={handleSelectImages}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
        />
        {images.length > 0 && (
          <Carousel>
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem className="basis-2/5" key={image.previewUrl}>
                  <div className="relative">
                    <img
                      src={image.previewUrl}
                      className="h-full w-full rounded-sm object-cover"
                    />
                    <div
                      onClick={() => handleDeleteImage(image)}
                      className="absolute top-0 right-0 m-1 cursor-pointer rounded-full bg-black/30 p-1"
                    >
                      <XIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
        <Button
          onClick={() => {
            fileInputRef.current?.click();
          }}
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
