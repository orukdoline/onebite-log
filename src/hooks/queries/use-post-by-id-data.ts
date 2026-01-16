import { fetchPostById } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";
import { useQuery } from "@tanstack/react-query";

export function usePostByIdData({
  postId,
  type,
}: {
  postId: number;
  type: "FEED" | "DETAIL";
}) {
  const session = useSession();

  return useQuery({
    queryKey: QUERY_KEYS.post.byId(postId),
    queryFn: () => fetchPostById({ postId, userId: session!.user.id }), // postId에 해당하는 게시글의 데이터를 가져옴.
    enabled: type === "FEED" ? false : true, // 해당 값이 false이면 queryFn이 무조건 실행되지 않고 캐시 데이터를 사용함.
  });
}
