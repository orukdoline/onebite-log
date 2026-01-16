import { useSession } from "@/store/session";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useProfileData } from "@/hooks/queries/use-profile-data";
import Fallback from "../fallback";
import Loader from "../loader";
import defaultAvatar from "@/assets/default-avatar.jpg";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useProfileEditorModal } from "@/store/profile-editor-modal";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useUpdateProfile } from "@/hooks/mutations/profile/use-update-profile";
import { toast } from "sonner";

export default function ProfileEditorModal() {
  // 로그인한 사용자의 정보를 불러옴.
  const session = useSession();
  const {
    data: profile,
    error: fetchProfileError,
    isPending: isFetchingProfilePending,
  } = useProfileData(session?.user.id);

  // 모달을 여닫음.
  const store = useProfileEditorModal();
  const {
    isOpen,
    actions: { close },
  } = store;

  // state 선언.
  type Image = { file: File; previewUrl: string };

  const [avatarImage, setAvatarImage] = useState<Image | null>(null);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달이 열리거나 프로필 정보를 불러올 때 각각의 state에 데이터베이스에서 불러온 정보를 저장.
  useEffect(() => {
    if (isOpen && profile) {
      setNickname(profile.nickname);
      setBio(profile.bio);
      setAvatarImage(null);
    }
  }, [profile, isOpen]);

  // 프로필 수정 모달이 닫힐 때 기존에 저장해 두었던 이미지는 메모리로부터 제거하여 메모리 누수 방지.
  useEffect(() => {
    if (!isOpen) {
      if (avatarImage) URL.revokeObjectURL(avatarImage.previewUrl);
    }
  }, [isOpen]);

  // 이미지가 선택되면 avatarImage state에 이미지 저장.
  const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return; // 선택된 파일이 없다면 함수 종료.
    const file = e.target.files[0]; // 첫 번째로 선택된 파일을 변수에 저장.

    // 새로운 이미지가 선택될 때 기존에 저장해 두었던 이미지는 메모리로부터 제거하여 메모리 누수 방지.
    if (avatarImage) {
      URL.revokeObjectURL(avatarImage.previewUrl);
    }

    setAvatarImage({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  // 데이터베이스에서 프로필 정보 업데이트 실행.
  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useUpdateProfile({
      onSuccess: () => {
        close();
      },
      onError: (error) => {
        toast.error("프로필 수정에 실패했습니다.", { position: "top-center" });
      },
    });

  const handleUpdateClick = () => {
    if (nickname.trim() === "") return;
    updateProfile({
      userId: session!.user.id,
      nickname: nickname,
      bio: bio,
      avatarImageFile: avatarImage?.file,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="flex flex-col gap-5">
        <DialogTitle>프로필 수정하기</DialogTitle>
        {fetchProfileError && <Fallback />}
        {isFetchingProfilePending && <Loader />}
        {!fetchProfileError && !isFetchingProfilePending && (
          <>
            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground">프로필 이미지</div>
              <input
                onChange={handleSelectImage}
                disabled={isUpdateProfilePending}
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <img
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                className="h-20 w-20 cursor-pointer rounded-full object-cover"
                src={
                  avatarImage?.previewUrl || profile.avatar_url || defaultAvatar
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground">닉네임</div>
              <Input
                disabled={isUpdateProfilePending}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground">소개</div>
              <Input
                disabled={isUpdateProfilePending}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <Button
              disabled={isUpdateProfilePending}
              onClick={handleUpdateClick}
              className="cursor-pointer"
            >
              수정하기
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
