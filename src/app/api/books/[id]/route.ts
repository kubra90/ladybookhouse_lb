import { NextResponse } from "next/server";
import { fetchBook, isConfigured } from "@/lib/aob-client";
import { placeholderBooks } from "@/lib/placeholder-books";

export const runtime = "edge";
export const revalidate = 300;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let book = null;

  if (isConfigured()) {
    try {
      book = await fetchBook(id);
    } catch (error) {
      console.error("AoB API error, falling back to placeholders:", error);
    }
  }

  // Fallback to placeholder data
  if (!book) {
    book = placeholderBooks.find((b) => b.id === id) || null;
  }

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  return NextResponse.json({ book });
}
