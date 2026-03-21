-- Multi-select publication types (replaces single `type` column)
ALTER TABLE "publications" ADD COLUMN "types" JSONB;

UPDATE "publications"
SET "types" = CASE
  WHEN "type" IS NOT NULL AND TRIM("type") <> '' THEN jsonb_build_array("type")
  ELSE NULL
END;

ALTER TABLE "publications" DROP COLUMN "type";
