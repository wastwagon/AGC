-- CreateTable
CREATE TABLE "join_us_inquiries" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "organization" VARCHAR(255),
    "interest_area" VARCHAR(255),
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "join_us_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "join_us_inquiries_created_at_idx" ON "join_us_inquiries"("created_at");
