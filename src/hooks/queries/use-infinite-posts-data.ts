import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 5; // 한 페이지당 불러올 게시물 개수.

// PAGE_SIZE만큼 게시물을 불러오되 무한 스크롤로 다음 게시물을 불러오는 react-query.
export function useInfinitePostData() {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.post.list,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE; // 불러올 게시물 중 첫 게시물의 번호.
      const to = from + PAGE_SIZE - 1; // 불러올 게시물 중 마지막 게시물의 번호.

      const posts = await fetchPosts({ from, to }); // 게시물 불러오기.
      posts.forEach((post) => {
        // 쿼리를 통해서 불러온 모든 post 아이템들이 각각 개별적인 캐시로 정규화가 되어서 저장.
        queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post);
      });
      return posts.map((post) => post.id); // postId만 모아서 반환을 하게 됨.
    },

    initialPageParam: 0, // 초기 페이지 번호.
    getNextPageParam: (lastPage, allPages) => {
      // 새로운 페이지의 데이터를 불러와야할 때 queryFn보다 먼저 호출되어서 다음 페이지 번호를 계산.
      // lastPage 인수에는 pageParam의 직전 페이지 값이 저장되어 있음.
      // allPage 인수에는 지금까지 불러온 데이터들이 배열 형태로 저장되어 있음.
      if (lastPage.length < PAGE_SIZE) return undefined; // PAGE_SIZE 값보다 직전 페이지의 값이 작다면 마지막 페이지.
      return allPages.length;
    },

    // stale 상태일 때 윈도우 포커스 복귀, 네트워크 재연결 등이 동작하면 리패치가 일어나는데
    staleTime: Infinity, // 무한 스크롤로 불러온 데이터가 stale 상태가 되지 않게 하여 자동으로 refetch되지 않도록 함.
  });
}
