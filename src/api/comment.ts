import supabase from "@/lib/supabase";

// 댓글을 추가하는 비동기 함수.
export async function createComment({
  postId,
  content,
  parentCommentId,
  rootCommentId,
}: {
  postId: number;
  content: string;
  parentCommentId?: number;
  rootCommentId?: number;
}) {
  const { data, error } = await supabase
    .from("comment")
    .insert({
      post_id: postId,
      content: content,
      parent_comment_id: parentCommentId,
      root_comment_id: rootCommentId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 댓글을 조회하는 비동기 함수.
export async function fetchComments(postId: number) {
  const { data, error } = await supabase
    .from("comment")
    .select("*, author: profile!author_id (*)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

// 댓글을 수정하는 비동기 함수.
export async function updateComment({
  id,
  content,
}: {
  id: number;
  content: string;
}) {
  const { data, error } = await supabase
    .from("comment")
    .update({ content })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 댓글을 삭제하는 비동기 함수.
export async function deleteComment(id: number) {
  const { data, error } = await supabase
    .from("comment")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
