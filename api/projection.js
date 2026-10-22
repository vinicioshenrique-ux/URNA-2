import { db } from 'hatchable';
export const access='public'; export const methods=['GET'];
export default async function(req,res){
 const s=await db.query('SELECT school_name,election_label,election_title,election_date,active,primary_color,secondary_color,logo_url FROM election_settings ORDER BY id LIMIT 1');
 const v=await db.query('SELECT COUNT(*)::int AS total,COUNT(*) FILTER (WHERE voted)::int AS voted FROM voters');
 const t=await db.query('SELECT COUNT(*)::int AS total FROM votes');
 const u=await db.query("SELECT u.id,u.name,u.active,u.device_token IS NOT NULL AS registered,u.last_seen_at FROM urnas u ORDER BY u.id");
 const a=await db.query("SELECT a.created_at,a.urna_id,u.name AS urna_name FROM audit_log a LEFT JOIN urnas u ON u.id=a.urna_id WHERE a.action='vote_registered' ORDER BY a.id DESC LIMIT 12");
 res.json({settings:s.rows[0]||null,voters:v.rows[0]||{},total_votes:t.rows[0]?.total||0,urnas:u.rows,audit:a.rows});
}