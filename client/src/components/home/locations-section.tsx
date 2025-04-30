import { useQuery } from "@tanstack/react-query";
import { Store } from "@shared/schema";

const LocationsSection = () => {
  const { data: stores = [], isLoading } = useQuery<Store[]>({
    queryKey: ['/api/stores'],
  });

  const renderStoreCards = () => {
    if (isLoading) {
      return Array(2).fill(0).map((_, i) => (
        <div key={i} className="bg-card rounded-xl overflow-hidden animate-pulse">
          <div className="h-64 bg-muted"></div>
          <div className="p-6">
            <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
            <div className="h-10 bg-muted rounded w-1/2 mt-6"></div>
          </div>
        </div>
      ));
    }

    return stores.map((store) => (
      <div key={store.id} className="bg-card rounded-xl overflow-hidden group relative">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-background/90 to-transparent transition duration-300 pointer-events-none"></div>
        <img 
          src={store.imageUrl} 
          alt={store.name} 
          className="w-full h-64 object-cover"
        />
        <div className="p-6 relative">
          <h3 className="font-unbounded font-bold text-xl mb-3">{store.name}</h3>
          <div className="flex items-start mb-4">
            <i className="ri-map-pin-line text-primary text-lg mr-2 mt-1"></i>
            <div>
              <p className="text-white font-roboto font-medium">{store.address}</p>
              {store.district && <p className="text-gray-400 text-sm font-roboto">{store.district}</p>}
            </div>
          </div>
          <div className="flex items-start mb-4">
            <i className="ri-time-line text-primary text-lg mr-2 mt-1"></i>
            <div>
              <p className="text-white font-roboto font-medium">{store.hours}</p>
              {store.additionalHours && <p className="text-gray-400 text-sm font-roboto">{store.additionalHours}</p>}
            </div>
          </div>
          <div className="flex items-start">
            <i className="ri-phone-line text-primary text-lg mr-2 mt-1"></i>
            <div>
              <p className="text-white font-roboto font-medium">{store.phone}</p>
              {store.phoneHours && <p className="text-gray-400 text-sm font-roboto">{store.phoneHours}</p>}
            </div>
          </div>
          
          <a 
            href="https://maps.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-6 inline-block px-6 py-2 rounded-full border border-primary text-white hover:bg-primary/10 transition neon-border font-roboto font-medium"
          >
            <i className="ri-route-line mr-1"></i> Проложить маршрут
          </a>
        </div>
      </div>
    ));
  };
  
  return (
    <section id="locations" className="py-12 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-unbounded font-bold mb-8 flex items-center">
          <i className="ri-map-pin-fill text-primary mr-2 neon-pulse"></i>
          <span>Наши <span className="text-primary neon-text">магазины</span></span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderStoreCards()}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
