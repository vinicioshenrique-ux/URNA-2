UPDATE school_classes
SET school_stage = CASE
  WHEN lower(trim(class_name)) ~ '^(1ª|2ª|3ª|1a|2a|3a)[[:space:]]*(série|serie)' THEN 'Ensino Médio'
  WHEN lower(trim(class_name)) ~ '^[1-5][º°]?[[:space:]]*ano' THEN 'Anos Iniciais'
  WHEN lower(trim(class_name)) ~ '^[6-9][º°]?[[:space:]]*ano' THEN 'Anos Finais'
  ELSE school_stage
END;