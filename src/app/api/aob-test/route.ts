import { NextResponse } from "next/server";

export const runtime = "edge";

// Temporary diagnostic route — DELETE after debugging
export async function GET() {
  const username = process.env.AOB_USERNAME;
  const password = process.env.AOB_PASSWORD;

  if (!username || !password) {
    return NextResponse.json({ error: "AOB_USERNAME or AOB_PASSWORD not set in .env.local" });
  }

  const BASE = "https://www.theartofbooks.com/api/2.0";

  // Try a few likely endpoints to see what AoB actually has
  const endpoints = [
    "/book",
    "/books",
    "/inventory",
    "/listing",
    "/listings",
    "/item",
    "/items",
  ];

  const results: Record<string, unknown> = {};

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BASE}${ep}?num_per_page=1`, {
        headers: {
          "AOB-AUTH-USER": username,
          "AOB-AUTH-PW": password,
        },
      });
      const text = await res.text();
      let body: unknown;
      try { body = JSON.parse(text); } catch { body = text.slice(0, 300); }
      results[ep] = { status: res.status, body };
    } catch (e) {
      results[ep] = { error: String(e) };
    }
  }

  return NextResponse.json(results, { status: 200 });
}
