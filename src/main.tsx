import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/sonner.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // 요청 실패 시 자동 재요청하지 않음.
      refetchOnWindowFocus: false, // 브라우저 탭에 다시 포커스될 때 자동 재요청하지 않음.
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Toaster />
      <App />
    </QueryClientProvider>
  </BrowserRouter>,
);
