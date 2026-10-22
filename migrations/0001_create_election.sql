CREATE TABLE election_settings (
  id BIGSERIAL PRIMARY KEY,
  school_name TEXT NOT NULL DEFAULT 'Minha Escola',
  election_title TEXT NOT NULL DEFAULT 'Eleição do Grêmio Estudantil',
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
)