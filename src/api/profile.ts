import supabase from "@/lib/supabase";
import { getRandomNickname } from "@/lib/utils";
import { deleteImagesInPath, uploadImage } from "./image";

// 데이터베이스에서 매개변수에 해당하는 프로필 정보를 조회하는 비동기 함수.
export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile") // profile 테이블에서 데이터 탐색.
    .select("*") // 탐색된 데이터의 모든 컬럼을 가져옴.
    .eq("id", userId) // 데이터베이스의 id 컬럼 값과 userId 값이 동일한 값만 가져옴.
    .single(); // 하나의 값만 가져옴.

  if (error) throw error; // 에러가 발생하면 error 예외 처리.
  return data; // 정상적으로 수행되었다면 data 반환.
}

// 프로필을 생성해주는 비동기 함수.
export async function createProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .insert({
      id: userId,
      nickname: getRandomNickname(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 프로필 정보를 업데이트하는 비동기 함수.
export async function updateProfile({
  userId,
  nickname,
  bio,
  avatarImageFile,
}: {
  userId: string;
  nickname: string;
  bio?: string;
  avatarImageFile?: File;
}) {
  // 기존 아바타 이미지 삭제.
  if (avatarImageFile) {
    await deleteImagesInPath(`${userId}/avatar`);
  }

  // 새로운 아바타 이미지 업로드.
  let newAvatarImageUrl;

  if (avatarImageFile) {
    const fileExtension = avatarImageFile.name.split(".").pop() || "webp";
    const filePath = `${userId}/avatar/${new Date().getTime()}-${crypto.randomUUID()}.${fileExtension}`;

    newAvatarImageUrl = await uploadImage({
      file: avatarImageFile,
      filePath,
    });
  }

  // 프로필 테이블 업데이트.
  const { data, error } = await supabase
    .from("profile")
    .update({
      nickname,
      bio,
      avatar_url: newAvatarImageUrl,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
