UPDATE school_classes
SET school_stage = 'Ensino Médio'
WHERE lower(trim(class_name)) ~ '^(1ª|2ª|3ª|1a|2a|3a)[[:space:]]*sér';