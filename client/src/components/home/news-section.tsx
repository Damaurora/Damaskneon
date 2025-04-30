import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import NewsDetailModal from "./news-detail-modal";

const NewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const newsSliderRef = useRef<HTMLDivElement>(null);

  const { data: news = [], isLoading } = useQuery<News[]>({
    queryKey: ['/api/news'],
  });

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3);
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);

    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  const totalSlides = Math.ceil((news?.length || 0) / slidesPerView);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Calculate translation percentage
  const getTranslateValue = () => {
    // Calculate how many items to move
    const itemWidth = 100 / slidesPerView;
    return -currentSlide * (itemWidth * slidesPerView);
  };

  const renderNewsCards = () => {
    if (isLoading) {
      return Array(3).fill(0).map((_, i) => (
        <div key={i} className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] p-3">
          <div className="bg-card rounded-xl overflow-hidden h-full border border-secondary animate-pulse">
            <div className="h-48 bg-muted"></div>
            <div className="p-5">
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-3"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      ));
    }

    return news?.map((item, idx) => (
      <div key={idx} className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] p-3">
        <div className="bg-card rounded-xl overflow-hidden h-full border border-secondary hover:neon-border transition duration-300">
          <div className="h-48 overflow-hidden relative">
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            <div className={`absolute top-3 right-3 ${item.type === 'news' ? 'bg-primary' : 'bg-accent neon-blue-border'} text-white text-sm px-3 py-1 rounded-full font-roboto`}>
              {item.type === 'news' ? 'Новость' : 'Акция'}
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-xl font-unbounded font-bold mb-2">{item.title}</h3>
            <p className="text-gray-300 mb-3 font-roboto">{item.content}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 font-roboto">{item.date}</span>
              <button 
                onClick={() => {
                  setSelectedNews(item);
                  setIsModalOpen(true);
                }}
                className="text-primary font-roboto font-medium hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                Подробнее
              </button>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <section id="news" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-unbounded font-bold mb-8 flex items-center">
          <i className="ri-fire-fill text-primary mr-2 neon-pulse"></i>
          <span>Новости и <span className="text-primary neon-text">акции</span></span>
        </h2>
        
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div 
              className="flex"
              animate={{ x: `${getTranslateValue()}%` }}
              transition={{ type: "tween", duration: 0.5 }}
              ref={newsSliderRef}
            >
              {renderNewsCards()}
            </motion.div>
          </div>
          
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-background/70 hover:bg-primary/70 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm z-10"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            aria-label="Предыдущий слайд"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-background/70 hover:bg-primary/70 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm z-10"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            aria-label="Следующий слайд"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
        
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button 
              key={idx}
              className={`w-3 h-3 rounded-full ${idx === currentSlide ? 'bg-primary' : 'bg-gray-600'}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Перейти к слайду ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>
      
      {/* Модальное окно для просмотра полной новости */}
      <NewsDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        news={selectedNews}
      />
    </section>
  );
};

export default NewsSection;
