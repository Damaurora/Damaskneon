import { ProductDetailModalProps } from "@/types";
import AvailabilityIndicator from "@/components/ui/availability-indicator";
import { useState, useEffect } from "react";

const ProductDetailModal = ({ isOpen, onClose, product }: ProductDetailModalProps) => {
  const [specifications, setSpecifications] = useState<string[]>([]);
  const [packageContents, setPackageContents] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setSpecifications(product.specifications ? Object.values(product.specifications as any) : []);
      setPackageContents(product.packageContents ? Object.values(product.packageContents as any) : []);
    }
  }, [product]);

  const statusMap = {
    inStock: { label: "В наличии" },
    lowStock: { label: "Заканчивается" },
    expected: { label: "Ожидается" },
    outOfStock: { label: "Нет в наличии" }
  };

  if (!isOpen || !product) return null;

  const getStatusLabel = (status: string) => {
    return statusMap[status as keyof typeof statusMap]?.label || "Неизвестно";
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      pod: "Под-системы",
      mod: "Моды",
      disposable: "Одноразовые",
      liquid: "Жидкости",
      accessories: "Аксессуары"
    };
    return categories[category as keyof typeof categories] || "Товар";
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto py-8" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-card w-full max-w-3xl rounded-xl overflow-hidden relative mx-4 my-auto" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-primary transition z-10"
          aria-label="Закрыть"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 relative">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover md:h-96"
            />
            {/* Вертикальная неоновая полоска справа */}
            <div className="hidden md:block absolute top-0 right-0 w-[2px] h-full bg-primary neon-primary-border"></div>
          </div>
          {/* Горизонтальная неоновая полоска для мобильных устройств */}
          <div className="md:hidden h-[2px] w-full bg-primary neon-primary-border"></div>
          <div className="md:w-1/2 p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-unbounded font-bold mb-2">{product.name}</h3>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium font-roboto">
                {getCategoryLabel(product.category)}
              </span>
              {product.isTopProduct && (
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium font-roboto">
                  Хит продаж
                </span>
              )}
              {product.isNew && (
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium font-roboto">
                  Новинка
                </span>
              )}
            </div>
            
            <p className="text-gray-300 mb-6 text-sm font-roboto">
              {product.description}
            </p>
            
            {specifications.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2 font-roboto">Характеристики:</h4>
                <ul className="text-sm text-gray-300 space-y-1 font-roboto">
                  {specifications.map((spec, idx) => (
                    <li key={idx}>• {spec}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {packageContents.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2 font-roboto">Комплектация:</h4>
                <ul className="text-sm text-gray-300 space-y-1 font-roboto">
                  {packageContents.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mb-6">
              <h4 className="font-medium mb-2 font-roboto">Наличие в магазинах:</h4>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-roboto">ул. Гагарина, 32</span>
                  <span className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-1 ${
                      product.gagarinAvailability === 'inStock' 
                        ? 'bg-[#00C853]' 
                        : product.gagarinAvailability === 'lowStock' 
                          ? 'bg-[#FF3D00]' 
                          : product.gagarinAvailability === 'expected' 
                            ? 'bg-[#FF9100]' 
                            : 'bg-[#9E9E9E]'
                    }`}></span>
                    <span className="text-sm font-roboto">{getStatusLabel(product.gagarinAvailability)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-roboto">ул. Победы, 7</span>
                  <span className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-1 ${
                      product.pobedyAvailability === 'inStock' 
                        ? 'bg-[#00C853]' 
                        : product.pobedyAvailability === 'lowStock' 
                          ? 'bg-[#FF3D00]' 
                          : product.pobedyAvailability === 'expected' 
                            ? 'bg-[#FF9100]' 
                            : 'bg-[#9E9E9E]'
                    }`}></span>
                    <span className="text-sm font-roboto">{getStatusLabel(product.pobedyAvailability)}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex">
              <a 
                href={`https://t.me/NnDogWithoutsmth?text=${encodeURIComponent(`Здравствуйте, можно уточнить по наличию/вкусу/цвета "${product.name}" в вашем прекрасном магазине?`)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-opacity-80 transition flex-1 text-center font-roboto flex items-center justify-center"
              >
                <i className="ri-telegram-line mr-2"></i> Уточнить наличие
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
