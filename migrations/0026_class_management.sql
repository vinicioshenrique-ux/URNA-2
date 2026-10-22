CREATE TABLE IF NOT EXISTS school_classes (
  id BIGSERIAL PRIMARY KEY,
  class_name TEXT NOT NULL UNIQUE,
  school_stage TEXT NOT NULL DEFAULT 'Anos Finais',
  voting_mode TEXT NOT NULL DEFAULT 'ra' CHECK (voting_mode IN ('ra','anonymous')),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
ALTER TABLE election_settings ADD COLUMN IF NOT EXISTS active_class_name TEXT NOT NULL DEFAULT '';
ALTER TABLE votes ADD COLUMN IF NOT EXISTS class_name TEXT NOT NULL DEFAULT '';
ALTER TABLE anonymous_voting_sessions ADD COLUMN IF NOT EXISTS class_name TEXT NOT NULL DEFAULT '';
INSERT INTO school_classes (class_name,school_stage,voting_mode)
SELECT DISTINCT trim(class_name),
  CASE
    WHEN lower(trim(class_name)) ~ '^(1|2|3|4|5)[º°]?\s*(ano|a|b|c|d|e|f)?' THEN 'Anos Iniciais'
    WHEN lower(trim(class_name)) ~ '^(1ª|2ª|3ª|1a|2a|3a|1º médio|2º médio|3º médio)' THEN 'Ensino Médio'
    ELSE 'Anos Finais'
  END,
  'ra'
FROM voters
WHERE class_name IS NOT NULL AND trim(class_name) <> ''
ON CONFLICT (class_name) DO NOTHING;