import { BUCKET_NAME } from "@/lib/constants";
import supabase from "@/lib/supabase";

// supabase에 이미지를 업로드하고 이미지의 주소를 추출하는 비동기 함수.
export async function uploadImage({
  file,
  filePath,
}: {
  file: File;
  filePath: string;
}) {
  // supabase에서 파일 업로드.
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  // 만약 오류가 발생하면 예외 발생.
  if (error) throw error;

  // 업로드가 완료되었다면 supabase에 업로드한 현재 이미지의 주소를 반환.
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return publicUrl;
}
