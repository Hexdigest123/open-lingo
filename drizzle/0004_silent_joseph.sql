-- Drop FK constraints before type changes
ALTER TABLE "api_usage_logs" DROP CONSTRAINT IF EXISTS "api_usage_logs_session_id_chat_sessions_id_fk";--> statement-breakpoint
ALTER TABLE "chat_messages" DROP CONSTRAINT IF EXISTS "chat_messages_session_id_chat_sessions_id_fk";--> statement-breakpoint
-- Change column types (USING gen_random_uuid() allows integer->uuid cast on empty tables)
ALTER TABLE "api_usage_logs" ALTER COLUMN "session_id" SET DATA TYPE uuid USING gen_random_uuid();--> statement-breakpoint
ALTER TABLE "chat_messages" ALTER COLUMN "session_id" SET DATA TYPE uuid USING gen_random_uuid();--> statement-breakpoint
ALTER TABLE "chat_sessions" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "chat_sessions" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();--> statement-breakpoint
ALTER TABLE "chat_sessions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
-- Re-add FK constraints with uuid types
ALTER TABLE "api_usage_logs" ADD CONSTRAINT "api_usage_logs_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "title_de";--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "description_de";