import { useState } from "react";
import { useLocation } from "wouter";
import Logo from "@/components/ui/logo";
import { Key } from "lucide-react";

const Footer = () => {
  const [, setLocation] = useLocation();
  const [adminClickCount, setAdminClickCount] = useState(0);
  
  // Обработчик для скрытой кнопки админа
  const handleAdminKeyClick = () => {
    const newCount = adminClickCount + 1;
    setAdminClickCount(newCount);
    
    // После 3 кликов перенаправляем на страницу авторизации
    if (newCount >= 3) {
      setLocation("/auth");
      setAdminClickCount(0); // Сбрасываем счетчик
    }
  };
  
  return (
    <footer className="bg-background border-t border-secondary py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Logo size="small" />
          </div>
          
          <div className="mb-6 md:mb-0">
            <p className="text-center text-gray-400 font-roboto text-sm mb-2">Следите за нами в соцсетях:</p>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://vk.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-secondary hover:neon-border transition"
                aria-label="ВКонтакте"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.684 12.098c.412-.454.885-1.115.885-1.115s.206-.335-.142-.335h-1.634c-.347 0-.508.22-.671.467 0 0-.778.978-1.316 1.58-.5.5-.718.413-.883.156-.218-.344-.163-.98-.163-1.423 0-1.561.237-2.173-.47-2.339-.697-.15-2.085-.165-2.9-.165-1.106 0-1.432.255-1.839.85-.273.395.179.386.758.458.803.098 1.093.357 1.199 1.318.159 1.32-.027 2.2-.562 2.408-.336.134-.94-.405-1.767-1.592-.5-.71-.88-1.486-.88-1.486-.104-.255-.294-.488-.719-.488H3.226c-.457 0-.55.218-.55.453 0 .275.253 1.71 2.317 3.78 1.26 1.274 2.84 1.965 4.309 1.965.9 0 1.008-.196 1.008-.533v-1.263c0-.39.095-.463.379-.463.217 0 .573.106 1.42 1.009.967 1.009 1.125 1.465 1.669 1.465h1.685c.288 0 .434-.134.434-.393 0-.298-.37-.92-1.214-1.874z" fill="white"/>
                  <path d="M19.45 3H4.55A2.55 2.55 0 0 0 2 5.55v12.9A2.55 2.55 0 0 0 4.55 21h14.9a2.55 2.55 0 0 0 2.55-2.55V5.55A2.55 2.55 0 0 0 19.45 3zM12 19c-7.981 0-8-7.327-8-8 0-7.022 6.816-7.93 8-8 7.981 0 8 7.328 8 8 0 7.021-6.816 7.93-8 8z" fill="white"/>
                </svg>
              </a>
              <a 
                href="https://telegram.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-secondary hover:neon-blue-border transition"
                aria-label="Телеграм"
              >
                <i className="ri-telegram-fill text-xl text-white"></i>
              </a>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 font-roboto text-sm mb-1">Наши контакты:</p>
            <p className="text-white font-roboto font-medium">damask.shop@mail.ru</p>
            <p className="text-white font-roboto font-medium">+7 (900) 123-45-67</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-secondary text-center relative">
          <p className="text-gray-500 text-xs font-roboto">
            Продажа товаров осуществляется только совершеннолетним лицам, старше 18 лет
          </p>
          
          {/* Скрытая кнопка для доступа к админке */}
          <button 
            onClick={handleAdminKeyClick}
            className="absolute bottom-0 right-4 p-2 opacity-20 hover:opacity-100 transition-opacity duration-300"
            aria-label="Админ-доступ"
          >
            <Key className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
