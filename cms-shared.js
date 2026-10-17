(function(root){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
function validAsset(value,base){
 if(typeof value!=='string'||!value||value.length>2048)return false;
 if(/^[a-zA-Z0-9][a-zA-Z0-9_.\/-]*\.(webp|png|jpe?g)$/i.test(value)&&!value.split('/').includes('..'))return true;
 try{const u=new URL(value),b=new URL(base);return u.protocol==='https:'&&u.origin===b.origin&&u.pathname.startsWith('/storage/v1/object/public/maruti-media/')&&!u.username&&!u.password;}catch{return false;}
}
function validate(snapshot,base){
 if(!snapshot||snapshot.schemaVersion!==1||typeof snapshot.texts!=='object'||Array.isArray(snapshot.texts)||!snapshot.texts)throw Error('Invalid content format.');
 if(JSON.stringify(snapshot).length>1500000)throw Error('Content is too large.');
 for(const [k,v]of Object.entries(snapshot.texts)){if(!/^[a-z0-9-]+\.t\d+$/.test(k)||typeof v!=='string'||v.length>10000)throw Error('Invalid text field.');}
 if(!Array.isArray(snapshot.promotions)||snapshot.promotions.length<1||snapshot.promotions.length>30)throw Error('Keep between 1 and 30 promotions.');
 const ids=new Set();for(const p of snapshot.promotions){if(!p||typeof p.id!=='string'||!p.id||p.id.length>100||ids.has(p.id)||!validAsset(p.src,base)||typeof p.alt!=='string'||p.alt.length>300||typeof p.active!=='boolean')throw Error('Invalid promotion.');ids.add(p.id);}
 if(!snapshot.promotions.some(p=>p.active))throw Error('At least one promotion must be active.');
 if(!snapshot.analytics||typeof snapshot.analytics.measurementId!=='string'||!/^$|^G-[A-Z0-9]{4,20}$/.test(snapshot.analytics.measurementId))throw Error('Invalid Google Analytics measurement ID.');
 return snapshot;
}
function collectTextNodes(doc){doc.body.normalize();const walker=doc.createTreeWalker(doc.body,4),list=[];let n;while(n=walker.nextNode()){if(n.nodeValue.trim()&&!['SCRIPT','STYLE','NOSCRIPT'].includes(n.parentElement?.tagName))list.push(n);}return list;}
function apply(doc,snapshot,page,base){validate(snapshot,base);const nodes=collectTextNodes(doc);nodes.forEach((n,i)=>{const text=snapshot.texts[page+'.t'+i];if(typeof text==='string')n.nodeValue=text;});
 const stage=doc.querySelector('.promo-stage'),dots=doc.querySelector('.dots');if(stage){const active=snapshot.promotions.filter(p=>p.active);stage.replaceChildren();active.forEach((p,i)=>{const img=doc.createElement('img');img.src=p.src;img.alt=p.alt;img.hidden=i!==0;img.decoding='async';stage.appendChild(img);});if(dots){dots.replaceChildren();active.forEach((p,i)=>{const b=doc.createElement('button');b.className=i===0?'active':'';b.setAttribute('aria-label','Show promotion '+(i+1));b.setAttribute('aria-pressed',String(i===0));dots.appendChild(b);});}const counter=doc.querySelector('.slide-controls span');if(counter)counter.textContent='01 / '+String(active.length).padStart(2,'0');}
}
const api={clone,validate,validAsset,collectTextNodes,apply};if(typeof module!=='undefined')module.exports=api;root.MarutiContent=api;
})(typeof window!=='undefined'?window:globalThis);
