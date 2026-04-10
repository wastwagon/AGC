-- Optional document links for news articles (PDFs, calls, reports).
ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "download_resources" JSONB;
