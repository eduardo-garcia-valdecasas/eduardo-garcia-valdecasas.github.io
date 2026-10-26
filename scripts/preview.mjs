import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.argv[2]??'dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.json':'application/json','.bib':'text/plain; charset=utf-8','.xml':'application/xml','.txt':'text/plain'};
const server=http.createServer(async(req,res)=>{
 try{
  let relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '');
  if(!relative||relative.endsWith('/'))relative+='index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  const content=await fs.readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream','Cache-Control':'no-store'});res.end(content);
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Not found');}
});
server.listen(4321,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4321'));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
