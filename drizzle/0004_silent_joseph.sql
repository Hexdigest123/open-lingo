ALTER TABLE "api_usage_logs" ALTER COLUMN "session_id" SET DATA TYPE uuid USING session_id::uuid;--> statement-breakpoint
ALTER TABLE "chat_messages" ALTER COLUMN "session_id" SET DATA TYPE uuid USING session_id::uuid;--> statement-breakpoint
ALTER TABLE "chat_sessions" ALTER COLUMN "id" SET DATA TYPE uuid USING id::uuid;--> statement-breakpoint
ALTER TABLE "chat_sessions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "title_de";--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "description_de";