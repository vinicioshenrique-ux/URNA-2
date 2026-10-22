import { db } from 'hatchable';
export const access='admin'; export const methods=['GET'];
export default async function(req,res){
 const candidates=await db.query('SELECT id,name,number,votes FROM candidates ORDER BY votes DESC,number');
 const totals=await db.query("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE vote_type='blank')::int AS blank, COUNT(*) FILTER (WHERE vote_type='null')::int AS null_votes, COUNT(*) FILTER (WHERE vote_type='candidate')::int AS valid FROM votes");
 const urnas=await db.query("SELECT u.id,u.name,COUNT(v.id)::int AS total,COUNT(v.id) FILTER (WHERE v.vote_type='candidate')::int AS valid,COUNT(v.id) FILTER (WHERE v.vote_type='blank')::int AS blank,COUNT(v.id) FILTER (WHERE v.vote_type='null')::int AS null_votes FROM urnas u LEFT JOIN votes v ON v.urna_id=u.id GROUP BY u.id ORDER BY u.id");
 const byUrna=await db.query("SELECT v.urna_id,c.id AS candidate_id,c.name,c.number,COUNT(*)::int AS votes FROM votes v JOIN candidates c ON c.id=v.candidate_id WHERE v.vote_type='candidate' GROUP BY v.urna_id,c.id,c.name,c.number ORDER BY v.urna_id,votes DESC,c.number");
 const records=await db.query("SELECT v.id,v.urna_id,u.name AS urna_name,v.vote_type,v.created_at,vo.code AS voter_code,vo.name AS voter_name,vo.class_name,c.number AS candidate_number,c.name AS candidate_name FROM votes v LEFT JOIN urnas u ON u.id=v.urna_id LEFT JOIN voters vo ON vo.id=v.voter_id LEFT JOIN candidates c ON c.id=v.candidate_id ORDER BY v.id DESC");
 res.json({candidates:candidates.rows,totals:totals.rows[0],urnas:urnas.rows,urna_candidates:byUrna.rows,vote_records:records.rows});
}