"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/store/BookCard";
import type { Book } from "@/types/book";

type Props = {
  bookId: string;
  category: string | null;
};

export default function RelatedBooks({ bookId, category }: Props) {
  const [books, setBooks] = useState<Book[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ limit: "7" });
    if (category) params.set("category", category);

    fetch(`/api/books?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.books) return;
        const filtered = data.books
          .filter((b: Book) => b.id !== bookId)
          .slice(0, 6);
        setBooks(filtered);
      })
      .catch(() => {
        if (!cancelled) setBooks([]);
      });

    return () => {
      cancelled = true;
    };
  }, [bookId, category]);

  if (!books || books.length === 0) return null;

  return (
    <section className="mt-16 md:mt-20">
      <h2 className="font-heading text-xl font-bold mb-6">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {books.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
    </section>
  );
}
