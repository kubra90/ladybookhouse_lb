import type { Metadata } from "next";
import CartClient from "./cart-client";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review the books in your cart and proceed to checkout.",
};

export default function CartPage() {
  return <CartClient />;
}
