'use strict';
// Servidor estático local. Sin dependencias, API, telemetría ni acceso a servicios externos.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const port = Number(process.env.CLIPA_PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8'};
const server = http.createServer((req,res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405);res.end();return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400);res.end('Solicitud inválida');return; }
  const target=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if (!target.startsWith(root+path.sep) || !types[path.extname(target)]) {res.writeHead(404);res.end('No encontrado');return;}
  fs.stat(target,(err,stat)=>{
    if(err||!stat.isFile()){res.writeHead(404);res.end('No encontrado');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(target)],'Content-Length':stat.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});
    if(req.method==='HEAD'){res.end();return;}
    const stream=fs.createReadStream(target);stream.on('error',()=>res.destroy());stream.pipe(res);
  });
});
server.listen(port,'127.0.0.1',()=>console.log(`Clipa está lista: http://127.0.0.1:${port}\nSolo en este equipo. Pulsa Ctrl+C para detener.`));
server.on('error',err=>{console.error(err.code==='EADDRINUSE'?`El puerto ${port} ya está en uso. Abre http://127.0.0.1:${port} si Clipa ya está iniciada.`:err.message);process.exitCode=1;});
