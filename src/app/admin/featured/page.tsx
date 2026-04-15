"use client";

import { useEffect, useState } from "react";
import { Star, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Book } from "@/types/book";

export default function FeaturedBooksPage() {
  const { toast } = useToast();
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/books?limit=100").then((r) => r.json()),
      fetch("/api/admin/featured").then((r) => r.json()),
    ])
      .then(([booksData, featuredData]) => {
        setAllBooks(booksData.books);
        setFeaturedIds(featuredData.bookIds);
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to load books",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, [toast]);

  function toggleFeatured(bookId: string) {
    setFeaturedIds((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : prev.length < 8
          ? [...prev, bookId]
          : prev
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookIds: featuredIds }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast({
        title: "Saved!",
        description: `${featuredIds.length} featured books updated.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save featured books",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Featured Books</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select up to 8 books to feature on the homepage.{" "}
            <span className="font-medium">
              {featuredIds.length}/8 selected
            </span>
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Currently featured */}
      {featuredIds.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium mb-3">Currently Featured</h2>
          <div className="flex flex-wrap gap-2">
            {featuredIds.map((id) => {
              const book = allBooks.find((b) => b.id === id);
              return (
                <Badge
                  key={id}
                  className="pl-3 pr-1 py-1.5 gap-1 cursor-pointer"
                  onClick={() => toggleFeatured(id)}
                >
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {book?.title || `Book #${id}`}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* All books grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {allBooks.map((book) => {
          const isFeatured = featuredIds.includes(book.id);
          return (
            <button
              key={book.id}
              onClick={() => toggleFeatured(book.id)}
              className={`flex items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
                isFeatured
                  ? "border-primary bg-primary/5"
                  : "hover:bg-warm-sand/30"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
                  isFeatured
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <Star
                  className={`h-4 w-4 ${isFeatured ? "fill-current" : ""}`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{book.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {book.author} &middot; ${book.price.toFixed(2)} &middot;{" "}
                  {book.condition}
                </p>
              </div>
              {isFeatured && (
                <Badge variant="secondary" className="shrink-0 text-[10px]">
                  Featured
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
