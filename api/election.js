import { db } from 'hatchable';
export const access='admin'; export const methods=['GET'];
export default async function(req,res){const s=await db.query('SELECT * FROM election_settings ORDER BY id LIMIT 1');const c=await db.query('SELECT id,name,number,slogan,description,logo_url,votes FROM candidates ORDER BY number');res.json({settings:s.rows[0]||null,candidates:c.rows});}