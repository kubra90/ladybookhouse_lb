import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/types/book";

// Sideways-floating strip of seasonal book covers, shown under Book of the
// Week. The heading and the books come from src/lib/seasonal-shelf.ts.
// The book list is rendered twice so the marquee loops seamlessly; the copy is
// aria-hidden so screen readers only announce each book once.
export default function SeasonalBooksRow({
  books,
  heading,
}: {
  books: Book[];
  heading: string;
}) {
  if (books.length === 0) return null;

  const covers = (ariaHidden: boolean) =>
    books.map((book) => (
      <Link
        key={ariaHidden ? `dup-${book.id}` : book.id}
        href={`/books/${book.id}`}
        aria-hidden={ariaHidden || undefined}
        tabIndex={ariaHidden ? -1 : undefined}
        className={`group relative block h-44 w-32 shrink-0 overflow-hidden rounded-md border bg-card shadow-sm transition-shadow hover:shadow-md ${
          ariaHidden ? "motion-reduce:hidden" : ""
        }`}
        title={`${book.title} by ${book.author}`}
      >
        <Image
          src={book.imageUrl}
          alt={ariaHidden ? "" : `${book.title} cover`}
          fill
          sizes="128px"
          className="object-contain p-2 transition-transform group-hover:scale-105"
        />
      </Link>
    ));

  return (
    <section className="border-b bg-warm-sand/30">
      <div className="container py-8 md:py-10">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-wider text-primary">
          {heading}
        </p>
        {/* Reduced motion: the marquee stops, so let the row scroll by hand instead. */}
        <div className="group/row overflow-hidden motion-reduce:overflow-x-auto">
          <div className="flex w-max gap-4 animate-marquee group-hover/row:[animation-play-state:paused] motion-reduce:animate-none">
            {covers(false)}
            {covers(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
