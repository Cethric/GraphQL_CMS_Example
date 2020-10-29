ALTER TABLE ONLY "cms"."post" ALTER COLUMN "description" SET DEFAULT jsonb_build_object();
ALTER TABLE "cms"."post" ALTER COLUMN "description" SET NOT NULL;
