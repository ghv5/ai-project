CREATE TABLE IF NOT EXISTS portal_home_content (
  id BIGINT PRIMARY KEY,
  hero_title VARCHAR(255) NOT NULL,
  hero_subtitle VARCHAR(500) NOT NULL,
  flow_steps_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  stats_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  services_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  news_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  version INT NOT NULL DEFAULT 1,
  update_by BIGINT,
  update_time TIMESTAMP,
  del_flag CHAR(1) NOT NULL DEFAULT '0'
);

ALTER TABLE portal_home_content
  ADD COLUMN IF NOT EXISTS hero_title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS hero_subtitle VARCHAR(500),
  ADD COLUMN IF NOT EXISTS flow_steps_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS stats_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS services_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS news_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS update_by BIGINT,
  ADD COLUMN IF NOT EXISTS update_time TIMESTAMP,
  ADD COLUMN IF NOT EXISTS del_flag CHAR(1) NOT NULL DEFAULT '0';

CREATE TABLE IF NOT EXISTS portal_case (
  case_id BIGINT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_url VARCHAR(500),
  video_url VARCHAR(500),
  tags VARCHAR(500),
  industry VARCHAR(100),
  scenario VARCHAR(100),
  sort_order INT DEFAULT 999,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  publish_time TIMESTAMP,
  update_time TIMESTAMP,
  create_by BIGINT,
  update_by BIGINT,
  del_flag CHAR(1) NOT NULL DEFAULT '0'
);

ALTER TABLE portal_case
  ADD COLUMN IF NOT EXISTS title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS cover_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS video_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS tags VARCHAR(500),
  ADD COLUMN IF NOT EXISTS industry VARCHAR(100),
  ADD COLUMN IF NOT EXISTS scenario VARCHAR(100),
  ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 999,
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS pinned BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS publish_time TIMESTAMP,
  ADD COLUMN IF NOT EXISTS update_time TIMESTAMP,
  ADD COLUMN IF NOT EXISTS create_by BIGINT,
  ADD COLUMN IF NOT EXISTS update_by BIGINT,
  ADD COLUMN IF NOT EXISTS del_flag CHAR(1) NOT NULL DEFAULT '0';

CREATE INDEX IF NOT EXISTS idx_portal_case_published_pinned_sort
  ON portal_case(published, pinned, sort_order);

CREATE INDEX IF NOT EXISTS idx_portal_case_update_time
  ON portal_case(update_time DESC);

CREATE TABLE IF NOT EXISTS portal_user_mapping (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  annotate_account VARCHAR(100),
  simulate_account VARCHAR(100),
  update_by BIGINT,
  update_time TIMESTAMP,
  del_flag CHAR(1) NOT NULL DEFAULT '0'
);

ALTER TABLE portal_home_content
  ADD COLUMN IF NOT EXISTS update_by BIGINT,
  ADD COLUMN IF NOT EXISTS update_time TIMESTAMP;

ALTER TABLE portal_user_mapping
  ADD COLUMN IF NOT EXISTS user_id BIGINT,
  ADD COLUMN IF NOT EXISTS annotate_account VARCHAR(100),
  ADD COLUMN IF NOT EXISTS simulate_account VARCHAR(100),
  ADD COLUMN IF NOT EXISTS update_by BIGINT,
  ADD COLUMN IF NOT EXISTS update_time TIMESTAMP,
  ADD COLUMN IF NOT EXISTS del_flag CHAR(1) NOT NULL DEFAULT '0';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'portal_home_content'
      AND column_name = 'updated_by'
  ) THEN
    UPDATE portal_home_content
    SET update_by = COALESCE(update_by, updated_by)
    WHERE update_by IS NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'portal_home_content'
      AND column_name = 'updated_at'
  ) THEN
    UPDATE portal_home_content
    SET update_time = COALESCE(update_time, updated_at)
    WHERE update_time IS NULL;
  END IF;
END $$;

ALTER TABLE portal_home_content
  DROP COLUMN IF EXISTS updated_by,
  DROP COLUMN IF EXISTS updated_at;

ALTER TABLE portal_user_mapping
  ADD COLUMN IF NOT EXISTS update_by BIGINT,
  ADD COLUMN IF NOT EXISTS update_time TIMESTAMP;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'portal_user_mapping'
      AND column_name = 'updated_by'
  ) THEN
    UPDATE portal_user_mapping
    SET update_by = COALESCE(update_by, updated_by)
    WHERE update_by IS NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'portal_user_mapping'
      AND column_name = 'updated_at'
  ) THEN
    UPDATE portal_user_mapping
    SET update_time = COALESCE(update_time, updated_at)
    WHERE update_time IS NULL;
  END IF;
END $$;

ALTER TABLE portal_user_mapping
  DROP COLUMN IF EXISTS updated_by,
  DROP COLUMN IF EXISTS updated_at;

DROP INDEX IF EXISTS uk_portal_user_mapping_user_id;

CREATE UNIQUE INDEX IF NOT EXISTS uk_portal_user_mapping_user_id
  ON portal_user_mapping(user_id)
  WHERE del_flag = '0';
