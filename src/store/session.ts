import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type State = {
  isLoaded: boolean;
  session: Session | null;
};

const initailState = {
  isLoaded: false,
  session: null, // 자동 추론을 사용하면 null 타입으로 추론해버리는 문제점 발생.
} as State; // 따라서 initailState 객체가 State 타입으로 추론이 될 수 있게 구체적으로 명시.

const useSessionStore = create(
  devtools(
    // combine의 첫 번째 인수로 초기 데이터를 정의하고 두 번째 인수로 액션 함수들을 반환하는 콜백 함수를 정의.
    combine(initailState, (set) => ({
      actions: {
        setSession: (session: Session | null) => {
          set({ session, isLoaded: true });
        },
      },
    })),
    // devtools의 두 번째 인수.
    { name: "sessionStore" },
  ),
);

// sessionStore의 State나 액션 함수들에 편하게 접근할 수 있도록 하는 커스텀 훅.
export const useSession = () => {
  const session = useSessionStore((store) => store.session);
  return session;
};

export const useIsSessionLoaded = () => {
  const useIsSessionLoaded = useSessionStore((store) => store.isLoaded);
  return useIsSessionLoaded;
};

export const useSetSession = () => {
  const setSession = useSessionStore((store) => store.actions.setSession);
  return setSession;
};
