import type { Metadata } from "next";
import BooksClient from "./books-client";

export const metadata: Metadata = {
  title: "Browse Books",
  description:
    "Search our curated catalog of used books — filter by category, condition, and price.",
};

export default function BooksPage() {
  return <BooksClient />;
}
