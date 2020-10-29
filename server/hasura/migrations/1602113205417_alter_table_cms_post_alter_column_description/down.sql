ALTER TABLE ONLY "cms"."post" ALTER COLUMN "description" DROP DEFAULT;
ALTER TABLE "cms"."post" ALTER COLUMN "description" DROP NOT NULL;
