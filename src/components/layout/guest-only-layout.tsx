import { useSession } from "@/store/session";
import { Navigate, Outlet } from "react-router";

export default function GuestOnlyLayout() {
  // zustand의 session 정보를 가져온 후 데이터가 있으면 index 페이지로 강제 이동. (라우트 가드)
  const session = useSession();
  if (session) return <Navigate to={"/"} replace={true} />;

  return <Outlet />;
}
