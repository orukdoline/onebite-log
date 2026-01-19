import { type Database } from "@/database.types";

export type PostEntity = Database["public"]["Tables"]["post"]["Row"];
export type ProfileEntity = Database["public"]["Tables"]["profile"]["Row"];
export type CommentEntity = Database["public"]["Tables"]["comment"]["Row"];

export type Post = PostEntity & { author: ProfileEntity; isLiked: boolean }; // post, profile, like 테이블을 조인한 결과를 담기 위한 타입.
export type Comment = CommentEntity & { author: ProfileEntity }; // comment, profile 테이블을 조인한 결과를 담기 위한 타입.

export type useMutationCallback = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSetteled?: () => void;
};
