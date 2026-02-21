DO $$ BEGIN
  ALTER TABLE "levels" ADD CONSTRAINT "levels_code_language_unique" UNIQUE("code","language_code");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;