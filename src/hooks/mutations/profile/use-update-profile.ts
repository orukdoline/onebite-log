import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/api/profile";
import { type ProfileEntity, type useMutationCallback } from "@/types";
import { QUERY_KEYS } from "@/lib/constants";

export function useUpdateProfile(callbacks?: useMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      // 캐시 데이터 업데이트.
      queryClient.setQueryData<ProfileEntity>(
        QUERY_KEYS.profile.byId(updatedProfile.id),
        updatedProfile,
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
