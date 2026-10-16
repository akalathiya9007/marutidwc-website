'use strict';
(()=>{
const menu=document.querySelector('header .menu'),nav=document.querySelector('header nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav?.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');});
const cards=[...document.querySelectorAll('.product-grid>article')];
document.querySelectorAll('.filters button').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('.filters button').forEach(b=>b.classList.toggle('selected',b===button));
 const category=button.textContent.trim();cards.forEach((card,i)=>{const show=category==='All Products'||category==='Complete Range'&&i===6||category==='Valves & Fittings'&&i<3||category==='Tools & Equipment'&&[3,4].includes(i)||category==='Lubricants'&&i===5;card.hidden=!show;card.style.display=show?'':'none';});
}));
const images=[...document.querySelectorAll('.promo-stage img')],dots=[...document.querySelectorAll('.dots button')],controls=[...document.querySelectorAll('.slide-controls button')];let slide=0,paused=false;
function show(i){slide=(i+images.length)%images.length;images.forEach((img,n)=>{img.hidden=n!==slide;});dots.forEach((dot,n)=>{dot.classList.toggle('active',n===slide);dot.setAttribute('aria-pressed',String(n===slide));});const count=document.querySelector('.slide-controls span');if(count)count.textContent='0'+(slide+1)+' / 03';}
if(images.length){controls[0]?.addEventListener('click',()=>show(slide-1));controls[1]?.addEventListener('click',()=>show(slide+1));controls[2]?.addEventListener('click',()=>{paused=!paused;controls[2].textContent=paused?'▶':'Ⅱ';controls[2].setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow');});dots.forEach((d,i)=>d.addEventListener('click',()=>show(i)));setInterval(()=>{if(!paused)show(slide+1);},5000);}
const dialog=document.querySelector('dialog.a4-catalog');document.querySelector('.catalog-entry')?.addEventListener('click',event=>{event.preventDefault();dialog.showModal();});dialog?.querySelector('.dialog-close')?.addEventListener('click',()=>dialog.close());
dialog?.querySelector('.catalog-tools .button')?.addEventListener('click',()=>{const a=document.createElement('a');a.href='catalog.pdf';a.download='MARUTI-Product-Catalog.pdf';document.body.appendChild(a);a.click();a.remove();});
})();
