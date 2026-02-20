CREATE TYPE "public"."concept_progress_status" AS ENUM('new', 'learning', 'reviewing', 'mastered');--> statement-breakpoint
CREATE TYPE "public"."concept_type" AS ENUM('vocab', 'grammar_rule', 'writing_char', 'kanji', 'radical', 'phonetic_sound', 'conjugation_pattern', 'particle_usage', 'sentence_pattern', 'listening_contrast', 'composition_frame');--> statement-breakpoint
CREATE TYPE "public"."lesson_block_type" AS ENUM('teach', 'drill', 'checkpoint', 'review', 'exam');--> statement-breakpoint
CREATE TYPE "public"."lesson_mode" AS ENUM('legacy_quiz', 'guided_skill');--> statement-breakpoint
CREATE TYPE "public"."skill_status" AS ENUM('locked', 'unlocked', 'in_progress', 'mastered');--> statement-breakpoint
CREATE TYPE "public"."skill_type" AS ENUM('writing', 'grammar', 'vocabulary', 'pronunciation', 'composition', 'review', 'kana', 'kanji', 'radical', 'listening', 'speaking', 'conjugation');--> statement-breakpoint
ALTER TYPE "public"."question_type" ADD VALUE 'character_recognition';--> statement-breakpoint
ALTER TYPE "public"."question_type" ADD VALUE 'character_writing';--> statement-breakpoint
ALTER TYPE "public"."question_type" ADD VALUE 'script_transliteration';--> statement-breakpoint
ALTER TYPE "public"."question_type" ADD VALUE 'conjugation_cloze';--> statement-breakpoint
ALTER TYPE "public"."question_type" ADD VALUE 'particle_selection';--> statement-breakpoint
ALTER TYPE "public"."question_type" ADD VALUE 'grammar_transformation';--> statement-breakpoint
ALTER TYPE "public"."question_type" ADD VALUE 'kanji_composition';--> statement-breakpoint
ALTER TYPE "public"."question_type" ADD VALUE 'minimal_pair_discrimination';--> statement-breakpoint
ALTER TYPE "public"."question_type" ADD VALUE 'dictation';--> statement-breakpoint
ALTER TYPE "public"."question_type" ADD VALUE 'guided_composition';--> statement-breakpoint
CREATE TABLE "concepts" (
	"id" serial PRIMARY KEY NOT NULL,
	"language_code" varchar(10) NOT NULL,
	"type" "concept_type" NOT NULL,
	"key" varchar(100) NOT NULL,
	"title_en" varchar(200) NOT NULL,
	"title_de" varchar(200) NOT NULL,
	"description_en" text,
	"description_de" text,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"cefr_level" "level_code",
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "concepts_lang_key_unique" UNIQUE("language_code","key")
);
--> statement-breakpoint
CREATE TABLE "lesson_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"block_type" "lesson_block_type" NOT NULL,
	"order" integer NOT NULL,
	"title_en" varchar(200),
	"title_de" varchar(200),
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_optional" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"skill_id" integer NOT NULL,
	"role" varchar(20) DEFAULT 'primary' NOT NULL,
	CONSTRAINT "lesson_skills_unique" UNIQUE("lesson_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "placement_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"language_code" varchar(10) NOT NULL,
	"estimated_level" varchar(10),
	"total_questions" integer DEFAULT 0 NOT NULL,
	"correct_count" integer DEFAULT 0 NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_concepts" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"concept_id" integer NOT NULL,
	CONSTRAINT "question_concepts_unique" UNIQUE("question_id","concept_id")
);
--> statement-breakpoint
CREATE TABLE "skill_concepts" (
	"id" serial PRIMARY KEY NOT NULL,
	"skill_id" integer NOT NULL,
	"concept_id" integer NOT NULL,
	"role" varchar(20) DEFAULT 'core' NOT NULL,
	"weight" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "skill_concepts_unique" UNIQUE("skill_id","concept_id")
);
--> statement-breakpoint
CREATE TABLE "skill_prerequisites" (
	"id" serial PRIMARY KEY NOT NULL,
	"skill_id" integer NOT NULL,
	"prerequisite_skill_id" integer NOT NULL,
	"min_mastery" real DEFAULT 0.8 NOT NULL,
	CONSTRAINT "skill_prerequisites_unique" UNIQUE("skill_id","prerequisite_skill_id")
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"language_code" varchar(10) NOT NULL,
	"type" "skill_type" NOT NULL,
	"key" varchar(100) NOT NULL,
	"title_en" varchar(200) NOT NULL,
	"title_de" varchar(200) NOT NULL,
	"description_en" text,
	"description_de" text,
	"cefr_level" "level_code",
	"icon_name" varchar(50),
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "skills_lang_key_unique" UNIQUE("language_code","key")
);
--> statement-breakpoint
CREATE TABLE "user_concept_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"concept_id" integer NOT NULL,
	"status" "concept_progress_status" DEFAULT 'new' NOT NULL,
	"mastery" real DEFAULT 0 NOT NULL,
	"easiness_factor" real DEFAULT 2.5 NOT NULL,
	"interval_days" real DEFAULT 1 NOT NULL,
	"repetitions" integer DEFAULT 0 NOT NULL,
	"total_attempts" integer DEFAULT 0 NOT NULL,
	"correct_attempts" integer DEFAULT 0 NOT NULL,
	"next_review_at" timestamp,
	"last_reviewed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_concept_progress_unique" UNIQUE("user_id","concept_id")
);
--> statement-breakpoint
CREATE TABLE "user_skill_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"skill_id" integer NOT NULL,
	"status" "skill_status" DEFAULT 'locked' NOT NULL,
	"mastery" real DEFAULT 0 NOT NULL,
	"unlocked_at" timestamp,
	"mastered_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_skill_progress_unique" UNIQUE("user_id","skill_id")
);
--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "mode" "lesson_mode" DEFAULT 'legacy_quiz' NOT NULL;--> statement-breakpoint
ALTER TABLE "concepts" ADD CONSTRAINT "concepts_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_blocks" ADD CONSTRAINT "lesson_blocks_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_skills" ADD CONSTRAINT "lesson_skills_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_skills" ADD CONSTRAINT "lesson_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_sessions" ADD CONSTRAINT "placement_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_sessions" ADD CONSTRAINT "placement_sessions_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_concepts" ADD CONSTRAINT "question_concepts_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_concepts" ADD CONSTRAINT "question_concepts_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_concepts" ADD CONSTRAINT "skill_concepts_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_concepts" ADD CONSTRAINT "skill_concepts_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_prerequisites" ADD CONSTRAINT "skill_prerequisites_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_prerequisites" ADD CONSTRAINT "skill_prerequisites_prerequisite_skill_id_skills_id_fk" FOREIGN KEY ("prerequisite_skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_concept_progress" ADD CONSTRAINT "user_concept_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_concept_progress" ADD CONSTRAINT "user_concept_progress_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skill_progress" ADD CONSTRAINT "user_skill_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skill_progress" ADD CONSTRAINT "user_skill_progress_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "concepts_language_code_idx" ON "concepts" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "concepts_type_idx" ON "concepts" USING btree ("type");--> statement-breakpoint
CREATE INDEX "lesson_blocks_lesson_id_idx" ON "lesson_blocks" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_blocks_order_idx" ON "lesson_blocks" USING btree ("lesson_id","order");--> statement-breakpoint
CREATE INDEX "lesson_skills_lesson_id_idx" ON "lesson_skills" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_skills_skill_id_idx" ON "lesson_skills" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "placement_sessions_user_id_idx" ON "placement_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "placement_sessions_language_code_idx" ON "placement_sessions" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "question_concepts_question_id_idx" ON "question_concepts" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "question_concepts_concept_id_idx" ON "question_concepts" USING btree ("concept_id");--> statement-breakpoint
CREATE INDEX "skill_concepts_skill_id_idx" ON "skill_concepts" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "skill_concepts_concept_id_idx" ON "skill_concepts" USING btree ("concept_id");--> statement-breakpoint
CREATE INDEX "skill_prerequisites_skill_id_idx" ON "skill_prerequisites" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "skills_language_code_idx" ON "skills" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "skills_type_idx" ON "skills" USING btree ("type");--> statement-breakpoint
CREATE INDEX "user_concept_progress_user_id_idx" ON "user_concept_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_concept_progress_due_idx" ON "user_concept_progress" USING btree ("user_id","next_review_at");--> statement-breakpoint
CREATE INDEX "user_skill_progress_user_id_idx" ON "user_skill_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_skill_progress_skill_id_idx" ON "user_skill_progress" USING btree ("skill_id");