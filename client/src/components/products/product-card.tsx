import { ProductCardProps } from "@/types";
import AvailabilityIndicator from "@/components/ui/availability-indicator";

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <div 
      className="bg-card rounded-xl overflow-hidden border border-secondary hover:neon-border transition duration-300 group"
      onClick={onClick}
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isTopProduct && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-roboto">Топ продаж</span>
          )}
          {product.isNew && (
            <span className="bg-accent text-white text-xs px-2 py-1 rounded-full font-roboto neon-blue-border">Новинка</span>
          )}
        </div>
      </div>
      {/* Неоновая оранжевая полоска */}
      <div className="h-[2px] w-full bg-primary neon-primary-border"></div>
      <div className="p-4">
        <h3 className="font-unbounded font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-400 mb-3 text-sm font-roboto line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-roboto font-medium">Наличие:</span>
          <div className="flex space-x-2">
            <AvailabilityIndicator status={product.gagarinAvailability as any} location="Гагарина 32" />
            <AvailabilityIndicator status={product.pobedyAvailability as any} location="Победы 7" />
          </div>
        </div>
        
        <button className="w-full py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-white transition font-roboto font-medium mt-2">
          Подробнее
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
