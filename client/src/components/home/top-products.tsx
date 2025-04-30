import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "@/components/products/product-card";
import { useState } from "react";
import ProductDetailModal from "@/components/products/product-detail-modal";

const TopProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/top'],
  });

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
  };

  const renderProductCards = () => {
    if (isLoading) {
      return Array(4).fill(0).map((_, i) => (
        <div key={i} className="bg-card rounded-xl overflow-hidden border border-secondary animate-pulse">
          <div className="h-56 bg-muted"></div>
          <div className="p-4">
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full mb-3"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-8 bg-muted rounded w-full mt-2"></div>
          </div>
        </div>
      ));
    }

    return products.map((product) => (
      <ProductCard 
        key={product.id} 
        product={product} 
        onClick={() => openProductModal(product)} 
      />
    ));
  };

  return (
    <section id="top-products" className="py-12 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-unbounded font-bold mb-8 flex items-center">
          <i className="ri-award-fill text-primary mr-2 neon-pulse"></i>
          <span>Топ <span className="text-primary neon-text">товары</span></span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {renderProductCards()}
        </div>
        
        <div className="text-center mt-8">
          <a href="#catalog" className="inline-block px-8 py-3 rounded-full bg-transparent border-2 border-primary text-white font-unbounded font-bold hover:bg-primary hover:bg-opacity-10 transition neon-border">
            Смотреть все товары
          </a>
        </div>
      </div>

      <ProductDetailModal 
        isOpen={isModalOpen} 
        onClose={closeProductModal} 
        product={selectedProduct} 
      />
    </section>
  );
};

export default TopProducts;
