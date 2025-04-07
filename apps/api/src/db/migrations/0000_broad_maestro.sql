CREATE TABLE "llms_txts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"repo_url" text NOT NULL,
	"llmstxt" text NOT NULL,
	"max_urls" integer DEFAULT 1,
	"llmstxt_full" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
