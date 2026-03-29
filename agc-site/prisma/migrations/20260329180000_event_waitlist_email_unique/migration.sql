-- Allow waitlist when event capacity is full
ALTER TABLE "events" ADD COLUMN "allow_waitlist" BOOLEAN NOT NULL DEFAULT false;

-- Waitlisted registrations (badge issued; check-in blocked until staff promotes)
ALTER TABLE "event_registrations" ADD COLUMN "waitlisted" BOOLEAN NOT NULL DEFAULT false;

-- Case-insensitive uniqueness via stored lowercase email (application sets email lower)
UPDATE "event_registrations" SET "email" = lower(btrim("email"));

-- One row per (event, email). Resolve duplicate (event_slug, email) rows before applying if migration fails.
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_slug_email_key" UNIQUE ("event_slug", "email");
