CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "cms"."post_history"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "post_id" uuid NOT NULL, "content" jsonb NOT NULL, "description" jsonb NOT NULL, "title" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("post_id") REFERENCES "cms"."post"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));
