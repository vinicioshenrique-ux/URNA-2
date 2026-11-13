-- Unifica o estado legado do ADM com o controle compartilhado por turma.
UPDATE class_voting_controls SET is_open=false,closed_at=COALESCE(closed_at,now()),updated_at=now();
INSERT INTO class_voting_controls(class_name,is_open,opened_at,closed_at,updated_at)
SELECT trim(room),true,now(),NULL,now()
FROM election_settings e
CROSS JOIN LATERAL unnest(string_to_array(COALESCE(e.active_class_name,''),'|')) AS room
JOIN school_classes c ON c.class_name=trim(room)
WHERE trim(room)<>'' AND trim(room)<>'__CLOSED__'
ON CONFLICT(class_name) DO UPDATE SET is_open=true,opened_at=now(),closed_at=NULL,updated_at=now();