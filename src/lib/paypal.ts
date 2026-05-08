// PayPal server-side client (edge-runtime compatible — uses fetch only)
//
// Required env vars:
//   PAYPAL_CLIENT_ID
//   PAYPAL_CLIENT_SECRET
//   PAYPAL_ENVIRONMENT  ("sandbox" or "live")

const SANDBOX_BASE = "https://api-m.sandbox.paypal.com";
const LIVE_BASE = "https://api-m.paypal.com";

export function paypalBaseUrl(): string {
  return process.env.PAYPAL_ENVIRONMENT === "live" ? LIVE_BASE : SANDBOX_BASE;
}

export async function getPayPalAccessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error(
      "PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET are not set. Add them to your .env.local file."
    );
  }

  const auth = btoa(`${id}:${secret}`);
  const res = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal token error: ${res.status} ${text}`);
  }

  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export type PayPalOrderResponse = {
  id: string;
  status: string;
  links: { href: string; rel: string; method: string }[];
};

export async function createPayPalOrder(
  body: unknown
): Promise<PayPalOrderResponse> {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${paypalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`PayPal create-order error: ${res.status} ${text}`);
  }
  return JSON.parse(text) as PayPalOrderResponse;
}

export type PayPalCaptureResponse = {
  id: string;
  status: string;
  payer?: {
    email_address?: string;
    name?: { given_name?: string; surname?: string };
  };
  purchase_units?: Array<{
    items?: Array<{ name: string; quantity: string; sku?: string; unit_amount?: { value: string } }>;
    shipping?: {
      name?: { full_name?: string };
      address?: {
        address_line_1?: string;
        address_line_2?: string;
        admin_area_2?: string;
        admin_area_1?: string;
        postal_code?: string;
        country_code?: string;
      };
    };
    payments?: {
      captures?: Array<{
        id: string;
        amount: { currency_code: string; value: string };
        seller_receivable_breakdown?: { gross_amount?: { value: string } };
      }>;
    };
    amount?: {
      value: string;
      breakdown?: {
        item_total?: { value: string };
        shipping?: { value: string };
      };
    };
  }>;
};

export async function capturePayPalOrder(
  orderId: string
): Promise<PayPalCaptureResponse> {
  const token = await getPayPalAccessToken();
  const res = await fetch(
    `${paypalBaseUrl()}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const text = await res.text();
  const json = JSON.parse(text);

  // ORDER_ALREADY_CAPTURED is treated as success (idempotent retries from the client)
  if (!res.ok) {
    const alreadyCaptured =
      Array.isArray(json?.details) &&
      json.details.some((d: { issue?: string }) => d.issue === "ORDER_ALREADY_CAPTURED");
    if (alreadyCaptured) {
      return getPayPalOrder(orderId);
    }
    throw new Error(`PayPal capture error: ${res.status} ${text}`);
  }
  return json as PayPalCaptureResponse;
}

export async function getPayPalOrder(orderId: string): Promise<PayPalCaptureResponse> {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${paypalBaseUrl()}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal get-order error: ${res.status} ${text}`);
  }
  return (await res.json()) as PayPalCaptureResponse;
}
