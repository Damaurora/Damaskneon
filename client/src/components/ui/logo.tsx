import { motion } from "framer-motion";

const Logo = ({ size = "normal" }: { size?: "small" | "normal" | "large" }) => {
  const sizeClass = {
    small: "h-8 w-8",
    normal: "h-12 w-12",
    large: "h-16 w-16",
  };

  return (
    <div className="flex items-center">
      <div className={`relative ${sizeClass[size]} mr-2 neon-pulse`}>
        <motion.svg 
          viewBox="0 0 24 24" 
          className="h-full w-full"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1.0 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        >
          <path 
            d="M12,2C10.22,2 8.5,2.4 7.04,3.15C7.21,3.54 7.5,4.12 7.74,4.68C8,5.27 8.19,5.73 8.24,6C8.5,7.58 8.5,9.5 8,11.36C7.82,11.97 7.5,12.74 7.21,13.5C6.72,14.89 6.26,16.26 6.26,17C6.26,18.3 6.58,19.45 7.47,20.28C8.37,21.11 9.76,21.58 12,21.58C14.24,21.58 15.63,21.11 16.53,20.28C17.42,19.45 17.74,18.3 17.74,17C17.74,16.26 17.28,14.89 16.79,13.5C16.5,12.74 16.18,11.97 16,11.36C15.5,9.5 15.5,7.58 15.76,6C15.81,5.73 16,5.27 16.25,4.68C16.5,4.12 16.79,3.54 16.96,3.15C15.5,2.4 13.78,2 12,2Z" 
            fill="#FF5722" 
            className="filter drop-shadow-[0_0_2px_rgba(255,126,71,0.7)]"
          />
        </motion.svg>
        <div className="absolute bottom-0 left-0 w-full text-center text-xs font-unbounded font-bold text-white neon-text">FIRE</div>
      </div>
      <div>
        <h1 className={size === "small" ? "text-lg" : "text-xl md:text-2xl"} role="banner">
          <span className="text-primary neon-text">DAMASK</span> SHOP
        </h1>
        <p className="text-xs text-gray-400">Vape Shop с 2022 года</p>
      </div>
    </div>
  );
}

export default Logo;
