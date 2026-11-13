import {db} from 'hatchable';
export const access='admin';
export const methods=['POST'];
export default async function(req,res){
 const b=req.body||{},a=b.action||'';
 try{
 if(a==='adm_overview'){
  const accounts=await db.query('SELECT id,full_name,username,active FROM mesario_accounts ORDER BY full_name');
  const urnas=await db.query("SELECT u.id,u.name,u.active,u.last_seen_at,(u.last_seen_at>now()-interval '90 seconds') AS online,q.id AS queue_id,q.status AS queue_status,v.id AS voter_id,v.name AS voter_name,v.code AS voter_code,v.class_name FROM urnas u LEFT JOIN LATERAL (SELECT q.* FROM mesario_queue q WHERE q.urna_id=u.id AND q.status IN ('waiting','claimed') ORDER BY CASE q.status WHEN 'claimed' THEN 0 ELSE 1 END,q.id DESC LIMIT 1) q ON true LEFT JOIN voters v ON v.id=q.voter_id ORDER BY u.name");
  const waiting=await db.query("SELECT w.id,w.status,w.created_at,w.assigned_at,v.id AS voter_id,v.name AS voter_name,v.code AS voter_code,v.class_name,u.name AS urna_name FROM mesario_waitlist w JOIN voters v ON v.id=w.voter_id LEFT JOIN urnas u ON u.id=w.urna_id WHERE w.status='waiting' AND v.active=true AND v.voted=false ORDER BY w.id LIMIT 100");
  const search=String(b.search||'').trim().slice(0,120);let students=[];
  if(search){const found=await db.query("SELECT v.id,v.name,v.code,v.class_name,v.active,v.voted,q.id AS queue_id,q.status AS queue_status,u.name AS urna_name,w.status AS waitlist_status FROM voters v LEFT JOIN LATERAL (SELECT q.* FROM mesario_queue q WHERE q.voter_id=v.id AND q.status IN ('waiting','claimed') ORDER BY q.id DESC LIMIT 1) q ON true LEFT JOIN urnas u ON u.id=q.urna_id LEFT JOIN LATERAL (SELECT w.status,w.urna_id FROM mesario_waitlist w WHERE w.voter_id=v.id AND w.status IN ('waiting','assigned') ORDER BY w.id DESC LIMIT 1) w ON true WHERE v.name ILIKE '%'||$1||'%' OR v.code ILIKE '%'||$1||'%' ORDER BY v.name LIMIT 40",[search]);students=found.rows;}
  return res.json({accounts:accounts.rows,urnas:urnas.rows,waiting:waiting.rows,students});
 }
 if(a==='adm_audit'){
  const accountId=Number(b.account_id)||0;const params=[];let where="(mesario_account_id IS NOT NULL OR actor ILIKE 'Mesário%' OR actor='mesario')";
  if(accountId){params.push(accountId);where='mesario_account_id=$1';}
  const r=await db.query("SELECT a.id,a.action,a.details,a.actor,a.created_at,a.voter_code,a.voter_name,a.urna_id,u.name AS urna_name,a.mesario_account_id FROM audit_log a LEFT JOIN urnas u ON u.id=a.urna_id WHERE "+where+" ORDER BY a.id DESC LIMIT 300",params);
  return res.json({items:r.rows});
 }
 return res.status(400).json({error:'Ação desconhecida.'});
 }catch(e){console.error('mesario-admin',e.message);return res.status(500).json({error:'Não foi possível carregar os dados administrativos dos mesários.'});}
}