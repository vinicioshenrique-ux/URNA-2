import { db } from 'hatchable';
export const access='public';
export const methods=['GET'];
export default async function(req,res){
 const q=await db.query(`SELECT md5(
  COALESCE((SELECT string_agg(to_jsonb(e)::text,'|' ORDER BY e.id) FROM election_settings e),'') || '#' ||
  COALESCE((SELECT string_agg(to_jsonb(c)::text,'|' ORDER BY c.id) FROM candidates c),'') || '#' ||
  COALESCE((SELECT count(*)::text||':'||COALESCE(max(id),0)::text||':'||count(*) FILTER (WHERE voted)::text FROM voters),'') || '#' ||
  COALESCE((SELECT count(*)::text||':'||COALESCE(max(id),0)::text FROM votes),'') || '#' ||
  COALESCE((SELECT count(*)::text||':'||COALESCE(max(id),0)::text FROM audit_log),'') || '#' ||
  COALESCE((SELECT string_agg(to_jsonb(c)::text,'|' ORDER BY c.class_name) FROM school_classes c),'')
 ) AS version`);
 res.setHeader('Cache-Control','no-store, max-age=0');
 res.json({version:q.rows[0]?.version||''});
}