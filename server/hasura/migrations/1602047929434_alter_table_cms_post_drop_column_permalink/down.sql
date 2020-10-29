ALTER TABLE "cms"."post" ADD COLUMN "permalink" text;
ALTER TABLE "cms"."post" ALTER COLUMN "permalink" DROP NOT NULL;
