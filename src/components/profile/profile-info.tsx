import { useProfileData } from "@/hooks/queries/use-profile-data";
import FallBack from "../fallback";
import Loader from "../loader";
import defaultAvatar from "@/assets/default-avatar.jpg";
import { useSession } from "@/store/session";
import EditProfileButton from "./edit-profile-button";

export default function ProfileInfo({ userId }: { userId: string }) {
  const session = useSession();
  const isMine = session?.user.id === userId; // 로그인한 사용자의 본인 프로필인지 확인.

  // 해당 사용자의 프로필 정보를 불러옴.
  const {
    data: profile,
    error: fetchProfileError,
    isPending: isFetchingProfilePending,
  } = useProfileData(userId);

  if (fetchProfileError) return <FallBack />;
  if (isFetchingProfilePending) return <Loader />;

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <img
        src={profile.avatar_url || defaultAvatar}
        className="h-30 w-30 rounded-full object-cover"
      />
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl font-bold">{profile.nickname}</div>
        <div className="text-muted-foreground">{profile.bio}</div>
      </div>
      {
        // 로그인한 사용자의 본인 프로필이면 수정하기 버튼 출력.
        isMine && <EditProfileButton />
      }
    </div>
  );
}
