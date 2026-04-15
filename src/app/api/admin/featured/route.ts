import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import featuredBooksJson from "@/lib/featured-books.json";

export const runtime = "edge";

function getFeaturedIds(): string[] {
  const envIds = process.env.FEATURED_BOOK_IDS;
  if (envIds) {
    return envIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }
  return featuredBooksJson as string[];
}

export async function GET() {
  const bookIds = getFeaturedIds();
  return NextResponse.json({ bookIds });
}

export async function PUT(request: Request) {
  const authenticated = await isAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // On Cloudflare, the filesystem is immutable — updates must be made via
  // the FEATURED_BOOK_IDS environment variable in the Cloudflare dashboard.
  if (process.env.CF_PAGES) {
    return NextResponse.json(
      {
        error:
          "File writes are not supported on Cloudflare Pages. Update the FEATURED_BOOK_IDS environment variable in your Cloudflare dashboard instead.",
      },
      { status: 405 }
    );
  }

  const { bookIds } = await request.json();
  if (!Array.isArray(bookIds)) {
    return NextResponse.json(
      { error: "bookIds must be an array" },
      { status: 400 }
    );
  }

  return NextResponse.json({ bookIds });
}
