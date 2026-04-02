-- Ensure content slugs are unique for public routing lookups.
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");
CREATE UNIQUE INDEX "publications_slug_key" ON "publications"("slug");
