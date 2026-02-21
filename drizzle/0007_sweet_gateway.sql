CREATE TYPE "public"."challenge_type" AS ENUM('xp_goal', 'correct_answers', 'lessons_completed', 'perfect_lessons', 'review_sessions');--> statement-breakpoint
CREATE TYPE "public"."friendship_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TABLE "friendships" (
	"id" serial PRIMARY KEY NOT NULL,
	"requester_id" integer NOT NULL,
	"addressee_id" integer NOT NULL,
	"status" "friendship_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "friendships_pair_unique" UNIQUE("requester_id","addressee_id")
);
--> statement-breakpoint
CREATE TABLE "shop_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(50) NOT NULL,
	"title_en" varchar(200) NOT NULL,
	"title_de" varchar(200) NOT NULL,
	"description_en" text,
	"description_de" text,
	"cost_gems" integer NOT NULL,
	"effect_type" varchar(50) NOT NULL,
	"effect_value" integer DEFAULT 1 NOT NULL,
	"icon_url" varchar(500),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shop_items_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "user_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"challenge_id" integer NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp,
	"xp_awarded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_challenges_unique" UNIQUE("user_id","challenge_id")
);
--> statement-breakpoint
CREATE TABLE "user_purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"purchased_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "challenge_type" NOT NULL,
	"target_value" integer NOT NULL,
	"xp_reward" integer NOT NULL,
	"title_en" varchar(200) NOT NULL,
	"title_de" varchar(200) NOT NULL,
	"description_en" text,
	"description_de" text,
	"week_start" timestamp NOT NULL,
	"week_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "daily_xp_goal" integer DEFAULT 20 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "sound_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "gems" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "level" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "perfect_lessons" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_addressee_id_users_id_fk" FOREIGN KEY ("addressee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_challenge_id_weekly_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."weekly_challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_purchases" ADD CONSTRAINT "user_purchases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_purchases" ADD CONSTRAINT "user_purchases_item_id_shop_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."shop_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "friendships_requester_id_idx" ON "friendships" USING btree ("requester_id");--> statement-breakpoint
CREATE INDEX "friendships_addressee_id_idx" ON "friendships" USING btree ("addressee_id");--> statement-breakpoint
CREATE INDEX "user_challenges_user_id_idx" ON "user_challenges" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_challenges_challenge_id_idx" ON "user_challenges" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX "user_purchases_user_id_idx" ON "user_purchases" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_purchases_item_id_idx" ON "user_purchases" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "weekly_challenges_week_idx" ON "weekly_challenges" USING btree ("week_start","week_end");