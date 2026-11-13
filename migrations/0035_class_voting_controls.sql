CREATE TABLE IF NOT EXISTS class_voting_controls (
  class_name text PRIMARY KEY,
  is_open boolean NOT NULL DEFAULT false,
  opened_at timestamptz,
  closed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);