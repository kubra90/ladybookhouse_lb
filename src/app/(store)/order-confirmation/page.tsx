import type { Metadata } from "next";
import OrderConfirmationClient from "./order-confirmation-client";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Thank you for your order from Lady Bookhouse.",
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
  return <OrderConfirmationClient />;
}
