UPDATE school_classes
SET school_stage = CASE
  WHEN translate(upper(class_name), 'ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ', 'AAAAAEEEEIIIIOOOOOUUUUC') ~ '^[[:space:]]*[1-5].*ANO' THEN 'Anos Iniciais'
  WHEN translate(upper(class_name), 'ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ', 'AAAAAEEEEIIIIOOOOOUUUUC') ~ '^[[:space:]]*[6-9].*ANO' THEN 'Anos Finais'
  WHEN translate(upper(class_name), 'ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ', 'AAAAAEEEEIIIIOOOOOUUUUC') ~ '^[[:space:]]*[1-3].*SERIE' THEN 'Ensino Médio'
  ELSE school_stage
END
WHERE translate(upper(class_name), 'ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ', 'AAAAAEEEEIIIIOOOOOUUUUC') ~ '^[[:space:]]*[1-9].*(ANO|SERIE)';