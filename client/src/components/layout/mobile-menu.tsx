interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu = ({ isOpen }: MobileMenuProps) => {
  return (
    <div className={`${isOpen ? 'block' : 'hidden'} md:hidden mt-4 pb-4`}>
      <div className="flex flex-col space-y-3">
        <a href="#top-products" className="font-roboto text-white hover:text-primary transition">Топ товары</a>
        <a href="#catalog" className="font-roboto text-white hover:text-primary transition">Каталог</a>
        <a href="#news" className="font-roboto text-white hover:text-primary transition">Новости</a>
        <a href="#locations" className="font-roboto text-white hover:text-primary transition">Магазины</a>
      </div>
    </div>
  );
};

export default MobileMenu;
