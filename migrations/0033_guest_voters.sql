CREATE TABLE guest_voters (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  class_name TEXT NOT NULL DEFAULT 'SALA SEM CADASTRO',
  voted BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  session_token TEXT NULL,
  voted_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX guest_voters_session_token_idx ON guest_voters(session_token);
ALTER TABLE votes ADD COLUMN guest_voter_id BIGINT NULL REFERENCES guest_voters(id);