import { type Database } from "@/database.types";

export type PostEntity = Database["public"]["Tables"]["post"]["Row"];
export type ProfileEntity = Database["public"]["Tables"]["profile"]["Row"];

export type Post = PostEntity & { author: ProfileEntity }; // post, profile 테이블을 조인한 결과를 담기 위한 타입.

export type useMutationCallback = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSetteled?: () => void;
};
