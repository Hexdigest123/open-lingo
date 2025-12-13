CREATE TYPE "public"."leaderboard_timeframe" AS ENUM('daily', 'weekly', 'monthly', 'all_time');--> statement-breakpoint
CREATE TYPE "public"."lesson_type" AS ENUM('fill_in_blank', 'multiple_choice', 'vocabulary', 'voice_answer');--> statement-breakpoint
CREATE TYPE "public"."level_code" AS ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2');--> statement-breakpoint
CREATE TYPE "public"."progress_status" AS ENUM('not_started', 'in_progress', 'completed', 'mastered', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('fill_blank', 'multiple_choice', 'translation', 'matching', 'speaking', 'listening');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"icon_url" varchar(500),
	"criteria" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_streaks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"activity_date" timestamp NOT NULL,
	"xp_earned" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "daily_streaks_unique" UNIQUE("user_id","activity_date")
);
--> statement-breakpoint
CREATE TABLE "leaderboard_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"timeframe" "leaderboard_timeframe" NOT NULL,
	"rank" integer NOT NULL,
	"xp" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leaderboard_cache_unique" UNIQUE("user_id","timeframe")
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"unit_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"type" "lesson_type" NOT NULL,
	"xp_reward" integer DEFAULT 10 NOT NULL,
	"order" integer NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"is_exam" boolean DEFAULT false NOT NULL,
	"exam_pass_threshold" integer DEFAULT 80,
	"required_lesson_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" "level_code" NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	CONSTRAINT "levels_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"type" "question_type" NOT NULL,
	"content" jsonb NOT NULL,
	"correct_answer" text NOT NULL,
	"audio_url" varchar(500),
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" serial PRIMARY KEY NOT NULL,
	"level_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"theme_color" varchar(7)
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"achievement_id" integer NOT NULL,
	"earned_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_achievements_unique" UNIQUE("user_id","achievement_id")
);
--> statement-breakpoint
CREATE TABLE "user_lesson_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"lesson_id" integer NOT NULL,
	"status" "progress_status" DEFAULT 'not_started' NOT NULL,
	"score" integer,
	"attempts" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_lesson_progress_unique" UNIQUE("user_id","lesson_id")
);
--> statement-breakpoint
CREATE TABLE "user_question_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"answer" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"ai_feedback" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"hearts" integer DEFAULT 5 NOT NULL,
	"hearts_last_refilled" timestamp DEFAULT now() NOT NULL,
	"xp_total" integer DEFAULT 0 NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"last_activity" timestamp,
	"streak_freezes" integer DEFAULT 0 NOT NULL,
	"freezes_earned_total" integer DEFAULT 0 NOT NULL,
	"total_correct_answers" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_stats_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"avatar_url" varchar(500),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"openai_api_key_encrypted" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "daily_streaks" ADD CONSTRAINT "daily_streaks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_cache" ADD CONSTRAINT "leaderboard_cache_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_question_attempts" ADD CONSTRAINT "user_question_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_question_attempts" ADD CONSTRAINT "user_question_attempts_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "daily_streaks_user_id_idx" ON "daily_streaks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "leaderboard_cache_timeframe_rank_idx" ON "leaderboard_cache" USING btree ("timeframe","rank");--> statement-breakpoint
CREATE INDEX "lessons_unit_id_idx" ON "lessons" USING btree ("unit_id");--> statement-breakpoint
CREATE INDEX "questions_lesson_id_idx" ON "questions" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "units_level_id_idx" ON "units" USING btree ("level_id");--> statement-breakpoint
CREATE INDEX "user_achievements_user_id_idx" ON "user_achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_lesson_progress_user_id_idx" ON "user_lesson_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_lesson_progress_lesson_id_idx" ON "user_lesson_progress" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "user_question_attempts_user_id_idx" ON "user_question_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_question_attempts_question_id_idx" ON "user_question_attempts" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "user_stats_user_id_idx" ON "user_stats" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");