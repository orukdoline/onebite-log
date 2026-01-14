import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

// 모달이 열려있고 사용자가 게시물을 추가할 때 OpenState 타입.
type CreateMode = {
  isOpen: true;
  type: "CREATE";
};

// 모달이 열려있고 사용자가 게시물을 수정할 때 OpenState 타입.
type EditMode = {
  isOpen: true;
  type: "EDIT";
  postId: number;
  content: string;
  imageUrls: string[] | null;
};

type OpenState = CreateMode | EditMode;

// 모달이 닫혀있을 때 State 타입.
type CloseState = {
  isOpen: false;
};

type State = CloseState | OpenState;

const initialState = {
  isOpen: false,
} as State;

const usePostEditorModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        // 새 글 작성 모달이 열릴 시.
        openCreate: () => {
          set({ isOpen: true, type: "CREATE" });
        },
        // 게시물 수정 모달이 열릴 시.
        openEdit: (param: Omit<EditMode, "isOpen" | "type">) => {
          set({ isOpen: true, type: "EDIT", ...param });
        },
        // 모달이 닫힐 시.
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    { name: "postEditorModalStore" },
  ),
);

// 게시물을 추가하기 위한 훅.
export const useOpenCreatePostModal = () => {
  const openCreate = usePostEditorModalStore(
    (store) => store.actions.openCreate,
  );
  return openCreate;
};

// 게시물을 수정하기 위한 훅.
export const useOpenEditPostModal = () => {
  const openEdit = usePostEditorModalStore((store) => store.actions.openEdit);
  return openEdit;
};

// state 값을 전달해주기 위한 훅.
export const usePostEditorModal = () => {
  const store = usePostEditorModalStore();
  return store as typeof store & State;
};
