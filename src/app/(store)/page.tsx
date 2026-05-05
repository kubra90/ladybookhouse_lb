import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/store/BookCard";
import { fetchAllAvailableBooks, isConfigured } from "@/lib/aob-client";
import { placeholderBooks } from "@/lib/placeholder-books";
import type { Book } from "@/types/book";

export const metadata: Metadata = {
  title: "Curated Used Books",
  description:
    "Welcome to Lady Bookhouse — a small, independent bookshop with a big heart. Browse our curated selection of fiction, non-fiction, and more.",
};

export const runtime = "edge";
export const dynamic = "force-dynamic";

async function getFeaturedBooks(): Promise<Book[]> {
  let allBooks: Book[];
  try {
    allBooks = isConfigured()
      ? await fetchAllAvailableBooks()
      : [...placeholderBooks];
  } catch {
    allBooks = [...placeholderBooks];
  }

  const eligible = allBooks
    .filter((b) => b.imageUrl && b.price > 10)
    .sort((a, b) => (b.listedDate || "").localeCompare(a.listedDate || ""));

  const featured: Book[] = [];
  const seenCategories = new Set<string>();
  for (const book of eligible) {
    const cat = book.category || "_uncategorized";
    if (seenCategories.has(cat)) continue;
    seenCategories.add(cat);
    featured.push(book);
    if (featured.length >= 8) break;
  }

  // If there aren't 8 distinct genres, fill with the next-newest books.
  if (featured.length < 8) {
    for (const book of eligible) {
      if (featured.some((f) => f.id === book.id)) continue;
      featured.push(book);
      if (featured.length >= 8) break;
    }
  }

  return featured.slice(0, 8);
}

export default async function HomePage() {
  const featuredBooks = await getFeaturedBooks();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-warm-sand">
        <div className="container py-20 md:py-28">
          <div className="max-w-2xl space-y-6">
            <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Welcome to
              <br />
              <span className="text-primary">Lady Bookhouse</span>
            </h1>
            <p className="font-serif text-lg text-muted-foreground leading-relaxed md:text-xl">
              A carefully curated collection of books — from timeless classics
              to hidden gems. Every book is hand-picked with love and shipped
              with care.
            </p>
            <div className="flex gap-3">
              <Link href="/books">
                <Button size="lg" className="font-medium">
                  Browse Books
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="font-medium">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="container py-16 md:py-20">
        <div className="mb-10 text-center space-y-2">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            Featured Books
          </h2>
          <p className="text-muted-foreground">
            A few of our favorite picks across different genres
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/books">
            <Button variant="outline" size="lg">
              View All Books
            </Button>
          </Link>
        </div>
      </section>

      {/* About the Shop */}
      <section className="bg-warm-sand/50">
        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h2 className="font-heading text-2xl font-bold md:text-3xl">
              About the Shop
            </h2>
            <p className="font-serif text-muted-foreground leading-relaxed text-lg">
              Lady Bookhouse is a small, independent bookshop with a big heart.
              We believe every book deserves a second chance and every reader
              deserves a great find. Whether you&apos;re looking for a beloved
              classic or a great new find, we&apos;ve got shelves full of
              stories waiting for you.
            </p>
          </div>

          {/* Value props */}
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-sm font-semibold">
                Curated Selection
              </h3>
              <p className="text-sm text-muted-foreground">
                Every book is personally reviewed for quality and character
                before it hits our shelves.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-sm font-semibold">
                Careful Shipping
              </h3>
              <p className="text-sm text-muted-foreground">
                Each book is wrapped and packed with care so it arrives in
                perfect condition.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-sm font-semibold">
                Love for Books
              </h3>
              <p className="text-sm text-muted-foreground">
                This isn&apos;t just a business — it&apos;s a passion. We care
                about connecting readers with great books.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
