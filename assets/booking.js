/* And Again Advisory. Reusable Book a Consultation module.
   Include with <script src="assets/booking.js"></script> (adjust path per page)
   Any element with data-book opens the booking modal. Submits by email to info@andagain.ae. */
(function(){
  var INDIGO='#06037A',INK='#04022A',GOLD='#D2AA24',GB='#FFD663',LINE='#E6E4F2',BODY='#3E4049',CREAM='#F7F5EF';
  var css='\
  .bkm{position:fixed;inset:0;z-index:1400;display:none;align-items:center;justify-content:center;padding:1.1rem;font-family:Montserrat,system-ui,sans-serif}\
  .bkm.open{display:flex}\
  .bkm .bd{position:absolute;inset:0;background:rgba(4,2,26,.74);backdrop-filter:blur(6px);opacity:0;transition:opacity .35s cubic-bezier(.22,1,.36,1)}\
  .bkm.show .bd{opacity:1}\
  .bkm .sheet{position:relative;z-index:2;width:min(560px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:12px;box-shadow:0 40px 90px rgba(0,0,0,.45);transform:translateY(24px) scale(.98);opacity:0;transition:.42s cubic-bezier(.22,1,.36,1);padding:clamp(1.6rem,4vw,2.4rem)}\
  .bkm.show .sheet{transform:none;opacity:1}\
  .bkm .x{position:absolute;top:1rem;right:1rem;width:38px;height:38px;border-radius:50%;border:1px solid '+LINE+';background:#fff;cursor:pointer;font-size:1.1rem;color:'+INDIGO+';transition:.3s}\
  .bkm .x:hover{background:'+INDIGO+';color:#fff}\
  .bkm h3{font-family:"TASA Explorer",Georgia,serif;color:'+INDIGO+';font-size:1.6rem;letter-spacing:-.02em;margin:0 0 .3rem}\
  .bkm .sub{color:'+BODY+';font-size:.94rem;margin-bottom:1.3rem}\
  .bkm .lab{font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:'+GOLD+';margin:0 0 .5rem;display:block}\
  .bkm .lab .r{color:#c0392b}\
  .bkm .ch{display:flex;align-items:center;justify-content:space-between;margin-bottom:.6rem}\
  .bkm .ch b{font-family:"TASA Explorer",Georgia,serif;color:'+INDIGO+';font-size:1.05rem}\
  .bkm .cn{display:flex;gap:.4rem}\
  .bkm .cn button{width:34px;height:34px;border-radius:4px;border:1px solid '+LINE+';background:#fff;cursor:pointer;color:'+INDIGO+';transition:.25s}\
  .bkm .cn button:hover{background:'+INDIGO+';color:#fff}\
  .bkm .grid{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}\
  .bkm .dow{text-align:center;font-size:.64rem;font-weight:700;color:'+BODY+';opacity:.6;padding:.25rem 0;text-transform:uppercase}\
  .bkm .day{aspect-ratio:1;border:1px solid transparent;background:'+CREAM+';border-radius:4px;cursor:pointer;font-size:.86rem;font-weight:600;color:'+INDIGO+';transition:.2s;font-family:inherit}\
  .bkm .day:hover:not(.dis){border-color:'+GOLD+'}\
  .bkm .day.dis{opacity:.3;cursor:not-allowed;background:transparent}\
  .bkm .day.sel{background:'+INDIGO+';color:#fff}\
  .bkm .slots{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem}\
  .bkm .slot{padding:.55rem 0;text-align:center;border:1px solid '+LINE+';background:#fff;border-radius:4px;font-size:.82rem;font-weight:600;color:'+INDIGO+';cursor:pointer;transition:.2s;font-family:inherit}\
  .bkm .slot:hover{border-color:'+GOLD+'}.bkm .slot.on{background:'+INDIGO+';color:#fff;border-color:'+INDIGO+'}\
  .bkm .fg{margin-bottom:1rem}\
  .bkm .in{width:100%;padding:.78rem 1rem;border:1px solid '+LINE+';border-radius:4px;font-family:inherit;font-size:.94rem;color:'+INDIGO+';background:#fff}\
  .bkm .in:focus{outline:none;border-color:'+GOLD+';box-shadow:0 0 0 3px rgba(210,170,36,.16)}\
  .bkm .in.err{border-color:#c0392b;box-shadow:0 0 0 3px rgba(192,57,43,.14)}\
  .bkm textarea.in{resize:vertical;min-height:70px}\
  .bkm .row2{display:grid;grid-template-columns:1fr 1fr;gap:.7rem}\
  .bkm select.in{appearance:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2714%27 height=%2714%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2306037A%27 stroke-width=%272.5%27><path d=%27M6 9l6 6 6-6%27/></svg>");background-repeat:no-repeat;background-position:right 1rem center}\
  .bkm .go{width:100%;margin-top:.4rem;background:linear-gradient(135deg,'+GOLD+','+GB+');color:'+INDIGO+';font-weight:600;border:0;border-radius:2px;padding:1rem;font-size:1rem;cursor:pointer;font-family:inherit;transition:.3s}\
  .bkm .go:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(210,170,36,.3)}\
  .bkm .err-msg{color:#c0392b;font-size:.82rem;margin-top:.6rem;display:none}\
  .bkm .ok-msg{color:'+GOLD+';font-size:.82rem;margin-top:.6rem;display:none}\
  .bkm .ok-msg a{color:'+INDIGO+';text-decoration:underline;text-underline-offset:2px}\
  @media(max-width:640px){\
  .bkm{padding:0;align-items:flex-end}\
  .bkm .sheet{width:100%;max-height:94vh;max-height:94dvh;border-radius:18px 18px 0 0;padding:1.6rem 1.4rem calc(1.6rem + env(safe-area-inset-bottom))}\
  .bkm .in{font-size:16px;padding:.85rem 1rem}\
  .bkm .go{padding:1.05rem}}\
  @media(max-width:520px){.bkm .row2{grid-template-columns:1fr}.bkm .slots{grid-template-columns:repeat(4,1fr)}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var tzs=['Gulf Standard Time (UTC+4), Dubai','East Africa Time (UTC+3), Addis Ababa','Central European Time (UTC+1)','Greenwich Mean Time (UTC+0), London','India Standard Time (UTC+5:30)','Eastern Time (UTC-5), New York','Pacific Time (UTC-8), Los Angeles'];
  var m=document.createElement('div');m.className='bkm';
  m.innerHTML='<div class="bd" data-c></div><div class="sheet"><button class="x" data-c aria-label="Close">&times;</button>'+
    '<h3>Book a Free Consultation</h3><div class="sub">Pick a day and time that suits you. Free and without obligation. This is a request, not a confirmed booking. We will confirm availability by WhatsApp or email.</div>'+
    '<div class="ch"><span></span><b id="bkmM"></b><div class="cn"><button id="bkmP">&#8249;</button><button id="bkmN">&#8250;</button></div></div>'+
    '<div class="grid" id="bkmG"></div>'+
    '<div class="row2" style="margin-top:1.1rem"><div class="fg"><span class="lab">Time</span><div class="slots" id="bkmS"></div></div>'+
    '<div class="fg"><span class="lab">Time zone</span><select class="in" id="bkmTz">'+tzs.map(function(t){return '<option>'+t+'</option>';}).join('')+'</select></div></div>'+
    '<div class="fg"><span class="lab">Full name <span class="r">*</span></span><input class="in" id="bkmName" placeholder="Your full name"></div>'+
    '<div class="row2"><div class="fg"><span class="lab">Email <span class="r">*</span></span><input class="in" id="bkmEmail" type="email" placeholder="you@email.com"></div>'+
    '<div class="fg"><span class="lab">Phone / WhatsApp <span class="r">*</span></span><input class="in" id="bkmPhone" placeholder="+971 ..."></div></div>'+
    '<div class="fg"><span class="lab">Your business &amp; intentions <span class="r">*</span></span><textarea class="in" id="bkmBiz" placeholder="Tell us about your business and what you want to achieve."></textarea></div>'+
    '<button class="go" id="bkmGo">Request preferred slot &rarr;</button>'+
    '<div class="err-msg" id="bkmErr">Please pick a slot and complete the required fields.</div>'+
    '<div class="ok-msg" id="bkmOk">Opening your email to confirm with info@andagain.ae.</div>'+
    '</div>';
  document.body.appendChild(m);

  var enc=function(s){return encodeURIComponent(s);},okEmail=function(s){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);};
  var now=new Date(),cal={m:now.getMonth(),y:now.getFullYear(),sel:null,lab:null,slot:null};
  var slots=['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'];
  function rSlots(){document.getElementById('bkmS').innerHTML=slots.map(function(s){return '<button class="slot'+(cal.slot===s?' on':'')+'" data-s="'+s+'">'+s+'</button>';}).join('');}
  function rCal(){var f=new Date(cal.y,cal.m,1),start=f.getDay(),days=new Date(cal.y,cal.m+1,0).getDate(),t=new Date();t.setHours(0,0,0,0);
    document.getElementById('bkmM').textContent=f.toLocaleString('en-US',{month:'long',year:'numeric'});
    var h=['Su','Mo','Tu','We','Th','Fr','Sa'].map(function(d){return '<div class="dow">'+d+'</div>';}).join('');
    for(var i=0;i<start;i++)h+='<div></div>';
    for(var d=1;d<=days;d++){var dt=new Date(cal.y,cal.m,d),dw=dt.getDay(),dis=dt<t||dw===0||dw===6;
      var iso=cal.y+'-'+String(cal.m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
      h+='<button class="day'+(dis?' dis':'')+(cal.sel===iso?' sel':'')+'"'+(dis?' disabled':'')+' data-d="'+iso+'" data-lab="'+dt.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})+'">'+d+'</button>';}
    document.getElementById('bkmG').innerHTML=h;}
  document.getElementById('bkmG').addEventListener('click',function(e){var b=e.target.closest('.day');if(!b||b.classList.contains('dis'))return;cal.sel=b.dataset.d;cal.lab=b.dataset.lab;rCal();});
  document.getElementById('bkmS').addEventListener('click',function(e){var b=e.target.closest('.slot');if(!b)return;cal.slot=b.dataset.s;rSlots();});
  document.getElementById('bkmP').addEventListener('click',function(){var t=new Date();if(cal.y===t.getFullYear()&&cal.m===t.getMonth())return;cal.m--;if(cal.m<0){cal.m=11;cal.y--;}rCal();});
  document.getElementById('bkmN').addEventListener('click',function(){cal.m++;if(cal.m>11){cal.m=0;cal.y++;}rCal();});
  function mark(el,bad){el.classList.toggle('err',bad);return !bad;}
  function nfEncode(d){return Object.keys(d).map(function(k){return enc(k)+'='+enc(d[k]);}).join('&');}
  function nfSubmit(formName,data){return fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:nfEncode(Object.assign({'form-name':formName,'bot-field':''},data))});}
  document.getElementById('bkmGo').addEventListener('click',function(){
    var n=document.getElementById('bkmName'),em=document.getElementById('bkmEmail'),ph=document.getElementById('bkmPhone'),bz=document.getElementById('bkmBiz'),tz=document.getElementById('bkmTz').value,btn=document.getElementById('bkmGo');
    var ok=!!(cal.sel&&cal.slot);ok=mark(n,!n.value.trim())&&ok;ok=mark(em,!okEmail(em.value))&&ok;ok=mark(ph,!ph.value.trim())&&ok;ok=mark(bz,!bz.value.trim())&&ok;
    if(!ok){document.getElementById('bkmErr').style.display='block';return;}document.getElementById('bkmErr').style.display='none';
    btn.disabled=true;btn.textContent='Sending...';
    var data={name:n.value,email:em.value,phone:ph.value,date:cal.lab,time:cal.slot,timezone:tz,business:bz.value};
    nfSubmit('consultation',data).then(function(){var o=document.getElementById('bkmOk');o.textContent='Request received. We will confirm availability by WhatsApp or email.';o.style.display='block';btn.style.display='none';window.track&&window.track('form_submit',{form:'consultation'});}).catch(function(){
      var wa='https://wa.me/971559330941?text='+enc('Consultation request. Name: '+n.value+' | Email: '+em.value+' | Phone: '+ph.value+' | Preferred: '+cal.lab+' at '+cal.slot+' ('+tz+') | Business: '+bz.value);
      var body='Consultation booking request%0D%0A%0D%0AName: '+enc(n.value)+'%0D%0AEmail: '+enc(em.value)+'%0D%0APhone / WhatsApp: '+enc(ph.value)+'%0D%0APreferred date: '+enc(cal.lab)+'%0D%0APreferred time: '+enc(cal.slot)+'%0D%0ATime zone: '+enc(tz)+'%0D%0A%0D%0ABusiness and intentions:%0D%0A'+enc(bz.value);
      var mail='mailto:info@andagain.ae?subject='+enc('Consultation request from '+n.value)+'&body='+body;
      var o=document.getElementById('bkmOk');o.innerHTML='We could not submit automatically. <a href="'+wa+'" target="_blank" rel="noopener">Send it via WhatsApp</a> or <a href="'+mail+'">send it by email</a>. Your details are pre-filled.';o.style.display='block';
      btn.disabled=false;btn.innerHTML='Request preferred slot &rarr;';});
  });
  var lastFocus=null;
  function open(){lastFocus=document.activeElement;rCal();rSlots();m.classList.add('open');requestAnimationFrame(function(){m.classList.add('show');});document.body.style.overflow='hidden';var x=m.querySelector('.x');x&&x.focus();}
  function close(){m.classList.remove('show');document.body.style.overflow='';setTimeout(function(){m.classList.remove('open');},360);if(lastFocus&&lastFocus.focus)lastFocus.focus();}
  m.querySelectorAll('[data-c]').forEach(function(b){b.addEventListener('click',close);});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&m.classList.contains('open')){close();return;}
    if(e.key==='Tab'&&m.classList.contains('open')){
      var f=Array.prototype.filter.call(m.querySelectorAll('a[href],button,input,select,textarea'),function(x){return !x.disabled&&x.offsetParent!==null;});
      if(!f.length)return;var first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault();}
      else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault();}
    }});
  document.addEventListener('click',function(e){var b=e.target.closest('[data-book]');if(b){e.preventDefault();open();}});
})();
