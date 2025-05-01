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
              className="relative h-96 flex items-center justify-center"
            >
              <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-2xl">
                <div className="absolute w-full h-full bg-gradient-to-br from-primary/20 to-black/50 rounded-2xl"></div>
                <div className="z-10 text-center">
                  <div className="text-4xl font-unbounded font-bold neon-text mb-2">DAMASK</div>
                  <div className="text-2xl text-white mb-4">Since 2017</div>
                  <div className="flex justify-center">
                    <span className="inline-block w-24 h-1 bg-primary neon-border"></span>
                  </div>
                </div>
              </div>
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
