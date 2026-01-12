import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

// 모달이 열려 있을 때의 상태 타입.
type OpenState = {
  isOpen: true; // 모달이 열려 있음을 명확히 표현.
  title: string; // 모달 제목.
  description: string; // 모달 설명 문구.
  onPositive?: () => void; // 확인 버튼 클릭 시 실행할 함수.
  onNegative?: () => void; // 취소 버튼 클릭 시 실행할 함수.
};

// 모달이 닫혀 있을 때의 상태 타입.
type CloseState = {
  isOpen: false; // 모달이 닫혀 있음.
};

// 유니온 타입으로 모달 상태를 OpenState 또는 CloseState으로 명확하게 제한.
type State = CloseState | OpenState;

// 초기 상태.
const initialState = {
  isOpen: false,
} as State;

const useAlertModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (params: Omit<OpenState, "isOpen">) => {
          set({ ...params, isOpen: true }); // 전달받은 title, description 등을 저장하고 isOpen을 true로 변경.
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    { name: "AlertModalStore" }, // Redux DevTools에서 보일 스토어 이름.
  ),
);

export const useOpenAlertModal = () => {
  const open = useAlertModalStore((store) => store.actions.open);
  return open;
};

export const useAlertModal = () => {
  const store = useAlertModalStore();
  return store as typeof store & State; // State 타입을 덮어씌워서 isOpen 값이 true/false에 따라 타입이 정확히 추론되도록 함.
};
