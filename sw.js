// Guarda a página no aparelho para abrir sem internet. Com rede, usa sempre a versão mais recente.
const V='carteira-v2';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{
    if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(u.pathname.endsWith('/')?'./':u.pathname.split('/').pop()||'./',cp)).catch(()=>{})}
    return res;
  }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
});
