-- CreateTable
CREATE TABLE "registrations_of_interest" (
    "id" SERIAL NOT NULL,
    "event_type" VARCHAR(20) NOT NULL,
    "title" VARCHAR(50),
    "full_name" VARCHAR(255) NOT NULL,
    "job_title" VARCHAR(255) NOT NULL,
    "organisation" VARCHAR(255) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telephone" VARCHAR(50) NOT NULL,
    "organisation_type" VARCHAR(255) NOT NULL,
    "participation_type" VARCHAR(100) NOT NULL,
    "areas_of_interest" TEXT NOT NULL,
    "previous_participation" BOOLEAN NOT NULL,
    "visa_support" BOOLEAN NOT NULL,
    "accessibility_reqs" TEXT,
    "dietary_reqs" TEXT,
    "how_heard" VARCHAR(100) NOT NULL,
    "review_status" VARCHAR(30) NOT NULL DEFAULT 'pending',
    "review_notes" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registrations_of_interest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "registrations_of_interest_event_type_idx" ON "registrations_of_interest"("event_type");

-- CreateIndex
CREATE INDEX "registrations_of_interest_created_at_idx" ON "registrations_of_interest"("created_at");

-- CreateIndex
CREATE INDEX "registrations_of_interest_review_status_idx" ON "registrations_of_interest"("review_status");

-- CreateIndex
CREATE INDEX "registrations_of_interest_event_type_review_status_idx" ON "registrations_of_interest"("event_type", "review_status");
