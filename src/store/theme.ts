import type { Theme } from "@/types";
import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";

type State = {
  theme: Theme;
};

const initialState: State = {
  theme: "light",
};

const useThemeStore = create(
  devtools(
    // 로컬 스토리지에 데이터를 저장.
    persist(
      combine(initialState, (set) => ({
        actions: {
          setTheme: (theme: Theme) => {
            // 현재 페이지에서 dark, light인 클래스를 제거.
            const htmlTag = document.documentElement;
            htmlTag.classList.remove("dark", "light");

            // 로컬 스토리지에 저장되어 있는 데이터가 system이라면,
            if (theme === "system") {
              // 현재 기기의 테마가 dark인지 판별.
              const isDarkTheme = window.matchMedia(
                "(prefers-color-scheme: dark)",
              ).matches;
              // 현재 기기의 테마가 dark라면 현재 페이지에 dark 클래스, light라면 현재 페이지에 light 클래스 추가.
              htmlTag.classList.add(isDarkTheme ? "dark" : "light");
            } else {
              // 로컬 스토리지에 저장되어 있는 데이터가 system이 아니라면 해당 클래스 추가.
              htmlTag.classList.add(theme);
            }
            set({ theme }); // 테마 변경이 완료되었다면 전역 변수에 테마 정보 저장.
          },
        },
      })),
      {
        name: "ThemeStore", // 로컬 스토리지에 저장될 객체 이름 정의.
        partialize: (store) => ({
          theme: store.theme,
        }), // 객체에 포함할 데이터 정의.
      },
    ),
    { name: "ThemeStore" },
  ),
);

export const useTheme = () => {
  const theme = useThemeStore((store) => store.theme);
  return theme;
};

export const useSetTheme = () => {
  const setTheme = useThemeStore((store) => store.actions.setTheme);
  return setTheme;
};
