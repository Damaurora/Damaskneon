import { AvailabilityStatus, Product, News, Store } from "@shared/schema";

export interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  location: string;
}

export interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export interface NewsCardProps {
  news: News;
}

export interface StoreCardProps {
  store: Store;
}
