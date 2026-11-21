export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: "New" | "Like New" | "Very Good" | "Good" | "Acceptable";
  description: string;
  isbn: string;
  imageUrl: string;
  category: string;
  quantity: number;
  isAvailable: boolean;
  listedDate?: string;
  salesRank?: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerEmail: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
}
