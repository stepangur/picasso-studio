(function(){
  // ---------- hero: сплит-слайдер ----------
  (function(){
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hs=[...document.querySelectorAll('.hs')];
    const caps=[...document.querySelectorAll('.cap')];
    const ths=[...document.querySelectorAll('.th')];
    if(!hs.length) return;
    let i=0,t=null,hover=false,onscreen=true;
    function running(){ return !hover && onscreen && !reduce; }
    function go(n){
      i=(n+hs.length)%hs.length;
      hs.forEach((e,k)=>{e.classList.toggle('on',k===i); e.setAttribute('aria-hidden',k===i?'false':'true');});
      caps.forEach((e,k)=>e.classList.toggle('on',k===i));
      ths.forEach((e,k)=>{e.classList.toggle('on',k===i); e.setAttribute('aria-selected',k===i?'true':'false');});
      const a=ths[i], strip=document.getElementById('thumbs');
      if(a&&strip){ const l=a.offsetLeft,r=l+a.offsetWidth,vs=strip.scrollLeft,ve=vs+strip.clientWidth;
        if(l<vs) strip.scrollLeft=l-12; else if(r>ve) strip.scrollLeft=r-strip.clientWidth+12; }
      tick();
    }
    function tick(){ clearInterval(t); if(running()) t=setInterval(()=>go(i+1),6500); }
    ths.forEach(b=>b.onclick=()=>go(+b.dataset.go));
    const stage=document.getElementById('stage');
    stage.addEventListener('mouseenter',()=>{hover=true;tick()});
    stage.addEventListener('mouseleave',()=>{hover=false;tick()});
    let x0=null;
    stage.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
    stage.addEventListener('touchend',e=>{ if(x0===null)return;
      const d=e.changedTouches[0].clientX-x0; if(Math.abs(d)>45) go(d<0?i+1:i-1); x0=null; },{passive:true});
  
  // ---------- оборудование: фильтр + «показать ещё» ----------
  (function(){
    const fs=[...document.querySelectorAll('.eq-f')];
    const rows=[...document.querySelectorAll('.eq-row')];
    const moreBtn=document.getElementById('eqMore');
    const rest=document.getElementById('eqRest');
    const wrap=document.querySelector('.eq-more-wrap');
    if(!rows.length) return;
    const LIMIT=8;
    let cat='all', expanded=false;
    function matches(r){ return cat==='all'||r.dataset.cat===cat; }
    function apply(){
      const shown=rows.filter(matches);
      rows.forEach(r=>r.classList.toggle('eq-hidden', !matches(r)));
      if(!expanded){
        shown.forEach((r,i)=>{ if(i>=LIMIT) r.classList.add('eq-hidden'); });
      }
      const hiddenCount=Math.max(0, shown.length-LIMIT);
      if(hiddenCount>0 && !expanded){
        wrap.style.display='flex';
        moreBtn.firstChild.textContent='Показать ещё ';
        rest.textContent='('+hiddenCount+')';
        moreBtn.setAttribute('aria-expanded','false');
      } else if(shown.length>LIMIT && expanded){
        wrap.style.display='flex';
        moreBtn.firstChild.textContent='Свернуть ';
        rest.textContent='';
        moreBtn.setAttribute('aria-expanded','true');
      } else {
        wrap.style.display='none';
      }
    }
    fs.forEach(f=>f.onclick=()=>{
      fs.forEach(x=>x.classList.toggle('on',x===f));
      cat=f.dataset.cat; expanded=false; apply();
    });
    moreBtn.onclick=()=>{ expanded=!expanded; apply();
      if(!expanded) document.getElementById('equipment').scrollIntoView({behavior:'smooth',block:'start'}); };
    apply();
  })();



  // ---------- попап онлайн-записи Cue ----------
  (function(){
    const modal=document.getElementById('cueModal');
    if(!modal) return;
    let lastFocus=null;
    function open(e){ if(e){e.preventDefault();} lastFocus=document.activeElement;
      modal.hidden=false; document.body.style.overflow='hidden';
      modal.querySelector('.cue-modal__x').focus(); }
    function close(){ modal.hidden=true; document.body.style.overflow='';
      if(lastFocus&&lastFocus.focus) lastFocus.focus(); }
    document.querySelectorAll('[data-cue-open]').forEach(el=>el.addEventListener('click',open));
    modal.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',close));
    document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!modal.hidden) close(); });
  })();

  // ---------- Cue в попапе: виджет грузится при первом открытии ----------
  (function(){
    const body = document.getElementById('cueModalBody');
    if(!body) return;
    let loaded = false;
    function mount(){
      if(loaded) return;
      loaded = true;
      body.innerHTML = '<div id="cue-booking-modal" data-cue-booking-root></div>';
      const s = document.createElement('script');
      s.async = true;
      s.src = body.dataset.cueEmbed;
      s.setAttribute('data-cue-url', body.dataset.cueUrl);
      s.setAttribute('data-cue-target', '#cue-booking-modal');
      s.setAttribute('data-cue-config', body.dataset.cueConfig);
      body.appendChild(s);
    }
    document.querySelectorAll('[data-cue-open]').forEach(el =>
      el.addEventListener('click', mount));
  })();

  const io=new IntersectionObserver(es=>{ onscreen=es[0].isIntersecting; tick(); },{threshold:.12});
    io.observe(document.getElementById('hero'));
    tick();
  })();

  // шапка становится молочной после первого экрана
  // шапка в этом варианте всегда светлая (hero-left молочный)



  // ---------- диафрагма направлений съёмки ----------
  (function(){
    const pets=[...document.querySelectorAll('.pet')];
    const ips=[...document.querySelectorAll('.ip')];
    const chips=[...document.querySelectorAll('.chip')];
    const num=document.getElementById('irisNum');
    if(!pets.length) return;
    function sel(k){
      pets.forEach((e,j)=>{e.classList.toggle('on',j===k); e.setAttribute('aria-selected',j===k);});
      ips.forEach((e,j)=>e.classList.toggle('on',j===k));
      chips.forEach((e,j)=>e.classList.toggle('on',j===k));
      num.textContent=String(k+1).padStart(2,'0');
    }
    pets.forEach((e,k)=>{
      e.onclick=()=>sel(k);
      e.onmouseenter=()=>sel(k);
      e.onkeydown=ev=>{
        if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();sel(k);}
        if(ev.key==='ArrowRight'||ev.key==='ArrowDown'){ev.preventDefault();const n=(k+1)%pets.length;sel(n);pets[n].focus();}
        if(ev.key==='ArrowLeft'||ev.key==='ArrowUp'){ev.preventDefault();const n=(k-1+pets.length)%pets.length;sel(n);pets[n].focus();}
      };
      e.addEventListener('focus',()=>sel(k));
    });
    chips.forEach((e,k)=>e.onclick=()=>sel(k));
  })();

  // ---------- календарь на 3 дня ----------
  (function(){
    const daysEl=document.getElementById('calDays'), slotsEl=document.getElementById('slots'),
          pick=document.getElementById('pick'), cta=document.getElementById('calCta');
    if(!daysEl) return;
    const WD=['вс','пн','вт','ср','чт','пт','сб'];
    const MN=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
    const HOURS=['09:00','11:00','13:00','15:00','17:00','19:00','21:00','23:00'];
    // занятость — детерминированная, чтобы не прыгала между перезагрузками
    const BUSY=[[1,4],[0,3,6],[2,5]];
    const today=new Date();
    const days=[0,1,2].map(o=>{
      const d=new Date(today); d.setDate(today.getDate()+o);
      return {d, label:o===0?'сегодня':(o===1?'завтра':WD[d.getDay()]), busy:BUSY[o]};
    });
    let di=0, si=null;

    function countFree(k){
      const now=new Date();
      return HOURS.filter((h,j)=>!days[k].busy.includes(j) && !(k===0 && parseInt(h,10)<=now.getHours())).length;
    }
    function renderDays(){
      daysEl.innerHTML=days.map((x,k)=>`
        <button class="day${k===di?' on':''}" role="tab" aria-selected="${k===di}" data-d="${k}">
          <span class="day-w">${x.label}</span>
          <span class="day-d">${x.d.getDate()} ${MN[x.d.getMonth()]}</span>
          <span class="day-f">${countFree(k)} слотов</span>
        </button>`).join('');
      daysEl.querySelectorAll('.day').forEach(b=>b.onclick=()=>{di=+b.dataset.d;si=null;renderDays();renderSlots();update();});
    }
    function past(k){
      if(di!==0) return false;
      const now=new Date();
      return parseInt(HOURS[k],10) <= now.getHours();
    }
    function free(k){ return !days[k].busy.length ? HOURS.length : 0; }
    function renderSlots(){
      const busy=days[di].busy;
      slotsEl.innerHTML=HOURS.map((h,k)=>{
        const off=busy.includes(k)||past(k);
        return `<button class="slot${si===k?' on':''}" data-s="${k}" ${off?'disabled aria-label="'+h+' недоступно"':''}>${h}</button>`;
      }).join('');
      slotsEl.querySelectorAll('.slot').forEach(b=>{
        if(b.disabled) return;
        b.onclick=()=>{si=+b.dataset.s;renderSlots();update();};
      });
    }
    function update(){
      if(si===null){
        pick.innerHTML='Выберите время — забронируем за 15 минут';
        cta.textContent='Забронировать';
        cta.href='https://t.me/picassostudio';
      }else{
        const x=days[di], t=HOURS[si];
        pick.innerHTML=`Выбрано: <b>${x.d.getDate()} ${MN[x.d.getMonth()]}, ${t}</b>`;
        cta.textContent='Забронировать это время';
        cta.href='https://t.me/picassostudio?text='+encodeURIComponent(
          `Здравствуйте! Хочу забронировать зал ${x.d.getDate()} ${MN[x.d.getMonth()]} в ${t}.`);
      }
    }
    renderDays(); renderSlots(); update();
  })();

  const io=new IntersectionObserver(es=>es.forEach(x=>{
    if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}
  }),{threshold:.07});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));
})();
