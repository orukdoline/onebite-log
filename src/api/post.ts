import supabase from "@/lib/supabase";
import { uploadImage } from "./image";
import type { PostEntity } from "@/types";

// 데이터베이스에 입력된 게시글을 post 테이블에 저장하는 비동기 함수.
export async function createPost(content: string) {
  const { data, error } = await supabase
    .from("post")
    .insert({
      content,
    })
    // 업로드가 완료되면 해당 데이터를 반환받기 위한 메서드.
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 데이터베이스에 입력된 게시글과 이미지를 post 테이블에 저장하는 비동기 함수.
export async function createPostWithImages({
  content,
  images,
  userId,
}: {
  content: string;
  images: File[];
  userId: string;
}) {
  // 새로운 포스트 생성.
  const post = await createPost(content);

  try {
    // 이미지 업로드.
    if (images.length === 0) return post; // 이미지가 없다면 포스트만 반환.
    // Promise.all()로 모든 비동기 함수들이 병렬로 실행됨.
    const imageUrls = await Promise.all(
      images.map((image) => {
        const fileExtension = image.name.split(".").pop() || "webp"; // 파일 확장자를 추출하는데 확장자가 없다면 webp로 반환.
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`; // 중복되는 파일 이름이 없도록 파일명 생성.
        const filePath = `${userId}/${post.id}/${fileName}`; // 파일이 저장될 경로 생성.
        return uploadImage({
          file: image,
          filePath,
        });
      }),
    );

    // 포스트 테이블 업데이트.
    const updatedPost = await updatePost({
      id: post.id,
      image_urls: imageUrls,
    });

    return updatedPost;
  } catch (error) {
    // 이미지 업로드에 실패하게 되면 테이블에서 해당 게시물 삭제 후 예외 전달.
    await deletePost(post.id);
    throw error;
  }
}

// 이미지 등록에 성공하면 imageUrls 컬럼에 해당 이미지 정보를 추가하는 비동기 함수.
export async function updatePost(post: Partial<PostEntity> & { id: number }) {
  const { data, error } = await supabase
    .from("post")
    .update(post)
    .eq("id", post.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 이미지 등록에 실패하면 해당 게시물을 삭제하는 비동기 함수.
export async function deletePost(id: number) {
  const { data, error } = await supabase
    .from("post")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
