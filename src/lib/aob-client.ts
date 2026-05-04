// Art of Books (AoB) API Client
//
// Confirmed working endpoint (via /api/aob-test diagnostic):
//   GET /item?num_per_page=N&page=N  → returns paginated inventory
//
// Auth: AOB-AUTH-USER / AOB-AUTH-PW headers
// Required env vars: AOB_USERNAME, AOB_PASSWORD
//
// NOTE: The API returns ALL records including sold books (qty=0).
//       We filter to qty > 0 to show only in-stock books.

import type { Book } from "@/types/book";

const AOB_BASE_URL = "https://www.theartofbooks.com/api/2.0";

interface AoBItem {
  sku: string;
  isbn: string;
  title: string;
  author: string;
  price: string;
  condition: string;       // numeric string "1"–"5"
  notes: string | null;
  description: string | null;
  image: string | null;
  z_category: string | null;
  z_browse: string | null; // human-readable browse category (e.g. "Art & Music")
  qty: string | null;      // "0" = sold, "1"+ = in stock
  media: string | null;
  publisher: string | null;
  listed_date: string | null;
}

interface AoBResponse {
  count: string;
  results: AoBItem[];
}

function getConfig() {
  const username = process.env.AOB_USERNAME;
  const password = process.env.AOB_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}

export function isConfigured(): boolean {
  return getConfig() !== null;
}

async function aobFetch<T>(endpoint: string): Promise<T> {
  const config = getConfig();
  if (!config) throw new Error("AoB API not configured");

  const res = await fetch(`${AOB_BASE_URL}${endpoint}`, {
    headers: {
      "AOB-AUTH-USER": config.username,
      "AOB-AUTH-PW": config.password,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`AoB API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// AoB condition codes (confirmed from API data)
const conditionMap: Record<string, Book["condition"]> = {
  "11": "New",
  "1":  "Like New",
  "2":  "Very Good",
  "3":  "Good",
  "4":  "Acceptable",
};

// Strip format tags and author name appended to title by AoB
// e.g. "Some Title [Paperback] Author Name" → "Some Title"
function cleanTitle(raw: string, rawAuthor?: string): string {
  let title = raw
    .replace(/\s*\[(Paperback|Hardcover|Mass Market Paperback|Hardback|Audio CD|Board Book|Spiral-bound|Large Print)\]/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (rawAuthor) {
    // Strip full author from end: "Title Weber, Max" → "Title"
    const escaped = rawAuthor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    title = title.replace(new RegExp(`\\s+${escaped}\\s*$`), "").trim();

    // Strip just last name if "Last, First" format
    const lastName = rawAuthor.split(",")[0]?.trim();
    if (lastName && lastName.length > 2) {
      const escapedLast = lastName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      title = title.replace(new RegExp(`\\s+${escapedLast}\\s*$`), "").trim();
    }
  }

  return title;
}

// Normalize z_browse values so they match the dropdown labels.
// AoB returns inconsistent casing/spacing/plurals — collapse them here.
const categoryAliases: Record<string, string> = {
  "art&music": "Art & Music",
  "education&health": "Education & Health",
  "fiction&literature": "Fiction & Literature",
  "history&memory": "History & Memory",
  "hm": "History & Memory",
  "religion&philosophy": "Religion & Philosophy",
  "cookbook": "Cookbooks",
  "graphic novel": "Graphic Novels",
  "medical": "Medicine",
  "sport": "Sports",
  "textbook": "Textbooks",
  "foreign language": "Language",
};

function normalizeCategory(raw: string | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const key = trimmed.toLowerCase();
  if (categoryAliases[key]) return categoryAliases[key];
  // Title-case the input as a fallback for already-clean values like "Bestseller"
  return trimmed.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

// Normalize "Last, First" → "First Last"
function normalizeAuthor(raw: string): string {
  if (!raw) return "";
  const match = raw.match(/^([^,]+),\s*(.+)$/);
  if (match) return `${match[2].trim()} ${match[1].trim()}`;
  return raw.trim();
}

function mapItem(item: AoBItem): Book {
  const qty = parseInt(item.qty || "0", 10);
  return {
    id: item.sku,
    isbn: item.isbn || "",
    title: cleanTitle(item.title || "", item.author),
    author: normalizeAuthor(item.author || ""),
    price: parseFloat(item.price) || 0,
    condition: conditionMap[item.condition] || "Good",
    description: item.notes || item.description || "",
    imageUrl: item.image || "",
    category: normalizeCategory(item.z_browse || item.z_category),
    quantity: qty,
    isAvailable: qty > 0,
    listedDate: item.listed_date || undefined,
  };
}

// In-memory cache for the bulk inventory fetch.
// Edge runtime doesn't honor Next.js fetch revalidate, so we cache here.
// One entry per worker instance; refreshed at most every CACHE_TTL ms.
const CACHE_TTL = 5 * 60 * 1000;
let allBooksCache: { books: Book[]; expires: number } | null = null;
let inflightAllBooks: Promise<Book[]> | null = null;

// Fetch ALL in-stock books from AoB in one call (large page size).
// The API returns sold books (qty=0) mixed in, so we filter them out.
export async function fetchAllAvailableBooks(): Promise<Book[]> {
  const now = Date.now();
  if (allBooksCache && allBooksCache.expires > now) return allBooksCache.books;
  // De-dupe concurrent callers so we don't fire multiple ~20s requests.
  if (inflightAllBooks) return inflightAllBooks;

  inflightAllBooks = (async () => {
    try {
      const data = await aobFetch<AoBResponse>(`/item?num_per_page=6000&page=1`);
      const books = (data.results || []).map(mapItem).filter((b) => b.isAvailable);
      allBooksCache = { books, expires: Date.now() + CACHE_TTL };
      return books;
    } finally {
      inflightAllBooks = null;
    }
  })();

  return inflightAllBooks;
}

// Kept for book detail page — try SKU then ISBN lookup
export async function fetchBook(id: string): Promise<Book | null> {
  try {
    const data = await aobFetch<AoBResponse>(
      `/item?sku=${encodeURIComponent(id)}&num_per_page=1`
    );
    if (data.results?.length) return mapItem(data.results[0]);

    const data2 = await aobFetch<AoBResponse>(
      `/item?isbn=${encodeURIComponent(id)}&num_per_page=1`
    );
    if (data2.results?.length) return mapItem(data2.results[0]);

    return null;
  } catch {
    return null;
  }
}

export async function markSold(bookId: string): Promise<boolean> {
  try {
    await aobFetch(`/item/${bookId}/sold`);
    return true;
  } catch (error) {
    console.error(`Failed to mark book ${bookId} as sold:`, error);
    return false;
  }
}
