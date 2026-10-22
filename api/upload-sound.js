import { storage } from 'hatchable';
export const access='admin'; export const methods=['POST'];
export default async function(req,res){
 const file=req.files?.[0];
 if(!file)return res.status(400).json({error:'Nenhum arquivo enviado.'});
 const type=String(file.contentType||'').toLowerCase();
 if(!type.startsWith('audio/'))return res.status(400).json({error:'Envie um arquivo de áudio.'});
 if(file.buffer?.length>10*1024*1024)return res.status(400).json({error:'O áudio deve ter no máximo 10 MB.'});
 const safe=String(file.filename||'som-urna').replace(/[^a-zA-Z0-9._-]/g,'_');
 const key='urna-sounds/'+Date.now()+'-'+safe;
 await storage.put(key,file.buffer,file.contentType);
 res.json({ok:true,url:'/api/image?key='+encodeURIComponent(key),key,filename:safe,contentType:file.contentType});
}