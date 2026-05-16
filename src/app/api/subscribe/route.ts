import { NextResponse } from "next/server";
import {
  addNewsletterContact,
  sendNewsletterSignupNotification,
  type NewsletterFrequency,
} from "@/lib/email";

export const runtime = "edge";

type SubscribePayload = {
  email?: string;
  frequency?: string;
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isFrequency(value: string): value is NewsletterFrequency {
  return value === "weekly" || value === "monthly";
}

export async function POST(request: Request) {
  let body: SubscribePayload;
  try {
    body = (await request.json()) as SubscribePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const frequency = (body.frequency ?? "").trim();

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Please enter a valid email" },
      { status: 400 }
    );
  }
  if (!isFrequency(frequency)) {
    return NextResponse.json(
      { error: "Please choose how often you'd like to hear from us" },
      { status: 400 }
    );
  }

  try {
    const audienceResult = await addNewsletterContact({ email, frequency });
    if (audienceResult.skipped) {
      console.warn(
        `[/api/subscribe] NEWSLETTER_AUDIENCE_${frequency.toUpperCase()}_ID is not set — skipping Resend audience add`
      );
    }
  } catch (err) {
    console.error("[/api/subscribe] addNewsletterContact failed:", err);
  }

  try {
    await sendNewsletterSignupNotification({ email, frequency });
  } catch (err) {
    console.error(
      "[/api/subscribe] sendNewsletterSignupNotification failed:",
      err
    );
    return NextResponse.json(
      { error: "Could not save your signup. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
