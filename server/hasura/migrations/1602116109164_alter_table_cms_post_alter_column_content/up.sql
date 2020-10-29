ALTER TABLE ONLY "cms"."post" ALTER COLUMN "content" SET DEFAULT jsonb_build_array();
