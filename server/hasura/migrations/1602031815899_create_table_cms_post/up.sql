CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "cms"."post"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "title" text NOT NULL, "description" jsonb, "content" jsonb NOT NULL, "published_at" timestamptz, "author" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE OR REPLACE FUNCTION "cms"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_cms_post_updated_at"
BEFORE UPDATE ON "cms"."post"
FOR EACH ROW
EXECUTE PROCEDURE "cms"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_cms_post_updated_at" ON "cms"."post" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
