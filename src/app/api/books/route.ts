import { NextRequest, NextResponse } from "next/server";
import { fetchAllAvailableBooks, isConfigured } from "@/lib/aob-client";
import { placeholderBooks } from "@/lib/placeholder-books";
import type { Book } from "@/types/book";

export const runtime = "edge";

// Cache the full book list for 5 minutes
export const revalidate = 300;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query     = searchParams.get("search") || "";
  const category  = searchParams.get("category") || "";
  const condition = searchParams.get("condition") || "";
  const sort      = searchParams.get("sort") || "newest";
  const page      = parseInt(searchParams.get("page") || "1", 10);
  const limit     = parseInt(searchParams.get("limit") || "8", 10);

  // Load books — AoB if configured, placeholders otherwise
  let books: Book[];
  try {
    books = isConfigured()
      ? await fetchAllAvailableBooks()
      : [...placeholderBooks];
  } catch (error) {
    console.error("AoB fetch failed, falling back to placeholders:", error);
    books = [...placeholderBooks];
  }

  // Filter
  if (query) {
    const q = query.toLowerCase();
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.includes(q)
    );
  }
  if (category && category !== "All") {
    books = books.filter((b) => b.category === category);
  }
  if (condition && condition !== "All") {
    books = books.filter((b) => b.condition === condition);
  }

  // Sort
  switch (sort) {
    case "title-az":
      books.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "price-low":
      books.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      books.sort((a, b) => b.price - a.price);
      break;
  }

  // Paginate
  const total = books.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedBooks = books.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    books: paginatedBooks,
    total,
    page,
    totalPages,
    source: isConfigured() ? "aob" : "placeholder",
  });
}
