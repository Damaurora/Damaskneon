import Logo from "@/components/ui/logo";

const Footer = () => {
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
                <i className="ri-vk-fill text-xl text-white"></i>
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
            <p className="text-gray-400 font-roboto text-sm mb-1">Для оптовых заказов:</p>
            <p className="text-white font-roboto font-medium">damask.shop@mail.ru</p>
            <p className="text-white font-roboto font-medium">+7 (900) 123-45-67</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-secondary text-center">
          <p className="text-gray-500 text-xs font-roboto">
            Продажа товаров осуществляется только совершеннолетним лицам, старше 18 лет
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
