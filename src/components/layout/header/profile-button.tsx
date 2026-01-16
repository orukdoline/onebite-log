import { signOut } from "@/api/auth";
import defaultAvatar from "@/assets/default-avatar.jpg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProfileData } from "@/hooks/queries/use-profile-data";
import { useSession } from "@/store/session";
import { PopoverClose } from "@radix-ui/react-popover";
import { Link } from "react-router";

export default function ProfileButton() {
  const session = useSession();

  const { data: profile } = useProfileData(session?.user.id); // 로그인된 사용자의 프로필 이미지를 불러오기 위해 프로필 정보 불러오기.

  if (!session) return null;

  return (
    <Popover>
      <PopoverTrigger>
        <img
          src={profile?.avatar_url || defaultAvatar}
          className="h-6 w-6 cursor-pointer rounded-full object-cover"
        />
      </PopoverTrigger>
      <PopoverContent className="flex w-40 flex-col p-0">
        <PopoverClose asChild>
          <Link to={`/profile/${session.user.id}`}>
            <div className="hover:bg-muted cursor-pointer px-4 py-3 text-sm">
              프로필
            </div>
          </Link>
        </PopoverClose>
        <PopoverClose asChild>
          <div
            onClick={signOut}
            className="hover:bg-muted cursor-pointer px-4 py-3 text-sm"
          >
            로그아웃
          </div>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
