import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <motion.div 
            className="w-full z-10 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl mb-4">
              <span className="text-primary neon-text">Премиальные</span> вейп устройства
            </h2>
            <p className="text-gray-300 text-lg mb-8 font-roboto">
              Широкий ассортимент электронных устройств для парения.
              Каталог постоянно обновляется новинками с актуальной информацией о наличии.
            </p>
            <div className="flex flex-wrap justify-center space-y-4 md:space-y-0 md:space-x-4">
              <a href="#catalog" className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-white font-unbounded font-bold hover:bg-opacity-80 transition">
                Смотреть каталог
              </a>
              <a href="#locations" className="w-full sm:w-auto px-6 py-3 rounded-full bg-transparent text-white font-unbounded font-bold hover:bg-primary hover:bg-opacity-10 transition neon-border">
                Наши магазины
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-primary rounded-full opacity-10 blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent rounded-full opacity-10 blur-3xl"></div>
    </section>
  );
};

export default HeroSection;
