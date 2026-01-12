-- Additional tables for AI feedback loop

-- Keyword AI Insights
CREATE TABLE IF NOT EXISTS "KeywordInsights" (
  "id" TEXT PRIMARY KEY,
  "keyword_id" TEXT NOT NULL,
  "analysis" JSONB NOT NULL,
  "priority" TEXT,
  "recommendations" JSONB,
  "applied" BOOLEAN DEFAULT FALSE,
  "generated_at" TIMESTAMP NOT NULL,
  "applied_at" TIMESTAMP,
  FOREIGN KEY ("keyword_id") REFERENCES "KeywordOpportunity"("id") ON DELETE CASCADE
);

-- Lead AI Scoring History
CREATE TABLE IF NOT EXISTS "LeadScoringHistory" (
  "id" TEXT PRIMARY KEY,
  "lead_id" TEXT NOT NULL,
  "score" FLOAT NOT NULL,
  "score_breakdown" JSONB NOT NULL,
  "model_version" TEXT,
  "scored_at" TIMESTAMP NOT NULL,
  FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE CASCADE
);

-- AI Actions Log (what the AI decided to do)
CREATE TABLE IF NOT EXISTS "AIActionLog" (
  "id" TEXT PRIMARY KEY,
  "action_type" TEXT NOT NULL, -- content_generation, lead_outreach, campaign_creation
  "entity_id" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL, -- keyword, lead, campaign
  "decision_reasoning" JSONB,
  "status" TEXT DEFAULT 'pending', -- pending, completed, failed
  "executed_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Real-time Data Sync Queue
CREATE TABLE IF NOT EXISTS "SyncQueue" (
  "id" TEXT PRIMARY KEY,
  "table_name" TEXT NOT NULL,
  "operation" TEXT NOT NULL, -- insert, update, delete
  "data" JSONB NOT NULL,
  "status" TEXT DEFAULT 'pending',
  "retry_count" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "processed_at" TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_keyword_insights_applied ON "KeywordInsights"("applied");
CREATE INDEX IF NOT EXISTS idx_ai_actions_status ON "AIActionLog"("status");
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON "SyncQueue"("status");

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE "KeywordOpportunity";
ALTER PUBLICATION supabase_realtime ADD TABLE "Lead";
ALTER PUBLICATION supabase_realtime ADD TABLE "KeywordInsights";
ALTER PUBLICATION supabase_realtime ADD TABLE "AIActionLog";
