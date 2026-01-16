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

// supabase에 있는 이미지를 삭제하는 비동기 함수.
export async function deleteImagesInPath(path: string) {
  // supabase의 storage에서 path 경로에 있는 모든 파일 정보를 가져옴.
  const { data: files, error: fetchFilesError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path);

  if (!files || files.length === 0) return; // 파일이 없으면 함수 종료.

  if (fetchFilesError) throw fetchFilesError;

  // 파일 정보를 하나씩 순회하면서 supabase에서 해당 파일을 삭제함.
  const { error: removeError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(files.map((file) => `${path}/${file.name}`));

  if (removeError) throw removeError;
}
