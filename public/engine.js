(function (root) {
  'use strict';
  const DAY = 86400000;
  const CREATOR = 'sofia';
  const round = n => Math.round(Number(n));
  const fail = message => { throw new Error(message); };
  const id = prefix => prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  const clone = value => JSON.parse(JSON.stringify(value));
  function canonicalLink(raw) {
    let url;
    try { url = new URL(String(raw).trim()); } catch { fail('Pega un enlace completo de TikTok, Instagram Reels o YouTube Shorts.'); }
    if (url.protocol !== 'https:') fail('El enlace debe comenzar con https://.');
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    let match;
    if (host === 'tiktok.com' && (match = url.pathname.match(/^\/@([\w.-]+)\/video\/(\d+)\/?$/))) {
      return { key: 'tiktok:' + match[2], url: 'https://www.tiktok.com/@' + match[1] + '/video/' + match[2], platform: 'TikTok' };
    }
    if (host === 'instagram.com' && (match = url.pathname.match(/^\/reels?\/([\w-]+)\/?$/))) {
      return { key: 'instagram:' + match[1], url: 'https://www.instagram.com/reel/' + match[1] + '/', platform: 'Instagram' };
    }
    if ((host === 'youtube.com' || host === 'm.youtube.com') && (match = url.pathname.match(/^\/shorts\/([\w-]{11})\/?$/))) {
      return { key: 'youtube:' + match[1], url: 'https://www.youtube.com/shorts/' + match[1], platform: 'YouTube' };
    }
    fail('Usa la URL completa del video: tiktok.com/@usuario/video/…, instagram.com/reel/… o youtube.com/shorts/….');
  }
  function log(s, message, role = 'all') {
    s.events.unshift({ id: id('event'), at: s.now, message, role });
    s.events = s.events.slice(0, 100);
  }
  function settle(s) {
    s.entries.forEach(e => { if (e.status === 'held' && e.releaseAt <= s.now) e.status = 'available'; });
    s.campaigns.forEach(c => {
      if (c.status === 'depleted' && !s.entries.some(e => e.campaignId === c.id && ['held', 'frozen'].includes(e.status))) c.status = 'completed';
    });
    return s;
  }
  function seed() {
    const now = Date.parse('2026-10-28T17:00:00Z');
    const campaign = (cid, title, brand, category, theme, budget, cpm, spent, status = 'active') => ({
      id: cid, title, brand, category, theme, budget, cpm, spent, status, minViews: 1000, maxPerVideo: 25000,
      drive: 'https://drive.google.com/drive/folders/material-demo-' + cid,
      rules: 'Formato vertical 9:16, entre 15 y 45 segundos. Incluye subtítulos legibles y el hashtag #' + brand.replace(/\s/g, '') + '. Usa el material de la marca y música con permiso. Evita afirmaciones engañosas.',
      description: { coffee: 'Hay historias que empiezan con un buen café. Convierte nuestro ritual de cada mañana en un clip que se sienta auténtico.', sport: 'La ciudad es tu pista. Dale tu ritmo a nuestra nueva colección y crea historias que inviten a moverse.', travel: 'Escapadas que merecen salir del carrete. Crea un pequeño viaje con nuestras mejores experiencias.', music: 'Nuevas voces, grandes momentos. Lleva la energía de nuestra próxima sesión a tu comunidad.' }[theme],
      createdAt: now - 7 * DAY, received: status === 'active' ? budget : 0, reference: 'CLP-' + cid.toUpperCase()
    });
    const s = { version: 1, now, creator: { id: CREATOR, name: 'Sofía Torres', handle: '@sofiacrea', strikes: 0, method: 'Nequi', account: '300 000 0000 (ficticio)' },
      campaigns: [
        campaign('alt', 'El café también cuenta historias.', 'Altura', 'Gastronomía', 'coffee', 150000, 250, 18000),
        campaign('run', 'Tu ciudad. Tu siguiente paso.', 'Pace', 'Lifestyle', 'sport', 240000, 200, 6400),
        campaign('via', 'Lo mejor del viaje está por contar.', 'Ladera', 'Viajes', 'travel', 300000, 350, 0),
        campaign('mus', 'Haz que todos suban el volumen.', 'Frecuencia', 'Música', 'music', 120000, 180, 0),
        campaign('new', 'Una nueva forma de empezar.', 'Altura', 'Gastronomía', 'coffee', 100000, 300, 0, 'awaiting'),
        campaign('draft', 'Cada ruta tiene una historia.', 'Pace', 'Lifestyle', 'sport', 80000, 220, 0, 'draft')
      ], submissions: [], entries: [], payouts: [], events: [] };
    const sub = (sid, campaignId, views, amount, status, days, platform, creatorId = CREATOR) => ({ id: sid, campaignId, creatorId, creatorName: creatorId === CREATOR ? 'Sofía Torres' : 'Mateo Ríos', title: { v1:'Mi ritual de las 7:00', v2:'Un paso más', v3:'De grano a historia', v4:'Un café, mil ideas', v5:'48 horas en la montaña', v6:'La ciudad nunca para' }[sid],
      url: platform === 'TikTok' ? 'https://www.tiktok.com/@clipa_demo/video/7' + sid.slice(1).padStart(18, '0') : platform === 'Instagram' ? 'https://www.instagram.com/reel/CLIPADEMO' + sid.slice(1) + '/' : 'https://www.youtube.com/shorts/DEMOclip00' + sid.slice(1),
      platform, views, earned: amount, status, createdAt: now - days * DAY, approvedAt: amount ? now - days * DAY : null, lastAudit: amount ? now - days * DAY : null,
      quarantinedAt: status === 'quarantined' ? now - DAY / 4 : null, reason: status === 'quarantined' ? 'Proporción inusual entre visualizaciones e interacciones.' : '', evidence: null });
    s.submissions = [sub('v5','via',0,0,'submitted',0,'YouTube'),sub('v4','alt',45000,0,'quarantined',1,'TikTok'),sub('v3','alt',24000,6000,'approved',4,'Instagram'),sub('v2','run',32000,6400,'approved',16,'TikTok'),sub('v1','alt',48000,12000,'approved',18,'TikTok'),sub('v6','run',0,0,'submitted',1,'Instagram','mateo')];
    s.submissions.forEach(v => { v.key = canonicalLink(v.url).key; if (v.earned) s.entries.push({id:id('entry'),submissionId:v.id,campaignId:v.campaignId,creatorId:v.creatorId,amount:v.earned,status:'held',createdAt:v.approvedAt,releaseAt:v.approvedAt + 14 * DAY}); });
    log(s, 'Tu espacio está listo. Explora las campañas y publica tu próximo clip.', 'creator');
    log(s, 'Altura espera la verificación de su depósito.', 'admin');
    return settle(s);
  }
  function wallet(s, creatorId = CREATOR) {
    const sums = { held: 0, frozen: 0, available: 0, processing: 0, paid: 0, reversed: 0 };
    s.entries.filter(e => e.creatorId === creatorId).forEach(e => { sums[e.status] += e.amount; });
    return { ...sums, pending: sums.held + sums.frozen, total: sums.held + sums.frozen + sums.available + sums.processing + sums.paid };
  }
  function validateCampaign(p) {
    const title = String(p.title || '').trim(), brand = String(p.brand || '').trim();
    if (!title || title.length > 100 || !brand || brand.length > 40) fail('Escribe el nombre de la campaña y de la marca (máximo 100 y 40 caracteres).');
    const budget = round(Number(p.budget) * 100), cpm = round(Number(p.cpm) * 100), maxPerVideo = round(Number(p.maxPerVideo) * 100), minViews = Number(p.minViews);
    if (![budget,cpm,maxPerVideo].every(n => Number.isSafeInteger(n) && n > 0 && n <= 100000000)) fail('El presupuesto, la tarifa y el límite deben ser montos positivos válidos.');
    if (!Number.isSafeInteger(minViews) || minViews < 1 || minViews > 1000000000) fail('El mínimo de visualizaciones debe ser un número entero positivo.');
    if (maxPerVideo > budget) fail('El máximo por video no puede superar el presupuesto total.');
    let drive; try { drive = new URL(p.drive); } catch { fail('Incluye un enlace válido para el material.'); }
    if (drive.protocol !== 'https:' || drive.hostname !== 'drive.google.com') fail('Usa un enlace de https://drive.google.com/ para el material.');
    if (!String(p.rules || '').trim()) fail('Añade las instrucciones para los creadores.');
    return {title,brand,budget,cpm,maxPerVideo,minViews,drive:drive.href,rules:String(p.rules).trim().slice(0,3000),category:p.category || 'Lifestyle',theme:({Gastronomía:'coffee',Viajes:'travel',Música:'music'})[p.category] || 'sport',description:String(p.description || 'Una nueva historia para crear juntos.').slice(0,400)};
  }
  function execute(original, action, p = {}) {
    const s = clone(original);
    settle(s);
    const c = s.campaigns.find(x => x.id === p.campaignId);
    const v = s.submissions.find(x => x.id === p.submissionId);
    if (p.campaignId && !c) fail('No se encontró la campaña.');
    if (p.submissionId && !v) fail('No se encontró el video.');
    let result;
    switch(action) {
      case 'createCampaign': {
        const values = validateCampaign(p);
        const cid = id('campaign');
        const fresh = { ...values,id:cid,status:p.draft ? 'draft':'awaiting',spent:0,received:0,createdAt:s.now,reference:'CLP-' + cid.slice(-6).toUpperCase() };
        s.campaigns.unshift(fresh); result = cid;
        log(s, p.draft ? 'Borrador guardado: ' + fresh.title : fresh.brand + ' envió una campaña. Esperando fondos.', 'brand'); break;
      }
      case 'editDraft':
        if(c.status !== 'draft') fail('Solo puedes editar una campaña en borrador.');
        Object.assign(c, validateCampaign(p));
        if (!p.draft) { c.status = 'awaiting'; log(s, c.brand + ' envió una campaña. Esperando fondos.', 'brand'); }
        result = c.id; break;
      case 'submitDraft':
        if (c.status !== 'draft') fail('Esta campaña ya fue enviada.');
        c.status = 'awaiting'; log(s, c.brand + ' envió una campaña. Esperando fondos.', 'brand'); break;
      case 'activate': {
        if(c.status !== 'awaiting') fail('La campaña no está esperando fondos.');
        const received = round(Number(p.received) * 100);
        if (received !== c.budget) fail('El depósito simulado debe coincidir con el presupuesto: ' + (c.budget/100).toFixed(2) + ' USD.');
        c.received = received; c.status = 'active'; log(s, c.brand + ': depósito verificado y campaña activa.'); break;
      }
      case 'pause':
        if(c.status !== 'active') fail('Solo se puede pausar una campaña activa.');
        c.status = 'paused'; log(s,c.brand + ': campaña pausada.'); break;
      case 'resume':
        if(c.status !== 'paused' || c.budget <= c.spent) fail('No se puede reanudar esta campaña.');
        c.status = 'active'; log(s,c.brand + ': campaña reanudada.'); break;
      case 'submitVideo': {
        if(c.status !== 'active' || c.budget <= c.spent) fail('La campaña ya no acepta nuevos videos.');
        const link = canonicalLink(p.url);
        if(s.submissions.some(x => x.key === link.key)) fail('Este video ya fue enviado. Eliminamos el rastreo y detectamos el mismo enlace.');
        const sid = id('video');
        s.submissions.unshift({id:sid,campaignId:c.id,creatorId:CREATOR,creatorName:s.creator.name,title:String(p.title || 'Mi nuevo clip').trim().slice(0,100),...link,views:0,earned:0,status:'submitted',createdAt:s.now,lastAudit:null,evidence:null});
        log(s,'Tu video para ' + c.brand + ' está en la cola de revisión.','creator'); result = sid; break;
      }
      case 'startReview':
        if(v.status === 'submitted') { v.status = 'review'; log(s, 'Estamos revisando «' + v.title + '».','creator'); }
        break;
      case 'approve': {
        const campaign = s.campaigns.find(x => x.id === v.campaignId);
        if(!['review','quarantined','approved'].includes(v.status)) fail('Abre el video en revisión antes de aprobarlo.');
        if(v.status === 'quarantined' && !v.evidence) fail('El creador debe adjuntar sus analíticas antes de aprobar este video.');
        if(!['active','paused'].includes(campaign.status) && !(v.status==='quarantined' && campaign.status==='depleted')) fail('La campaña no tiene un presupuesto activo para esta revisión.');
        if(v.status === 'approved' && campaign.status !== 'active') fail('Reanuda la campaña antes de actualizar sus visualizaciones.');
        if(v.status === 'approved' && s.now - v.lastAudit < 2 * DAY) fail('La siguiente actualización estará disponible 48 horas después de la última auditoría.');
        const views = Number(p.views);
        if(!Number.isSafeInteger(views) || views < 0 || views > 1000000000) fail('Ingresa un conteo entero válido de visualizaciones.');
        if(views < v.views && v.status === 'approved') fail('El nuevo conteo no puede ser menor al ya auditado. Si hubo fraude, usa Revocar.');
        const target = views >= campaign.minViews ? Math.min(round(views * campaign.cpm / 1000),campaign.maxPerVideo) : 0;
        const increment = Math.min(Math.max(0,target - v.earned),campaign.budget - campaign.spent);
        s.entries.filter(e=>e.submissionId===v.id && e.status==='frozen').forEach(e=>{ e.status='held'; e.releaseAt=s.now+14*DAY; });
        if(increment > 0) s.entries.push({id:id('entry'),submissionId:v.id,campaignId:campaign.id,creatorId:v.creatorId,amount:increment,status:'held',createdAt:s.now,releaseAt:s.now+14*DAY});
        v.views = views; v.earned += increment; v.status='approved'; v.approvedAt = v.approvedAt || s.now; v.lastAudit=s.now; v.reason=''; campaign.spent += increment;
        if(campaign.spent === campaign.budget) campaign.status='depleted';
        log(s,'«' + v.title + '» aprobado. $' + (increment/100).toFixed(2) + ' USD añadidos a retención.','creator'); result=increment; break;
      }
      case 'quarantine': {
        if(!['review','approved'].includes(v.status)) fail('Este video no puede entrar en cuarentena.');
        if(s.entries.some(e=>e.submissionId===v.id && ['available','processing','paid'].includes(e.status))) fail('Este video ya tiene fondos liberados. La demo solo permite congelar fondos en retención.');
        if(!String(p.reason || '').trim()) fail('Selecciona un motivo.');
        v.status='quarantined';v.quarantinedAt=s.now;v.reason=String(p.reason).slice(0,500);v.evidence=null;
        s.entries.filter(e=>e.submissionId===v.id && e.status==='held').forEach(e=>e.status='frozen');
        log(s,'«'+v.title+'» está en cuarentena. Adjunta tus analíticas en las próximas 48 horas.','creator');break;
      }
      case 'evidence':
        if(v.status!=='quarantined') fail('El video no está en cuarentena.');
        if(s.now > v.quarantinedAt+2*DAY) fail('El plazo de 48 horas terminó. El administrador debe resolver el caso.');
        if(!p.fileName) fail('Selecciona una grabación o usa la prueba de ejemplo.');
        v.evidence={name:String(p.fileName).slice(0,180),at:s.now,simulated:!!p.simulated};log(s,'Se recibieron las analíticas de «'+v.title+'».','admin');break;
      case 'reject':
      case 'revoke': {
        const revoke = action==='revoke';
        if(revoke ? v.status!=='approved' : !['review','quarantined'].includes(v.status)) fail('Esta acción no está disponible para el estado actual.');
        if(!String(p.reason || '').trim()) fail('Indica el motivo de la decisión.');
        const entries=s.entries.filter(e=>e.submissionId===v.id && e.status!=='reversed');
        if(entries.some(e=>!['held','frozen'].includes(e.status))) fail('La reversión solo está disponible para fondos en retención.');
        const refunded=entries.reduce((sum,e)=>sum+e.amount,0);
        entries.forEach(e=>e.status='reversed');
        const campaign=s.campaigns.find(x=>x.id===v.campaignId);campaign.spent-=refunded;
        if(campaign.status==='depleted' && refunded) campaign.status='active';
        if(v.status==='quarantined' && v.creatorId===CREATOR) s.creator.strikes++;
        v.status=revoke?'revoked':'rejected';v.earned=0;v.reason=String(p.reason).slice(0,500);
        log(s,'«'+v.title+'»: '+(revoke?'ganancias revocadas':'video rechazado')+'. '+v.reason,'creator'); result=refunded;break;
      }
      case 'advance': {
        const days=Number(p.days);if(!Number.isInteger(days)||days<1||days>30) fail('Avanza entre 1 y 30 días.');
        const before=wallet(s).available;s.now+=days*DAY;settle(s);
        log(s,'Reloj de la demo: avanzaron '+days+' días. '+(wallet(s).available>before?'Hay fondos nuevos disponibles.':''));break;
      }
      case 'updateAccount':
        if(!String(p.account||'').trim() || !['Nequi','Bancolombia','Daviplata'].includes(p.method)) fail('Completa el medio y la cuenta ficticia de retiro.');
        s.creator.method=p.method;s.creator.account=String(p.account).trim().slice(0,60);break;
      case 'requestWithdrawal': {
        const available=s.entries.filter(e=>e.creatorId===CREATOR&&e.status==='available');
        const amount=available.reduce((sum,e)=>sum+e.amount,0);
        if(!amount) fail('No tienes saldo disponible para retirar.');
        const pid=id('pay');available.forEach(e=>{e.status='processing';e.payoutId=pid;});
        s.payouts.unshift({id:pid,creatorId:CREATOR,creatorName:s.creator.name,amount,status:'processing',createdAt:s.now,method:s.creator.method,account:s.creator.account,receipt:null});
        log(s,'Retiro de $'+(amount/100).toFixed(2)+' USD solicitado. El saldo está reservado.','creator');result=pid;break;
      }
      case 'pay': {
        const payout=s.payouts.find(x=>x.id===p.payoutId);
        if(!payout || payout.status!=='processing') fail('Esta solicitud ya fue procesada o no existe.');
        if(!p.confirmed) fail('Confirma la revisión final de los enlaces públicos.');
        if(!p.fileName) fail('Adjunta un comprobante o genera el comprobante ficticio.');
        payout.status='paid';payout.paidAt=s.now;payout.receipt={name:String(p.fileName).slice(0,180),simulated:!!p.simulated};
        s.entries.filter(e=>e.payoutId===payout.id).forEach(e=>e.status='paid');
        log(s,'Pago de $'+(payout.amount/100).toFixed(2)+' USD completado. Comprobante y correo de ejemplo disponibles.','creator');break;
      }
      default: fail('Acción no reconocida.');
    }
    settle(s); return {state:s,result};
  }
  const api = { DAY, CREATOR, seed, execute, wallet, canonicalLink, settle, clone };
  if(typeof module !== 'undefined' && module.exports) module.exports=api;else root.ClipaEngine=api;
})(typeof window !== 'undefined' ? window : globalThis);
