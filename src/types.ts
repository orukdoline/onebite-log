import { type Database } from "@/database.types";

export type PostEntity = Database["public"]["Tables"]["post"]["Row"];

export type useMutationCallback = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSetteled?: () => void;
};
