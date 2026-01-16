import { HeartIcon, MessageCircle } from "lucide-react";
import type { Post } from "@/types";
import defaultAvatar from "@/assets/default-avatar.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { formatTimeAgo } from "@/lib/time";
import DeletePostButton from "./delete-post-button";
import EditPostButton from "./edit-post-button";
import { useSession } from "@/store/session";
import { usePostByIdData } from "@/hooks/queries/use-post-by-id-data";
import Loader from "../loader";
import FallBack from "../fallback";
import LikePostButton from "./like-post-button";

export default function PostItem({ postId }: { postId: number }) {
  const session = useSession(); // 현재 사용자의 session 데이터를 불러오기.
  const userId = session?.user.id; // session 데이터에 있는 user의 id를 담음.

  // 캐시에 해당 데이터가 있으면 서버 요청 없이 캐시에 저장된 게시글 데이터를 조회.
  const {
    data: post,
    error,
    isPending,
  } = usePostByIdData({
    postId,
    type: "FEED",
  });

  if (isPending) return <Loader />; // 데이터를 불러오는 중일 때 Loader 컴포넌트 호출.
  if (error) return <FallBack />; // 데이터를 불러오는 도중 에러가 발생하면 FallBack 컴포넌트 호출.

  const isMine = post.author_id === userId; // 게시물의 작성자와 로그인된 사용자가 동일한 인물인지 판별.

  return (
    <div className="flex flex-col gap-4 border-b pb-8">
      <div className="flex justify-between">
        <div className="flex items-start gap-4">
          <img
            src={post.author.avatar_url || defaultAvatar}
            alt={`${post.author.nickname}의 프로필 이미지`}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <div className="font-bold hover:underline">
              {post.author.nickname}
            </div>
            <div className="text-muted-foreground text-sm">
              {formatTimeAgo(post.created_at)}
            </div>
          </div>
        </div>

        {
          // 로그인 사용자와 게시물 작성자가 같으면 '수정', '삭제'버튼 렌더링.
          isMine && (
            <div className="text-muted-foreground flex text-sm">
              <EditPostButton {...post} />
              <DeletePostButton id={post.id} />
            </div>
          )
        }
      </div>

      <div className="flex cursor-pointer flex-col gap-5">
        <div className="line-clamp-2 break-words whitespace-pre-wrap">
          {post.content}
        </div>

        <Carousel>
          <CarouselContent>
            {post.image_urls?.map((url, index) => (
              <CarouselItem className={`basis-3/5`} key={index}>
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={url}
                    className="h-full max-h-[350px] w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="flex gap-2">
        <LikePostButton
          id={post.id}
          likeCount={post.like_count}
          isLiked={post.isLiked}
        />

        <div className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border-1 p-2 px-4 text-sm">
          <MessageCircle className="h-4 w-4" />
          <span>댓글 달기</span>
        </div>
      </div>
    </div>
  );
}
