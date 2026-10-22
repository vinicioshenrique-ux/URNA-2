CREATE TABLE votes (
  id BIGSERIAL PRIMARY KEY,
  candidate_id BIGINT REFERENCES candidates(id),
  vote_type TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
)