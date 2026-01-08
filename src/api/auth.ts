import supabase from "@/lib/supabase"; // supabase 클라이언트 import.

export async function signUp({
  email,
  password,
}: {
  // 객체 형태로 데이터를 받아오기 위해서 객체 정의.
  email: string;
  password: string;
}) {
  // supabase 클라이언트 불러온 후 인증과 관련된 기능인 auth의 signUp 함수를 호출.
  const { data, error } = await supabase.auth.signUp({
    email, // email, password 값을 인수로 supabase에 전달.
    password,
  });

  if (error) throw error; // 요청을 실패하면 error 예외 발생.
  return data; // 요청을 성공하면 회원가입 결과를 반환.
}

export async function signInWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}
