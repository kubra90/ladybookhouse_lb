"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import BrandedLoader from "@/components/store/BrandedLoader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BookCard from "@/components/store/BookCard";
import type { Book } from "@/types/book";

const categories = [
  "All",
  "Art",
  "Art & Music",
  "Bestseller",
  "Business",
  "Comics",
  "Computer Science",
  "Cookbooks",
  "Design",
  "Education",
  "Education & Health",
  "Fashion",
  "Fiction & Literature",
  "Graphic Novels",
  "History & Memory",
  "Kids",
  "Language",
  "Law",
  "Medicine",
  "Natural Science",
  "Nature",
  "Philosophy",
  "Politics",
  "Psychology",
  "Reference",
  "Religion",
  "Religion & Philosophy",
  "Science",
  "Science Fiction",
  "Self-Help",
  "Social Science",
  "Sociology",
  "Spirituality",
  "Sports",
  "Technology",
  "Textbooks",
  "Travel",
];

const conditions: Array<Book["condition"] | "All"> = [
  "All",
  "New",
  "Like New",
  "Very Good",
  "Good",
  "Acceptable",
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "title-az", label: "Title A–Z" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const BOOKS_PER_PAGE = 24;

function FilterControls({
  category,
  setCategory,
  condition,
  setCondition,
  sortBy,
  setSortBy,
}: {
  category: string;
  setCategory: (v: string) => void;
  condition: string;
  setCondition: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1.5 block">Category</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Condition</label>
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {conditions.map((cond) => (
              <SelectItem key={cond} value={cond}>
                {cond}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Sort By</label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Inner component that uses useSearchParams (must be inside Suspense)
function BooksClientInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // All filter/pagination state derived from URL
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const category = searchParams.get("category") || "All";
  const condition = searchParams.get("condition") || "All";
  const sortBy = searchParams.get("sort") || "newest";
  const urlSearch = searchParams.get("search") || "";

  // Local input state — leads the URL (debounced), syncs back on navigation
  const [searchInput, setSearchInput] = useState(urlSearch);

  // Sync input when URL changes (browser back/forward restores search)
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Debounce search: push to URL 300ms after user stops typing
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (searchInput === currentSearch) return; // already in sync, skip
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput) params.set("search", searchInput);
      else params.delete("search");
      params.delete("page"); // reset to page 1 on new search
      router.push(`${pathname}?${params.toString()}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // Books data
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    const params = new URLSearchParams();
    if (urlSearch) params.set("search", urlSearch);
    if (category !== "All") params.set("category", category);
    if (condition !== "All") params.set("condition", condition);
    params.set("sort", sortBy);
    params.set("page", String(page));
    params.set("limit", String(BOOKS_PER_PAGE));

    try {
      const res = await fetch(`/api/books?${params.toString()}`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setBooks(data.books);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setBooks([]);
      setTotal(0);
      setTotalPages(0);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [urlSearch, category, condition, sortBy, page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const activeFilters =
    (category !== "All" ? 1 : 0) + (condition !== "All" ? 1 : 0);

  // Build a new query string, merging overrides into current params.
  // Removes defaults so URLs stay clean (e.g. no ?page=1&sort=newest).
  function buildQuery(overrides: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      const isDefault =
        (key === "page" && value === "1") ||
        (key === "sort" && value === "newest") ||
        (key === "category" && value === "All") ||
        (key === "condition" && value === "All") ||
        value === "";
      if (isDefault) params.delete(key);
      else params.set(key, value);
    }
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }

  function handleCategoryChange(v: string) {
    router.push(`${pathname}${buildQuery({ category: v, page: "1" })}`);
  }
  function handleConditionChange(v: string) {
    router.push(`${pathname}${buildQuery({ condition: v, page: "1" })}`);
  }
  function handleSortChange(v: string) {
    router.push(`${pathname}${buildQuery({ sort: v, page: "1" })}`);
  }
  function handlePageChange(p: number) {
    router.push(`${pathname}${buildQuery({ page: String(p) })}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function clearFilters() {
    setSearchInput("");
    router.push(pathname);
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Page header */}
      <div className="mb-8 space-y-2">
        <h1 className="font-heading text-3xl font-bold md:text-4xl">
          Browse Books
        </h1>
        <p className="text-muted-foreground">
          {total} book{total !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Search + mobile filter toggle */}
      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, author, or ISBN..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                router.push(`${pathname}${buildQuery({ search: "", page: "1" })}`);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile filter button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilters > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="font-heading">Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterControls
                category={category}
                setCategory={handleCategoryChange}
                condition={condition}
                setCondition={handleConditionChange}
                sortBy={sortBy}
                setSortBy={handleSortChange}
              />
              {activeFilters > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="mt-4 w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar filters */}
        <aside className="hidden md:block w-56 shrink-0">
          <FilterControls
            category={category}
            setCategory={handleCategoryChange}
            condition={condition}
            setCondition={handleConditionChange}
            sortBy={sortBy}
            setSortBy={handleSortChange}
          />
          {activeFilters > 0 && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="mt-4 w-full text-sm"
            >
              Clear All Filters
            </Button>
          )}
        </aside>

        {/* Book grid */}
        <div className="flex-1">
          {loading ? (
            <BrandedLoader label="Loading books…" />
          ) : loadError ? (
            <div className="py-20 text-center">
              <p className="font-heading text-lg font-semibold mb-2">
                Couldn&apos;t load books
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Something went wrong while fetching our catalog. Please try
                again.
              </p>
              <Button variant="outline" onClick={fetchBooks}>
                Retry
              </Button>
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-heading text-lg font-semibold mb-2">
                No books found
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              {(() => {
                const pages: (number | "...")[] = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (page > 3) pages.push("...");
                  for (
                    let i = Math.max(2, page - 1);
                    i <= Math.min(totalPages - 1, page + 1);
                    i++
                  )
                    pages.push(i);
                  if (page < totalPages - 2) pages.push("...");
                  pages.push(totalPages);
                }
                return pages.map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`dots-${idx}`}
                      className="px-1 text-muted-foreground"
                    >
                      …
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(p)}
                      className="w-9"
                    >
                      {p}
                    </Button>
                  )
                );
              })()}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Suspense wrapper required because useSearchParams() needs it in Next.js 14
export default function BooksClient() {
  return (
    <Suspense
      fallback={
        <div className="container py-8 md:py-12">
          <BrandedLoader label="Loading books…" />
        </div>
      }
    >
      <BooksClientInner />
    </Suspense>
  );
}
