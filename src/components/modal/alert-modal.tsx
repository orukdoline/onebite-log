import {
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlertModal } from "@/store/alert-modal";

export default function AlertModal() {
  const store = useAlertModal(); //  Alert 모달의 전역 상태를 가져옴.

  if (!store.isOpen) return null; // 모달이 열려 있지 않으면 아무것도 렌더링하지 않음.

  // 취소 버튼 클릭 시 실행.
  const handleCancleClick = () => {
    if (store.onNegative) store.onNegative();
    store.actions.close();
  };

  // 확인 버튼 클릭 시 실행.
  const handleActionClick = () => {
    if (store.onPositive) store.onPositive();
    store.actions.close();
  };

  return (
    <AlertDialog open={store.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{store.title}</AlertDialogTitle>
          <AlertDialogDescription>{store.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancleClick}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleActionClick}>
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
