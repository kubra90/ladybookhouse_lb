import { NextResponse } from "next/server";
import {
  addNewsletterContact,
  sendNewsletterSignupNotification,
  sendNewsletterWelcomeEmail,
} from "@/lib/email";

export const runtime = "edge";

type SubscribePayload = {
  email?: string;
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Please enter a valid email" },
      { status: 400 }
    );
  }

  try {
    const audienceResult = await addNewsletterContact({ email });
    if (audienceResult.skipped) {
      console.warn(
        "[/api/subscribe] NEWSLETTER_AUDIENCE_ID is not set — skipping Resend audience add"
      );
    }
  } catch (err) {
    console.error("[/api/subscribe] addNewsletterContact failed:", err);
  }

  try {
    await sendNewsletterSignupNotification({ email });
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

  try {
    await sendNewsletterWelcomeEmail({ email });
  } catch (err) {
    console.error(
      "[/api/subscribe] sendNewsletterWelcomeEmail failed:",
      err
    );
  }

  return NextResponse.json({ ok: true });
}
