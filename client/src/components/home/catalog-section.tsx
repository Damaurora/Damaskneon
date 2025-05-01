import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "@/components/products/product-card";
import { useState, useEffect } from "react";
import ProductDetailModal from "@/components/products/product-detail-modal";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const CatalogSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setVisibleProducts(8); // Reset visible products when search query changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleProducts(8); // Reset visible products when changing category
  };

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 4);
  };

  // Filter products by category and search query
  const filteredByCategory = activeCategory === "all" 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const filteredProducts = debouncedSearchQuery
    ? filteredByCategory.filter(product => {
        const searchLower = debouncedSearchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.brand?.toLowerCase().includes(searchLower)
        );
      })
    : filteredByCategory;

  const displayedProducts = filteredProducts.slice(0, visibleProducts);
  
  const hasMoreProducts = displayedProducts.length < filteredProducts.length;

  const categories = [
    { id: "all", name: "Все товары" },
    { id: "pod", name: "Pod-системы" },
    { id: "mod", name: "Моды" },
    { id: "disposable", name: "Одноразовые" },
    { id: "liquid", name: "Жидкости" },
    { id: "accessories", name: "Аксессуары" }
  ];

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

    if (displayedProducts.length === 0) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-400">Товары не найдены</p>
        </div>
      );
    }

    return displayedProducts.map((product) => (
      <ProductCard 
        key={product.id} 
        product={product} 
        onClick={() => openProductModal(product)} 
      />
    ));
  };

  return (
    <section id="catalog" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-unbounded font-bold flex items-center">
            <i className="ri-store-2-fill text-primary mr-2 neon-pulse"></i>
            <span>Каталог <span className="text-primary neon-text">товаров</span></span>
          </h2>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-primary" />
            </div>
            <Input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-card border border-secondary focus:border-primary rounded-full"
            />
            {searchQuery && (
              <button 
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setSearchQuery("")}
              >
                <span className="text-sm text-primary">✕</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button 
              key={category.id}
              className={`px-4 py-2 rounded-full font-roboto font-medium transition ${
                activeCategory === category.id 
                  ? 'bg-primary text-white' 
                  : 'bg-card border border-secondary text-white hover:border-primary hover:text-primary'
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {renderProductCards()}
        </div>
        
        {hasMoreProducts && (
          <div className="text-center mt-8">
            <button 
              onClick={loadMoreProducts}
              className="px-8 py-3 rounded-full bg-transparent border-2 border-primary text-white font-unbounded font-bold hover:bg-primary hover:bg-opacity-10 transition neon-border"
            >
              Загрузить еще
            </button>
          </div>
        )}
      </div>

      <ProductDetailModal 
        isOpen={isModalOpen} 
        onClose={closeProductModal} 
        product={selectedProduct} 
      />
    </section>
  );
};

export default CatalogSection;
