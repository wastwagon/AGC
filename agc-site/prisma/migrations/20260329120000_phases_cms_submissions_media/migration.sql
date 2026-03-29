-- AlterTable
ALTER TABLE "volunteer_applications" ADD COLUMN "application_type" VARCHAR(50) NOT NULL DEFAULT 'volunteer';

-- CreateIndex
CREATE INDEX "volunteer_applications_application_type_idx" ON "volunteer_applications"("application_type");

-- CreateTable
CREATE TABLE "partnership_inquiries" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "organization" VARCHAR(255),
    "focus_area" VARCHAR(255),
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partnership_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "partnership_inquiries_created_at_idx" ON "partnership_inquiries"("created_at");
