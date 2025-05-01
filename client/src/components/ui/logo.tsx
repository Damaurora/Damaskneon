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
            d="M12,6.5c-0.5,2-2,3-2,5c0,1.7,1.3,3,3,3s3-1.3,3-3c0-2-1.5-3-2-5c-0.2,1-1,2.5-1,2.5S12.2,7.5,12,6.5z"
            fill="#FF5722" 
            className="filter drop-shadow-[0_0_3px_rgba(255,126,71,0.9)]"
          />
          <path 
            d="M12,2c-0.5,1-3,2.5-3,6c0,0,1-1.5,3-1.5c2,0,3,1.5,3,1.5C15,4.5,12.5,3,12,2z"
            fill="#FF9800" 
            className="filter drop-shadow-[0_0_3px_rgba(255,152,0,0.9)]"
          />
        </motion.svg>
      </div>
      <div>
        <h1 className={size === "small" ? "text-lg" : "text-xl md:text-2xl"} role="banner">
          <span className="text-primary neon-text">DAMASK</span> SHOP
        </h1>
        <p className="text-xs text-gray-400">Vape Shop с 2017 года</p>
      </div>
    </div>
  );
}

export default Logo;
