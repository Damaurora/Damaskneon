import { News } from "@shared/schema";

interface NewsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: News | null;
}

const NewsDetailModal = ({ isOpen, onClose, news }: NewsDetailModalProps) => {
  if (!isOpen || !news) return null;

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
        
        <div className="flex flex-col">
          <div className="relative">
            <img 
              src={news.imageUrl} 
              alt={news.title} 
              className="w-full h-56 object-cover"
            />
            <div className={`absolute top-4 left-4 ${news.type === 'news' ? 'bg-primary' : 'bg-accent neon-blue-border'} text-white text-sm px-3 py-1 rounded-full font-roboto`}>
              {news.type === 'news' ? 'Новость' : 'Акция'}
            </div>
          </div>
          {/* Горизонтальная неоновая полоска */}
          <div className="h-[2px] w-full bg-primary neon-primary-border"></div>
          
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <h3 className="text-2xl font-unbounded font-bold mb-3">{news.title}</h3>
            <div className="text-gray-400 mb-4 text-sm font-roboto">
              <span>{news.date}</span>
            </div>
            
            <div className="text-gray-300 font-roboto space-y-4">
              <p className="whitespace-pre-line">{news.content}</p>
              {news.fullContent && <p className="whitespace-pre-line">{news.fullContent}</p>}
            </div>
            
            {news.type === 'promo' && news.validUntil && (
              <div className="mt-6 p-4 border border-accent rounded-lg bg-accent/10">
                <div className="text-sm text-accent font-roboto">
                  <i className="ri-time-line mr-1"></i> Акция действует до: {news.validUntil}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailModal;