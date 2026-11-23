"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
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
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Visitors with reduced motion get a hand-scrollable strip instead of the
  // marquee (see the row's motion-reduce classes below). Phones were opening
  // that strip scrolled to its far right edge, so the row showed the last book
  // with nowhere left to swipe — it read as broken. Pin it to the start until
  // the visitor scrolls it themselves.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let touched = false;
    const markTouched = () => {
      touched = true;
    };
    const pinToStart = () => {
      if (!touched) el.scrollLeft = 0;
    };

    el.addEventListener("pointerdown", markTouched, { once: true });
    el.addEventListener("touchstart", markTouched, { once: true, passive: true });
    el.addEventListener("wheel", markTouched, { once: true, passive: true });

    pinToStart();

    // The covers land one at a time, and each arrival can drag the scroll
    // position along with it, so re-pin until they have all settled. Waiting
    // on window "load" isn't enough: the duplicate covers are display:none
    // under reduced motion and never load at all.
    const covers = Array.from(el.querySelectorAll("img"));
    covers.forEach((img) => {
      img.addEventListener("load", pinToStart);
      img.addEventListener("error", pinToStart);
    });

    return () => {
      covers.forEach((img) => {
        img.removeEventListener("load", pinToStart);
        img.removeEventListener("error", pinToStart);
      });
      el.removeEventListener("pointerdown", markTouched);
      el.removeEventListener("touchstart", markTouched);
      el.removeEventListener("wheel", markTouched);
    };
  }, [books]);

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
        {/* Reduced motion: the marquee stops, so let the row scroll by hand instead.
            overflow-anchor:none keeps the browser from dragging the scroll
            position along as covers load. */}
        <div
          ref={scrollerRef}
          className="group/row overflow-hidden [overflow-anchor:none] motion-reduce:overflow-x-auto"
        >
          <div className="flex w-max gap-4 animate-marquee group-hover/row:[animation-play-state:paused] motion-reduce:animate-none">
            {covers(false)}
            {covers(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
