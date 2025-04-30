import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Проверяем, подтверждал ли пользователь свой возраст ранее
    const ageVerified = localStorage.getItem("ageVerified");
    
    if (!ageVerified) {
      setIsOpen(true);
    }
  }, []);
  
  const handleConfirm = () => {
    // Сохраняем факт подтверждения возраста в localStorage
    localStorage.setItem("ageVerified", "true");
    setIsOpen(false);
  };
  
  const handleCancel = () => {
    // Перенаправляем на Google при отказе от подтверждения возраста
    window.location.href = "https://www.google.com";
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Блюр фона сайта */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
        aria-hidden="true"
      />
      
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="border-secondary bg-background w-[90%] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-unbounded text-center">
              Подтверждение возраста
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              <span className="text-6xl font-unbounded my-4 block neon-text">18+</span>
              <span className="text-base text-foreground block">
                Сайт содержит информацию для лиц старше 18 лет. 
                Продажа товаров осуществляется только совершеннолетним лицам.
              </span>
              <span className="text-base text-foreground mt-2 block">
                Вам исполнилось 18 лет?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 sm:gap-0">
            <AlertDialogCancel 
              onClick={handleCancel}
              className="w-full sm:w-auto bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
            >
              Нет
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              Да, мне есть 18 лет
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}