const $ = (id) => document.getElementById(id);
const canvas = $('graph'), ctx = canvas.getContext('2d');
let concepts = [], relations = [], selected = 'arp', mode = 'free';
let yaw = .24, pitch = -.14, zoom = 1, dragging = false, moved = false, previous = null, rendered = [], highlight = '';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const byId = id => concepts.find(c => c.id === id);
const sanitizeColor = color => /^#[0-9a-f]{6}$/i.test(color) ? color : '#ebb552';
function anglePosition(point) {
  const [x,y,z] = point;
  const rx = x*Math.cos(yaw) - z*Math.sin(yaw), rz = x*Math.sin(yaw)+z*Math.cos(yaw);
  const ry = y*Math.cos(pitch)-rz*Math.sin(pitch), zz = y*Math.sin(pitch)+rz*Math.cos(pitch);
  const scale = Math.min(canvas.clientWidth/12,canvas.clientHeight/7)*zoom*5/(5+zz*.38);
  return {x:canvas.clientWidth/2+rx*scale,y:canvas.clientHeight/2-ry*scale,z:zz,r:Math.max(14,Math.min(29,19*scale/(canvas.clientWidth/12||1)))};
}
function dimensions() {const d=Math.min(window.devicePixelRatio||1,2), w=canvas.clientWidth,h=canvas.clientHeight;if(canvas.width!==Math.round(w*d)||canvas.height!==Math.round(h*d)){canvas.width=Math.round(w*d);canvas.height=Math.round(h*d)}ctx.setTransform(d,0,0,d,0,0);return {w,h}}
function draw() {
 const {w,h}=dimensions();ctx.clearRect(0,0,w,h);
 const glow=ctx.createRadialGradient(w*.5,h*.5,10,w*.5,h*.5,w*.6);glow.addColorStop(0,'#244435');glow.addColorStop(1,'#10251f');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 for(let x=20;x<w;x+=38) for(let y=16;y<h;y+=38){ctx.fillStyle='rgba(169,201,169,.07)';ctx.fillRect(x,y,1.3,1.3)}
 const points=new Map(concepts.map(c=>[c.id,anglePosition(c.position)]));
 for(const link of relations){const a=points.get(link.source),b=points.get(link.cible);if(!a||!b)continue;const bright=link.source===selected||link.cible===selected;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=bright?'rgba(235,181,82,.85)':'rgba(155,186,161,.28)';ctx.lineWidth=bright?2:1;ctx.stroke();}
 rendered=concepts.map(c=>({...points.get(c.id),concept:c})).sort((a,b)=>b.z-a.z);
 for(const p of rendered){const chosen=p.concept.id===selected, faded=highlight&&!p.concept.titre.toLowerCase().includes(highlight);
 ctx.save();ctx.globalAlpha=faded?.16:1;const halo=ctx.createRadialGradient(p.x-5,p.y-5,3,p.x,p.y,p.r*1.9);halo.addColorStop(0,chosen?'rgba(235,181,82,.35)':'rgba(207,230,208,.13)');halo.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(p.x,p.y,p.r*1.9,0,2*Math.PI);ctx.fill();
 const grad=ctx.createRadialGradient(p.x-p.r*.4,p.y-p.r*.5,p.r*.1,p.x,p.y,p.r*1.2);grad.addColorStop(0,'#fff2d5');grad.addColorStop(.25,sanitizeColor(p.concept.couleur));grad.addColorStop(1,'#365248');ctx.fillStyle=grad;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,2*Math.PI);ctx.fill();ctx.lineWidth=chosen?3:1;ctx.strokeStyle=chosen?'#f9df9f':'rgba(255,255,255,.27)';ctx.stroke();
 ctx.font=(chosen?'700 ':'500 ')+'12px DM Sans, sans-serif';ctx.fillStyle='#f8f3ee';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.concept.titre,p.x,p.y+p.r+17);ctx.restore();}
}
function related(id){return relations.filter(r=>r.source===id||r.cible===id).map(r=>({id:r.source===id?r.cible:r.source,relation:r}));}
function prerequisiteOrder(id,seen=new Set(),out=[]) {if(seen.has(id))return out;seen.add(id);for(const pre of byId(id)?.prerequis||[])prerequisiteOrder(pre,seen,out);out.push(id);return out;}
function el(tag,className,text){const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n}
function updatePanel(){
 const c=byId(selected);if(!c)return;
 const card=$('concept-card');card.replaceChildren();
 const title=el('h3','concept-title',c.titre),pill=el('span','pill',c.categorie),summary=el('p','concept-summary',c.resume);card.append(title,pill,summary);
 const edges=related(selected);if(edges.length){const block=el('p','concept-relations','Connexions : '+edges.map(e=>byId(e.id)?.titre).filter(Boolean).join(' · '));card.append(block);}
 const link=el(c.url?'a':'span','concept-link'+(c.url?'':' disabled'),c.url?'Découvrir cet article ↗':'Article à venir');if(c.url)link.href=c.url;card.append(link);
 const list=$('concept-list');list.replaceChildren();concepts.filter(x=>x.titre.toLowerCase().includes(highlight)).forEach(x=>{const b=el('button',x.id===selected?'selected':'',x.titre);b.type='button';b.setAttribute('aria-pressed',String(x.id===selected));b.append(el('span','',x.id===selected?'●':'↗'));b.addEventListener('click',()=>choose(x.id));list.append(b)});
 if(mode==='guided'){const order=prerequisiteOrder(selected);$('guide-text').textContent=order.map((id,i)=>`${i+1}. ${byId(id)?.titre||id}`).join(' → ')+' · Les articles non encore écrits sont des étapes futures.';}
 $('graph-status').textContent=`${c.titre} sélectionné, ${edges.length} connexion(s).`;draw();
}
function choose(id){if(!byId(id))return;selected=id;updatePanel()}
function setMode(next){mode=next;for(const name of ['free','guided']){$('mode-'+name).classList.toggle('active',next===name);$('mode-'+name).setAttribute('aria-pressed',String(next===name));}$('guide-note').hidden=next!=='guided';updatePanel()}
function pick(x,y){const hits=rendered.filter(p=>Math.hypot(p.x-x,p.y-y)<p.r+12);hits.sort((a,b)=>a.z-b.z);if(hits.length)choose(hits[0].concept.id)}
canvas.addEventListener('pointerdown',e=>{dragging=true;moved=false;previous={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!dragging||!previous)return;const dx=e.clientX-previous.x,dy=e.clientY-previous.y;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;yaw+=dx*.009;pitch=Math.max(-1.25,Math.min(1.25,pitch+dy*.009));previous={x:e.clientX,y:e.clientY};draw()});
canvas.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;if(!moved){const r=canvas.getBoundingClientRect();pick(e.clientX-r.left,e.clientY-r.top)}});
canvas.addEventListener('pointercancel',()=>{dragging=false});
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.5,Math.min(2.2,zoom*(e.deltaY>0?.91:1.09)));draw()},{passive:false});
$('reset-camera').addEventListener('click',()=>{yaw=.24;pitch=-.14;zoom=1;draw()});
$('mode-free').addEventListener('click',()=>setMode('free'));$('mode-guided').addEventListener('click',()=>setMode('guided'));
$('search').addEventListener('input',e=>{highlight=e.target.value.trim().toLowerCase();updatePanel()});
window.addEventListener('resize',draw);
function populateLibrary(){const area=$('library-grid');area.replaceChildren();for(const c of concepts){const card=el('article','library-card');card.append(el('span','pill',c.categorie),el('h3','',c.titre),el('p','',c.resume));const link=el(c.url?'a':'span',c.url?'':'soon',c.url?'Lire l’article →':'À découvrir bientôt');if(c.url)link.href=c.url;card.append(link);area.append(card)}}
async function start(){try{const [a,b]=await Promise.all([fetch('donnees/concepts.json'),fetch('donnees/relations.json')]);if(!a.ok||!b.ok)throw new Error('Fichiers de données indisponibles');concepts=await a.json();relations=await b.json();if(!Array.isArray(concepts)||!Array.isArray(relations))throw Error('Données invalides');$('count-concepts').textContent=concepts.length;$('count-links').textContent=relations.length;selected=concepts[0]?.id||'';populateLibrary();setMode('free');if(!reduceMotion)draw();}catch(error){$('concept-card').textContent='Le catalogue ne peut pas être chargé. Ouvrez le projet avec un serveur HTTP statique (python3 -m http.server 8000).';$('graph-status').textContent=error.message;console.error(error)}}
start();
