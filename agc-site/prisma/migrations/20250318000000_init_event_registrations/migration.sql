-- CreateTable
CREATE TABLE "event_registrations" (
    "id" TEXT NOT NULL,
    "event_slug" TEXT NOT NULL,
    "event_id" INTEGER,
    "event_title" TEXT NOT NULL,
    "event_start_date" TIMESTAMP(3) NOT NULL,
    "event_end_date" TIMESTAMP(3),
    "event_location" TEXT,
    "registration_id" TEXT NOT NULL,
    "qr_token" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "organization" TEXT,
    "dietary_reqs" TEXT,
    "checked_in_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_registration_id_key" ON "event_registrations"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_qr_token_key" ON "event_registrations"("qr_token");

-- CreateIndex
CREATE INDEX "event_registrations_event_slug_idx" ON "event_registrations"("event_slug");

-- CreateIndex
CREATE INDEX "event_registrations_qr_token_idx" ON "event_registrations"("qr_token");

-- CreateIndex
CREATE INDEX "event_registrations_registration_id_idx" ON "event_registrations"("registration_id");
