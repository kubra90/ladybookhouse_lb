"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Star, ShoppingCart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/types/book";

interface Stats {
  totalBooks: number;
  source: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [featuredCount, setFeaturedCount] = useState(0);

  useEffect(() => {
    fetch("/api/books?limit=1")
      .then((r) => r.json())
      .then((data: { total: number; source: string; books: Book[] }) => {
        setStats({ totalBooks: data.total, source: data.source });
      })
      .catch(() => {});

    fetch("/api/admin/featured")
      .then((r) => r.json())
      .then((data: { bookIds: string[] }) => {
        setFeaturedCount(data.bookIds.length);
      })
      .catch(() => {});
  }, []);

  const cards = [
    {
      title: "Total Books",
      value: stats?.totalBooks ?? "—",
      subtitle: stats
        ? `Source: ${stats.source === "aob" ? "Art of Books" : "Placeholder data"}`
        : "Loading...",
      icon: BookOpen,
      color: "bg-warm-olive/10 text-warm-olive",
    },
    {
      title: "Featured Books",
      value: featuredCount,
      subtitle: "Displayed on homepage",
      icon: Star,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Orders",
      value: "Stripe",
      subtitle: "Managed via Stripe Dashboard",
      icon: ShoppingCart,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, Admin
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="rounded-lg border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {card.title}
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-md ${card.color}`}
              >
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="rounded-lg border p-5">
        <h2 className="font-heading text-lg font-semibold mb-4">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link href="/admin/featured">
            <Button variant="outline" className="w-full justify-start">
              <Star className="h-4 w-4 mr-2" />
              Manage Featured Books
            </Button>
          </Link>
          <Link href="/books" target="_blank">
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              View Store
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
