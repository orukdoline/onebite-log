import FallBack from "../fallback";
import Loader from "../loader";
import PostItem from "./post-item";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useInfinitePostData } from "@/hooks/queries/use-infinite-posts-data";

export default function PostFeed() {
  const { data, error, isPending, isFetchingNextPage, fetchNextPage } =
    useInfinitePostData();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage(); // 다음 데이터 추가.
    }
  }, [inView]); // 마지막 글 밑에 있는 감지 태그가 화면에 노출되었을 때.

  if (error) return <FallBack />; // 오류 상태.
  if (isPending) return <Loader />; // 로딩 상태.

  return (
    <div className="flex flex-col gap-10">
      {data.pages.map((page) =>
        page.map((postId) => <PostItem key={postId} postId={postId} />),
      )}

      {isFetchingNextPage && <Loader />}
      <div ref={ref}></div>
    </div>
  );
}
