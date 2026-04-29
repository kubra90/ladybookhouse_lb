import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import RelatedBooks from "@/components/store/RelatedBooks";
import AddToCartButton from "@/components/store/AddToCartButton";
import { fetchBook, isConfigured } from "@/lib/aob-client";
import { placeholderBooks } from "@/lib/placeholder-books";

export const runtime = "edge";
export const revalidate = 300;

async function loadBook(id: string) {
  if (isConfigured()) {
    try {
      const aobBook = await fetchBook(id);
      if (aobBook) return aobBook;
    } catch (error) {
      console.error("AoB API error, falling back to placeholders:", error);
    }
  }
  return placeholderBooks.find((b) => b.id === id) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = await loadBook(id);
  if (!book) {
    return { title: "Book not found" };
  }
  return {
    title: `${book.title} by ${book.author}`,
    description: book.description.slice(0, 160),
    openGraph: {
      title: `${book.title} by ${book.author}`,
      description: book.description.slice(0, 160),
      type: "website",
    },
  };
}

const conditionColor: Record<string, string> = {
  New: "bg-warm-olive text-white border-transparent",
  "Like New": "bg-warm-olive/80 text-white border-transparent",
  "Very Good": "bg-warm-olive/60 text-white border-transparent",
  Good: "bg-warm-brown/80 text-white border-transparent",
  Acceptable: "bg-warm-rose text-foreground border-transparent",
};

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await loadBook(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Back link */}
      <Link
        href="/books"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to catalog
      </Link>

      {/* Book detail */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Cover image — aspect ratio keeps it proportional at any width */}
        <div className="relative w-full max-w-md mx-auto md:mx-0 aspect-[3/4] rounded-lg bg-warm-sand overflow-hidden">
          {book.imageUrl ? (
            <Image
              src={book.imageUrl}
              alt={`${book.title} cover`}
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-contain p-4"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-serif text-lg text-muted-foreground text-center px-8 leading-relaxed">
                {book.title}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start gap-3 mb-2">
              <h1 className="font-heading text-2xl font-bold md:text-3xl">
                {book.title}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">{book.author}</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              className={`text-xs ${conditionColor[book.condition] || ""}`}
            >
              {book.condition}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {book.category}
            </span>
          </div>

          <p className="text-2xl font-bold text-primary">
            ${book.price.toFixed(2)}
          </p>

          <div className="space-y-2">
            <h2 className="font-heading text-sm font-semibold">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {book.description}
            </p>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">ISBN:</span>{" "}
              {book.isbn}
            </p>
            <p>
              <span className="font-medium text-foreground">Availability:</span>{" "}
              {book.isAvailable ? "In Stock" : "Sold"}
            </p>
          </div>

          <AddToCartButton book={book} size="lg" className="w-full sm:w-auto" />
        </div>
      </div>

      <RelatedBooks bookId={book.id} category={book.category ?? null} />

    </div>
  );
}
