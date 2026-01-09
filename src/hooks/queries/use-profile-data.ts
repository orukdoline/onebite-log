import { createProfile, fetchProfile } from "@/api/profile";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";
import type { PostgrestError } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

export function useProfileData(userId?: string) {
  const session = useSession();
  const isMine = userId === session?.user.id;

  return useQuery({
    queryKey: QUERY_KEYS.profile.byId(userId!),
    queryFn: async () => {
      try {
        // 데이터베이스에 프로필 정보가 있다면 해당 정보를 반환.
        const profile = await fetchProfile(userId!);
        return profile;
      } catch (error) {
        // 데이터베이스에 프로필 정보가 없다면 데이터베이스에 프로필 정보 생성.
        if (isMine && (error as PostgrestError).code === "PGRST116") {
          return await createProfile(userId!);
        }
        throw error;
      }
    },
    enabled: !!userId, // userId가 없으면 아무일도 일어나지 않게 함.
  });
}
