const CACHE='urna-digital-v1';
const CORE=['/','/urna2.css','/urna.css','/logo-escola.svg','/manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  const u=new URL(event.request.url);
  if(u.origin!==location.origin || event.request.method!=='GET')return;
  event.respondWith(fetch(event.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return r}).catch(()=>caches.match(event.request).then(r=>r||caches.match('/'))));
});