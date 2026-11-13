import { db } from 'hatchable';
export const access='public'; export const methods=['GET'];
export default async function(req,res){
 const s=await db.query('SELECT school_name,election_label,election_title,election_date,active,primary_color,secondary_color,logo_url FROM election_settings ORDER BY id LIMIT 1');
 const v=await db.query('SELECT COUNT(*)::int AS total FROM voters');
 const t=await db.query('SELECT COUNT(*)::int AS total FROM votes');
 const u=await db.query("SELECT u.id,u.name,u.active,u.device_token IS NOT NULL AS registered,u.last_seen_at FROM urnas u ORDER BY u.id");
 const a=await db.query("SELECT a.created_at,a.urna_id,u.name AS urna_name FROM audit_log a LEFT JOIN urnas u ON u.id=a.urna_id WHERE a.action='vote_registered' ORDER BY a.id DESC LIMIT 12");
 const queue=await db.query("SELECT voter_name,class_name,urna_name,status,created_at FROM (SELECT v.name AS voter_name,v.class_name,u.name AS urna_name,q.status,q.created_at FROM mesario_queue q JOIN voters v ON v.id=q.voter_id LEFT JOIN urnas u ON u.id=q.urna_id WHERE q.status IN ('waiting','claimed') AND q.created_at>now()-interval '12 hours' AND v.active=true AND v.voted=false UNION ALL SELECT v.name AS voter_name,v.class_name,u.name AS urna_name,'waiting'::text AS status,w.created_at FROM mesario_waitlist w JOIN voters v ON v.id=w.voter_id LEFT JOIN urnas u ON u.id=w.urna_id WHERE w.status IN ('waiting','assigned') AND w.created_at>now()-interval '12 hours' AND v.active=true AND v.voted=false AND NOT EXISTS (SELECT 1 FROM mesario_queue q WHERE q.voter_id=w.voter_id AND q.status IN ('waiting','claimed'))) current_queue ORDER BY created_at ASC LIMIT 100");
 const reveal=await db.query("SELECT action FROM audit_log WHERE action IN ('results_revealed','results_hidden') ORDER BY id DESC LIMIT 1");
 const resultsRevealed=reveal.rows[0]?.action==='results_revealed';
 let resultCandidates=[],resultTotals=null;
 if(resultsRevealed){const c=await db.query('SELECT id,name,number,votes,logo_url FROM candidates ORDER BY number');const totals=await db.query("SELECT COUNT(*)::int AS total,COUNT(*) FILTER (WHERE vote_type='candidate')::int AS valid,COUNT(*) FILTER (WHERE vote_type='blank')::int AS blank,COUNT(*) FILTER (WHERE vote_type='null')::int AS null_votes FROM votes");resultCandidates=c.rows;resultTotals=totals.rows[0]||{};}
 res.json({settings:s.rows[0]||null,voters:v.rows[0]||{},total_votes:t.rows[0]?.total||0,urnas:u.rows,audit:a.rows,queue:queue.rows,results_revealed:resultsRevealed,result_candidates:resultCandidates,result_totals:resultTotals});
}