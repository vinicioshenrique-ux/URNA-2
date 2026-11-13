CREATE TABLE IF NOT EXISTS election_archives (
  id BIGSERIAL PRIMARY KEY,
  school_name TEXT NOT NULL DEFAULT '',
  election_title TEXT NOT NULL DEFAULT '',
  election_label TEXT NOT NULL DEFAULT '',
  election_date DATE,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_by TEXT NOT NULL DEFAULT 'admin',
  total_votes INTEGER NOT NULL DEFAULT 0,
  valid_votes INTEGER NOT NULL DEFAULT 0,
  blank_votes INTEGER NOT NULL DEFAULT 0,
  null_votes INTEGER NOT NULL DEFAULT 0,
  snapshot JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS election_archives_archived_at_idx ON election_archives(archived_at DESC);