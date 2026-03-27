export interface PackOption {
  label: string;
  price: number;
  salePrice?: number;
  stockQty?: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  discountPercent?: number;
  categoryId?: string;
  categoryName?: string;
  isActive: boolean;
  stockQty: number;
  images: string[];
  sizes?: string[];
  colors?: string[];
  material?: string;
  weight?: string;
  length?: string;
  pattern?: string;
  createdAt: string;
  packOptions?: PackOption[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Offer {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedPack?: string;
  product?: Product;
  unitPrice?: number;
  originalUnitPrice?: number;
  lineTotal?: number;
  lineSaving?: number;
}

export interface CartSummary {
  itemCount: number;
  subtotalOriginal: number;
  totalDiscount: number;
  subtotalPayable: number;
}

export interface CartResponse {
  items: CartItem[];
  summary: CartSummary;
}

export interface Address {
  name: string;
  phone: string;
  flatHouse: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedPack?: string;
  productSnapshot: Record<string, unknown>;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  address: Address;
  items: OrderItem[];
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface NewArrivalsResponse {
  label: string;
  products: Product[];
}

export interface FeedResponse {
  categories: Category[];
  products: Product[];
  offers?: Offer[];
  homeLayout?: { pattern: string[] };
}

export interface WishlistResponse {
  productIds: string[];
  products: Product[];
}

// ─── Conversation ────────────────────────────────────────────────────────────

export interface ProductSnapshot {
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderType: "user" | "admin";
  body: string | null;
  imageUrl: string | null;
  productId: string | null;
  productSnapshot: ProductSnapshot | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  unreadByUser: number;
  lastMessageAt: string;
  messages: ConversationMessage[];
}

export interface SendMessageBody {
  body?: string;
  imageUrl?: string;
  productId?: string;
}

// ─────────────────────────────────────────────────────────────────────────────

export interface PlaceOrderBody {
  address: Address;
  items: {
    productId: string;
    quantity: number;
    priceAtPurchase: number;
    selectedSize?: string;
    selectedColor?: string;
    selectedPack?: string;
    productSnapshot?: Record<string, unknown> | null;
  }[];
  totalAmount: number;
  notes?: string;
}
