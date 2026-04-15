import type { Metadata } from "next";
import ContactClient from "./contact-client";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Lady Bookhouse — questions about a book, your order, or anything else.",
};

export default function ContactPage() {
  return <ContactClient />;
}
