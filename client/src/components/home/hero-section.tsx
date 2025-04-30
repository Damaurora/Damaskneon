import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl mb-4">
              <span className="text-primary neon-text">Премиальные</span> вейп устройства
            </h2>
            <p className="text-gray-300 text-lg mb-8 font-roboto">
              Широкий ассортимент электронных устройств для парения.
              Каталог постоянно обновляется новинками с актуальной информацией о наличии.
            </p>
            <div className="flex flex-wrap space-y-4 md:space-y-0 md:space-x-4">
              <a href="#catalog" className="w-full md:w-auto px-6 py-3 rounded-full bg-primary text-white font-unbounded font-bold hover:bg-opacity-80 transition">
                Смотреть каталог
              </a>
              <a href="#locations" className="w-full md:w-auto px-6 py-3 rounded-full bg-transparent text-white font-unbounded font-bold hover:bg-primary hover:bg-opacity-10 transition neon-border">
                Наши магазины
              </a>
            </div>
          </motion.div>
          <div className="md:w-1/2 mt-8 md:mt-0 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1561299584-6f43f56bebfe?w=800&auto=format&fit=crop" 
                alt="Премиальные вейп устройства" 
                className="rounded-2xl object-cover h-96 w-full"
              />
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(255,126,71,0.5)]"></div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-primary rounded-full opacity-10 blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent rounded-full opacity-10 blur-3xl"></div>
    </section>
  );
};

export default HeroSection;
