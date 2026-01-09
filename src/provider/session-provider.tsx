import GlobalLoader from "@/components/global-lader";
import { useProfileData } from "@/hooks/queries/use-profile-data";
import supabase from "@/lib/supabase";
import { useIsSessionLoaded, useSession, useSetSession } from "@/store/session";
import { useEffect, type ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const session = useSession(); // session 정보를 불러옴.
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  // 만약 사용자가 로그인을 성공해서 session이 null이 아니게되면 useProfileData의 QueryFn 실행.
  const { data: profile, isLoading: isProfileLoading } = useProfileData(
    session?.user.id,
  );

  useEffect(() => {
    // session 데이터가 변화할 때마다 호출.
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  if (!isSessionLoaded) return <GlobalLoader />;
  if (isProfileLoading) return <GlobalLoader />;

  return children;
}
