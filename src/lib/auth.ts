// Edge-compatible admin auth using Web Crypto API
// Replaces next-auth for Cloudflare Pages compatibility

const COOKIE_NAME = "admin-token";
const encoder = new TextEncoder();

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not configured");
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64url(data: string | ArrayBuffer): string {
  const str =
    typeof data === "string"
      ? btoa(data)
      : btoa(String.fromCharCode(...new Uint8Array(data)));
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded);
}

export async function createToken(): Promise<string> {
  const key = await getKey();
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      role: "admin",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    })
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${header}.${payload}`)
  );
  return `${header}.${payload}.${base64url(signature)}`;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const key = await getKey();
    const [header, payload, sig] = token.split(".");
    if (!header || !payload || !sig) return false;

    const sigBytes = Uint8Array.from(base64urlDecode(sig), (c) =>
      c.charCodeAt(0)
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(`${header}.${payload}`)
    );
    if (!valid) return false;

    const data = JSON.parse(base64urlDecode(payload));
    if (data.exp < Math.floor(Date.now() / 1000)) return false;

    return true;
  } catch {
    return false;
  }
}

export function getTokenFromCookies(
  cookieHeader: string | null
): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

export async function isAuthenticated(request: Request): Promise<boolean> {
  const token = getTokenFromCookies(request.headers.get("cookie"));
  if (!token) return false;
  return verifyToken(token);
}

export function setAuthCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${24 * 60 * 60}; Secure`;
}

export function clearAuthCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
