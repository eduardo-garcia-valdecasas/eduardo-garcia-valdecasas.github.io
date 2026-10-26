(() => {
  'use strict';
  const es = document.documentElement.lang.startsWith('es');
  const words = es ? {
    sending:'Enviando…',sent:'Gracias. Tu mensaje se ha enviado correctamente.',failed:'No se ha podido enviar el mensaje. Puedes escribir directamente por correo electrónico.',activation:'El envío de mensajes está pendiente de verificación. Por favor, utiliza el enlace de correo electrónico.',showing:(n,total)=>`${n} de ${total} resultados`,none:'No hay resultados para esta búsqueda.'
  } : {
    sending:'Sending…',sent:'Thank you. Your message has been sent.',failed:'The message could not be sent. You can email me directly using the link alongside the form.',activation:'Message delivery is awaiting verification. Please use the email link instead.',showing:(n,total)=>`${n} of ${total} results`,none:'No results match this search.'
  };
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-navigation');
  if (toggle && navigation) {
    const close = () => { toggle.setAttribute('aria-expanded','false'); navigation.classList.remove('open'); };
    toggle.addEventListener('click',()=>{
      const opened = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded',String(opened)); navigation.classList.toggle('open',opened);
    });
    navigation.addEventListener('click',e=>{ if(e.target.closest('a'))close(); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape' && toggle.getAttribute('aria-expanded')==='true'){close();toggle.focus();} });
    window.addEventListener('resize',()=>{if(window.innerWidth>650)close();});
  }
  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  document.querySelectorAll('[data-filter-list]').forEach(section=>{
    const input=section.querySelector('[data-search]');
    const items=[...section.querySelectorAll('[data-search-text]')];
    const count=section.querySelector('[data-results]');
    const empty=section.querySelector('.empty-results');
    let year='all';
    const update=()=>{
      const query=normalize(input?.value.trim()??'');let n=0;
      items.forEach(item=>{
        const match=normalize(item.dataset.searchText).includes(query) && (year==='all'||year==='earlier'&&Number(item.dataset.year)<2024||item.dataset.year===year);
        item.hidden=!match;if(match)n++;
      });
      if(count)count.textContent=words.showing(n,items.length);
      if(empty){empty.hidden=n>0;empty.textContent=words.none;}
      section.querySelectorAll('.talk-year').forEach(group=>{
        const visible=[...group.querySelectorAll('[data-search-text]')].filter(i=>!i.hidden).length;
        group.hidden=visible===0;
        group.open=query?visible>0:group.dataset.defaultOpen==='true';
      });
    };
    input?.addEventListener('input',update);
    section.querySelectorAll('[data-year-filter]').forEach(button=>button.addEventListener('click',()=>{
      year=button.dataset.yearFilter;
      section.querySelectorAll('[data-year-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      update();
    }));
    update();
  });
  document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>{
    if(!/^[A-Za-z0-9_-]{11}$/.test(button.dataset.video))return;
    const player=document.createElement('div');player.className='video-player';
    const iframe=document.createElement('iframe');
    iframe.title=button.dataset.videoTitle;
    iframe.src=`https://www.youtube-nocookie.com/embed/${button.dataset.video}?autoplay=1&rel=0`;
    iframe.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';
    player.append(iframe);button.replaceWith(player);iframe.focus();
  }));
  document.querySelectorAll('.contact-form').forEach(form=>{
    const status=form.querySelector('.form-status');
    const submit=form.querySelector('button[type="submit"]');
    const defaultLabel=submit?.innerHTML;
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      if(form.elements.namedItem('_honey')?.value)return;
      status.textContent=words.sending;status.classList.remove('error');submit.disabled=true;
      const payload=Object.fromEntries(new FormData(form));
      payload._url=location.href;
      try {
        const response=await fetch(form.action.replace('formsubmit.co/','formsubmit.co/ajax/'),{
          method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)
        });
        const result=await response.json();
        if(!response.ok || ![true,'true'].includes(result.success))throw new Error('Delivery failed');
        if(/activat|verif|confirm your email/i.test(result.message??'')){
          status.textContent=words.activation;status.classList.add('error');
        }else{status.textContent=words.sent;form.reset();}
      } catch { status.textContent=words.failed;status.classList.add('error'); }
      finally {submit.disabled=false;submit.innerHTML=defaultLabel;}
    });
  });
})();
