import { db } from 'hatchable';
export const access='admin';
export const methods=['GET','POST'];
export default async function(req,res){
 const actor=req.member?.email||req.member?.handle||'admin';
 if(req.method==='GET'){
  const r=await db.query("SELECT id,school_name,election_title,election_label,election_date,archived_at,archived_by,total_votes,valid_votes,blank_votes,null_votes FROM election_archives ORDER BY archived_at DESC");
  res.json({archives:r.rows});return;
 }
 const b=req.body||{};
 if(b.action==='get_archive'){
  const id=Number(b.id);if(!id)return res.status(400).json({error:'Arquivo inválido.'});
  const r=await db.query('SELECT snapshot FROM election_archives WHERE id=$1',[id]);
  if(!r.rows.length)return res.status(404).json({error:'Eleição arquivada não encontrada.'});
  res.json({snapshot:r.rows[0].snapshot});return;
 }
 if(b.action!=='archive_and_reset')return res.status(400).json({error:'Ação inválida.'});
 const setting=await db.query('SELECT * FROM election_settings ORDER BY id LIMIT 1');
 if(!setting.rows.length)return res.status(400).json({error:'Configure a eleição antes de arquivar.'});
 if(setting.rows[0].active)return res.status(400).json({error:'Encerre a votação antes de arquivar.'});
 const settings=setting.rows[0];
 const counts=await db.query("SELECT COUNT(*)::int AS total,COUNT(*) FILTER(WHERE vote_type='candidate')::int AS valid,COUNT(*) FILTER(WHERE vote_type='blank')::int AS blank,COUNT(*) FILTER(WHERE vote_type='null')::int AS null_votes FROM votes");
 const candidates=await db.query('SELECT id,name,number,slogan,description,logo_url,votes,created_at,updated_at FROM candidates ORDER BY number');
 const voters=await db.query('SELECT id,code,name,class_name,voted,voted_at,created_at,requires_code,active FROM voters ORDER BY class_name,name');
 const guests=await db.query('SELECT id,code,name,class_name,voted,voted_at,created_at,active FROM guest_voters ORDER BY id');
 const classes=await db.query('SELECT id,class_name,school_stage,voting_mode,created_at FROM school_classes ORDER BY class_name');
 const urnas=await db.query('SELECT id,name,activation_code,active,registered_at,created_at FROM urnas ORDER BY id');
 // Mantém o voto secreto: os registros arquivados não associam a escolha ao ID do eleitor.
 const votes=await db.query('SELECT id,candidate_id,vote_type,created_at,urna_id,class_name FROM votes ORDER BY id');
 const audit=await db.query('SELECT id,action,details,actor,created_at,voter_code,voter_name,vote_label,vote_number,vote_at,urna_id FROM audit_log ORDER BY id');
 const snapshot={settings,candidates:candidates.rows,voters:voters.rows,guest_voters:guests.rows,classes:classes.rows,urnas:urnas.rows,votes:votes.rows,audit:audit.rows,totals:counts.rows[0]||{total:0,valid:0,blank:0,null_votes:0},archived_at:new Date().toISOString()};
 const t=snapshot.totals;
 const saved=await db.query('INSERT INTO election_archives (school_name,election_title,election_label,election_date,archived_by,total_votes,valid_votes,blank_votes,null_votes,snapshot) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb) RETURNING id',[settings.school_name,settings.election_title,settings.election_label,settings.election_date,actor,Number(t.total||0),Number(t.valid||0),Number(t.blank||0),Number(t.null_votes||0),JSON.stringify(snapshot)]);
 // Só limpa os dados operacionais depois de o arquivo completo ter sido salvo com sucesso.
 await db.query('DELETE FROM votes');
 await db.query('DELETE FROM anonymous_voting_sessions');
 await db.query('UPDATE candidates SET votes=0,updated_at=now()');
 await db.query('UPDATE voters SET voted=false,voted_at=NULL,session_token=NULL');
 await db.query('UPDATE guest_voters SET voted=false,voted_at=NULL,session_token=NULL');
 await db.query('DELETE FROM candidates');
 await db.query("UPDATE election_settings SET active=false,demo_mode=false,active_class_name='',election_date=CURRENT_DATE,updated_at=now() WHERE id=$1",[settings.id]);
 await db.query('INSERT INTO audit_log (action,details,actor) VALUES ($1,$2,$3)',['election_archived','Eleição arquivada como registro #'+saved.rows[0].id+'; nova votação preparada sem apagar cadastros de eleitores, turmas ou urnas.',actor]);
 res.json({ok:true,archive_id:saved.rows[0].id,message:'Eleição arquivada. Os votos e as chapas da votação atual foram reiniciados; cadastros de eleitores, turmas e urnas foram mantidos.'});return;
}