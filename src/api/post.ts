import supabase from "@/lib/supabase";

// 데이터베이스에 입력된 게시글을 post 테이블에 저장하는 비동기 함수.
export async function createPost(content: string) {
  const { data, error } = await supabase.from("post").insert({
    content,
  });

  if (error) throw error;
  return data;
}
