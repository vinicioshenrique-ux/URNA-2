ALTER TABLE election_settings ALTER COLUMN urna_sound_enabled SET DEFAULT true;
UPDATE election_settings SET urna_sound_enabled = true;