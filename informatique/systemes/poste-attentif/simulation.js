'use strict';
// Modèle pédagogique local. Aucun réseau, matériel ou installateur réel.
const $ = id => document.getElementById(id);
let state;
function log(message) {
  const item = document.createElement('li');
  item.textContent = `${state.time} s — ${message}`;
  $('simLog').prepend(item);
  while ($('simLog').children.length > 16) $('simLog').lastElementChild.remove();
}
function reset() {
  state = {time:0,present:true,absentSince:null,unknownSince:null,lastInput:0,locked:false,job:'pending',jobStart:null,report:false,phase:'presence'};
  for (const id of ['sensorFault','serverFault','appOpen']) $(id).checked=false;
  $('simLog').replaceChildren(); log('Session ouverte, configuration valide en cache.'); render();
}
function evaluate() {
  const bad=$('sensorFault').checked, offline=$('serverFault').checked;
  const elapsed=state.absentSince===null?0:state.time-state.absentSince;
  const faultElapsed=state.unknownSince===null?0:state.time-state.unknownSince;
  if (!state.locked && ((bad&&faultElapsed>=13)||(!bad&&!state.present&&elapsed>=13))) {
    state.locked=true;log(bad?'Verrouillage demandé après perte de confiance.':'Verrouillage après absence confirmée.');
  }
  if (!state.locked && state.time-state.lastInput>=600) {
    state.locked=true; log('Filet local : verrouillage pour inactivité des entrées.');
  }
  if (state.job==='pending' && !bad && !state.present && elapsed>=1200 && state.locked && !offline && !$('appOpen').checked) {
    state.job='running';state.jobStart=state.time; log('Début du MSI fictif, conditions validées.');
  }
  if (state.job==='running' && state.time-state.jobStart>=90) {
    state.job='done'; log('Installation terminée ; aucun redémarrage.');
  }
  if (state.job==='done' && !state.report && !offline) {
    state.report=true;log('Résultat technique transmis une seule fois à l’API.');
  }
}
function render() {
  const bad=$('sensorFault').checked, offline=$('serverFault').checked;
  const elapsed=state.absentSince===null?0:state.time-state.absentSince;
  const warning=!bad&&!state.present&&!state.locked&&elapsed>=10;
  $('screenState').textContent=state.locked?'Session verrouillée':'Session ouverte';
  $('simClock').textContent=`Temps simulé : ${Math.floor(state.time/60)} min ${state.time%60} s`;
  $('led').className='led '+(bad?'off':state.locked?'red':!state.present?'orange':'');
  $('ledText').textContent=bad?'Éteinte · boîtier indisponible':state.locked?'Rouge · session verrouillée':warning?'Orange · avertissement':!state.present?'Orange · absence à confirmer':'Vert · présence';
  $('presenceState').textContent=bad?'Inconnue':state.present?'Présence détectée':`Absence : ${elapsed} s`;
  let jobLabel=state.job==='done'?'Terminée':state.job==='running'?`En cours : ${state.time-state.jobStart}/90 s`:'En attente';
  if(state.job==='pending'&&bad) jobLabel='Interdite : capteur';
  if(state.job==='pending'&&!state.present&&elapsed>=1200) jobLabel=bad?'Interdite : capteur':offline?'Report : serveur':$('appOpen').checked?'Report : application':'En attente';
  $('installState').textContent=jobLabel;
  $('reportState').textContent=state.report?'Résultat reçu':state.job==='done'?'En attente du serveur':'Aucun résultat';
  let explanation=bad?'Présence inconnue : maintenance interdite. Le programme demande le verrouillage après 13 s ; le filet local reste indépendant.':state.present?'La présence seule ne déverrouille jamais Windows. Le filet local peut verrouiller après 10 minutes sans interaction.':warning?'Trois secondes d’avertissement : un retour à temps annule la demande de verrouillage.':state.locked?'La session reste verrouillée ; une absence continue de 20 minutes permet d’évaluer les conditions de maintenance.':'Le programme attend dix secondes d’absence continue avant son avertissement.';
  if(state.job==='running'&&state.present) explanation+=' Martine est revenue : le MSI sélectionné termine sans interruption brutale ; aucun nouveau paquet ne sera lancé.';
  if(offline) explanation+=' Ubuntu est indisponible : configuration conservée localement, nouvelles installations reportées.';
  $('simExplanation').textContent=explanation;
  $('unlock').disabled=!state.locked||!state.present||bad;
}
$('leave').addEventListener('click',()=>{if(state.present){state.present=false;if(!$('sensorFault').checked)state.absentSince=state.time;log('Martine quitte le bureau.');}evaluate();render();});
$('return').addEventListener('click',()=>{if(!state.present){state.present=true;state.absentSince=null;log('Martine revient ; aucune authentification automatique.');}evaluate();render();});
$('unlock').addEventListener('click',()=>{if(state.present&&!$('sensorFault').checked){state.locked=false;state.lastInput=state.time;log('Martine s’authentifie manuellement.');}render();});
for (const button of document.querySelectorAll('[data-tick]')) button.addEventListener('click',()=>{for(let i=0;i<Number(button.dataset.tick);i++){state.time++;evaluate();}render();});
$('sensorFault').addEventListener('change',()=>{state.unknownSince=$('sensorFault').checked?state.time:null;state.absentSince=!$('sensorFault').checked&&!state.present?state.time:null;log($('sensorFault').checked?'Messages perdus ou rejetés : état inconnu.':'Nouvelle session du boîtier validée ; temporisation recommencée.');evaluate();render();});
for(const id of ['serverFault','appOpen']) $(id).addEventListener('change',()=>{log(id==='serverFault'?($(id).checked?'Serveur coupé.':'Serveur rétabli.'):($(id).checked?'Application concernée ouverte.':'Application concernée fermée.'));evaluate();render();});
$('reset').addEventListener('click',reset);
function updateDelay(){const a=Number($('absenceDelay').value),w=Number($('warningDelay').value),total=a+w;$('absenceValue').textContent=a;$('warningValue').textContent=w;$('delayBar').setAttribute('width',540*total/600);$('delayLabel').textContent=`${total} s`;$('delayLabel').setAttribute('x',210+540*total/600);$('delaySummary').textContent=`Modèle idéal : ${a} + ${w} = ${total} s, soit ${600-total} s de moins que 600 s. Une temporisation plus courte peut aussi rendre les fausses absences plus gênantes.`;}
for(const id of ['absenceDelay','warningDelay']) $(id).addEventListener('input',updateDelay);
function updateThreshold(){const t=Number($('radarThreshold').value),y=220-2*t;$('thresholdValue').textContent=t;$('thresholdLine').setAttribute('d',`M80 ${y} H750`);$('thresholdLabel').setAttribute('y',y-8);$('thresholdLabel').textContent=`Seuil ${t}`;const results=[['Chaise vide',18],['Agent immobile',52],['Usager dans le champ',68]].map(([name,v])=>`${name} : ${v>=t?'présence':'absence'}`).join(' · ');$('thresholdSummary').textContent=results+'. '+(t<=18?'Seuil trop bas : même la chaise vide déclenche.':t<=52?'L’agent est détecté, mais l’usager aussi : il faut agir sur la zone.':t<=68?'L’agent immobile est manqué, alors que l’usager déclenche encore.':'Plus personne n’est détecté : relever le seuil ne résout pas tout.');}
$('radarThreshold').addEventListener('input',updateThreshold);
reset();updateDelay();updateThreshold();
