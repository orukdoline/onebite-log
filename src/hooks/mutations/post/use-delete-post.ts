import { deleteImagesInPath } from "@/api/image";
import { deletePost } from "@/api/post";
import type { useMutationCallback } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useDeletePost(callbacks?: useMutationCallback) {
  return useMutation({
    mutationFn: deletePost,
    // deletePost를 수행함으로써 반환된 값을 onSuccess 함수의 프로퍼티로 넘김.
    onSuccess: async (deletedPost) => {
      // supabase의 post 테이블에서 해당 데이터 삭제를 성공하면 콜백 함수를 실행한 후.
      if (callbacks?.onSuccess) callbacks.onSuccess();

      // 삭제할 폴더의 경로를 생성한 후 로컬 스토리지의 이미지를 삭제.
      if (deletedPost.image_urls && deletedPost.image_urls.length > 0) {
        await deleteImagesInPath(`${deletedPost.author_id}/${deletedPost.id}`);
      }
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
