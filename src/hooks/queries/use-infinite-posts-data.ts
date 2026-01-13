import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 5; // 한 페이지당 불러올 게시물 개수.

// PAGE_SIZE만큼 게시물을 불러오되 무한 스크롤로 다음 게시물을 불러오는 react-query.
export function useInfinitePostData() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.post.list,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE; // 불러올 게시물 중 첫 게시물의 번호.
      const to = from + PAGE_SIZE - 1; // 불러올 게시물 중 마지막 게시물의 번호.

      const posts = await fetchPosts({ from, to }); // 게시물 불러오기.
      return posts;
    },

    initialPageParam: 0, // 초기 페이지 번호.
    getNextPageParam: (lastPage, allPages) => {
      // 새로운 페이지의 데이터를 불러와야할 때 queryFn보다 먼저 호출되어서 다음 페이지 번호를 계산.
      // lastPage 인수에는 pageParam의 직전 페이지 값이 저장되어 있음.
      // allPage 인수에는 지금까지 불러온 데이터들이 배열 형태로 저장되어 있음.
      if (lastPage.length < PAGE_SIZE) return undefined; // PAGE_SIZE 값보다 직전 페이지의 값이 작다면 마지막 페이지.
      return allPages.length;
    },
  });
}
