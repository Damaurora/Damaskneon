import { useState } from "react";
import Logo from "@/components/ui/logo";
import MobileMenu from "@/components/layout/mobile-menu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-background border-b border-secondary sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Logo />
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <a href="#top-products" className="font-roboto text-white hover:text-primary transition">Топ товары</a>
            <a href="#catalog" className="font-roboto text-white hover:text-primary transition">Каталог</a>
            <a href="#news" className="font-roboto text-white hover:text-primary transition">Новости</a>
            <a href="#locations" className="font-roboto text-white hover:text-primary transition">Магазины</a>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-white focus:outline-none"
            aria-label="Меню">
            <i className="ri-menu-line text-2xl"></i>
          </button>
        </div>
        
        {/* Mobile menu */}
        <MobileMenu isOpen={isMobileMenuOpen} />
      </div>
    </header>
  );
};

export default Header;
