"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Book } from "@/types/book";

// Drift speed of the row, matching the 135s CSS marquee this replaced.
const PIXELS_PER_SECOND = 47;
// How long to leave the row alone after someone has touched it.
const RESUME_DELAY_MS = 2500;

// Sideways-floating strip of seasonal book covers, shown under Book of the
// Week. The heading and the books come from src/lib/seasonal-shelf.ts.
//
// This used to be a CSS `animation` on a 12,000px-wide track inside an
// `overflow: hidden` box. It looked right but could not be touched: a finger
// on the covers moved the page, never the row. It is now a real horizontal
// scroll container that JavaScript nudges along, so the same drift is also
// swipeable and the browser handles touch and momentum natively.
//
// The book list is rendered twice so the loop is seamless: the scroll position
// wraps at the halfway mark, which is the same pixel for pixel. The duplicate
// copy is aria-hidden so screen readers only announce each book once.
export default function SeasonalBooksRow({
  books,
  heading,
}: {
  books: Book[];
  heading: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Visitors who ask for reduced motion get a row that sits still. It is
    // still a scroll container, so they can swipe through it by hand.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.scrollLeft = 0;
      return;
    }

    let paused = false;
    let resumeTimer = 0;
    let frame = 0;
    // Position is derived from absolute elapsed time rather than accumulated
    // per-frame deltas, so a slow or doubled frame can never make the row race.
    let anchorTime = performance.now();
    let anchorOffset = 0;

    const pause = () => {
      paused = true;
      window.clearTimeout(resumeTimer);
    };
    const resume = () => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        // Pick the drift up from wherever they left the row.
        anchorOffset = el.scrollLeft;
        anchorTime = performance.now();
        paused = false;
      }, RESUME_DELAY_MS);
    };
    const nudge = () => {
      pause();
      resume();
    };

    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", resume);
    el.addEventListener("pointercancel", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("wheel", nudge, { passive: true });

    const tick = (now: number) => {
      if (!paused) {
        const half = el.scrollWidth / 2;
        if (half > 0) {
          const travelled =
            anchorOffset + (PIXELS_PER_SECOND * (now - anchorTime)) / 1000;
          el.scrollLeft = travelled % half;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resumeTimer);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", resume);
      el.removeEventListener("pointercancel", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("wheel", nudge);
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
        className="group relative block h-44 w-32 shrink-0 overflow-hidden rounded-md border bg-card shadow-sm transition-shadow hover:shadow-md"
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
        {/* overscroll-x-contain stops a swipe that runs off the end of the row
            from becoming a page gesture or an iOS back-swipe. The scrollbar is
            hidden so the row still reads as decorative. */}
        <div
          ref={scrollerRef}
          className="overflow-x-auto overflow-y-hidden overscroll-x-contain [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max gap-4">
            {covers(false)}
            {covers(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
