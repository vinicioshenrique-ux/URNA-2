import { storage } from 'hatchable';
export const access='public'; export const methods=['GET'];
export default async function(req,res){
  const key=String(req.query?.key||'').trim();
  if(!key || key.includes('..') || key.startsWith('/')) return res.status(400).json({error:'Imagem inválida.'});
  try{
    const file=await storage.get(key);
    if(!file?.buffer)return res.status(404).json({error:'Imagem não encontrada.'});
    res.setHeader('Content-Type',file.contentType||'application/octet-stream');
    res.setHeader('Cache-Control','public, max-age=31536000, immutable');
    res.send(file.buffer);
  }catch(e){res.status(404).json({error:'Imagem não encontrada.'});}
}