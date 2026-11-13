import {db} from 'hatchable';
export const access='public';export const methods=['GET'];
export default async function(req,res){try{
const s=await db.query("SELECT school_name,election_title,active,demo_mode FROM election_settings ORDER BY id LIMIT 1");
const c=await db.query("SELECT class_name,COUNT(*) FILTER(WHERE active=true)::int AS eligible,COUNT(*) FILTER(WHERE active=true AND voted=true)::int AS voted FROM voters GROUP BY class_name ORDER BY class_name");
const u=await db.query("SELECT u.id,u.name,u.active,u.last_seen_at,q.status AS service FROM urnas u LEFT JOIN mesario_queue q ON q.urna_id=u.id AND q.status IN ('waiting','claimed') ORDER BY u.name");
const w=await db.query("SELECT w.id,w.status,u.name AS urna FROM mesario_waitlist w LEFT JOIN urnas u ON u.id=w.urna_id WHERE w.status IN ('waiting','assigned') ORDER BY w.id LIMIT 20");
res.setHeader('Cache-Control','no-store');res.json({settings:s.rows[0]||{},classes:c.rows,urnas:u.rows.map(x=>({id:x.id,name:x.name,status:!x.active?'inativa':!x.last_seen_at||Date.now()-new Date(x.last_seen_at).getTime()>60000?'desconectada':x.service?'ocupada':'livre'})),queue:w.rows.map(x=>({ticket:'S'+String(x.id).padStart(4,'0'),status:x.status,urna:x.urna||null}))});
}catch(e){console.error(e);res.status(500).json({error:'Não foi possível carregar o painel.'})}}