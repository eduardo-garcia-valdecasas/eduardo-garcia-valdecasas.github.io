(() => {
  'use strict';
  const es = document.documentElement.lang.startsWith('es');
  const words = es ? {
    showing:(n,total)=>`${n} de ${total} resultados`,none:'No hay resultados para esta búsqueda.'
  } : {
    showing:(n,total)=>`${n} of ${total} results`,none:'No results match this search.'
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
  document.querySelectorAll('[data-contact]').forEach(link=>{
    link.addEventListener('click',()=>{
      const address=link.dataset.contact.split('.').map(n=>String.fromCharCode(parseInt(n,36)^73)).join('');
      const subject=link.dataset.subject;
      link.href='mailto:'+address+(subject?'?subject='+encodeURIComponent(subject):'');
    });
  });
})();
