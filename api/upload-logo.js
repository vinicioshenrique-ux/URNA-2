import { storage } from 'hatchable';
export const access='admin'; export const methods=['POST'];
export default async function(req,res){
 const file=req.files?.[0]; if(!file)return res.status(400).json({error:'Nenhum arquivo enviado.'});
 if(!String(file.contentType||'').startsWith('image/'))return res.status(400).json({error:'Envie uma imagem.'});
 const safe=String(file.filename||'logo').replace(/[^a-zA-Z0-9._-]/g,'_');
 const key='chapas/'+Date.now()+'-'+safe;
 await storage.put(key,file.buffer,file.contentType);
 const url='/api/image?key='+encodeURIComponent(key);
 res.json({ok:true,url,key});
}