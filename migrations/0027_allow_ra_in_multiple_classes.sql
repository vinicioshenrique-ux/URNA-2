ALTER TABLE voters DROP CONSTRAINT IF EXISTS voters_code_key;
CREATE UNIQUE INDEX IF NOT EXISTS voters_code_class_unique
ON voters (code, class_name)
WHERE code IS NOT NULL AND code <> '';