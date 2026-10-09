function sigSectors() { return window.SIG_activeSectors ? window.SIG_activeSectors() : []; }
function sigPartners() { return window.SIG_activePartners ? window.SIG_activePartners() : []; }

function sigClients() { return window.SIG_activeClients ? window.SIG_activeClients() : []; }

function padNum(n) { return String(n).padStart(2, '0'); }

function fillNav() {
  const sectors = sigSectors();
  const page = document.body.dataset.page || '';
  const sectorId = document.body.dataset.sector || '';
  const sectorActive = page === 'sectors' || !!sectorId;
  const mega = sectors.map(s =>
    `<a href="${s.url}"${s.id === sectorId ? ' class="active"' : ''}><span>${padNum(s.order)}</span>${s.nav}</a>`
  ).join('') + `<a href="sectors.html">View all sectors</a>`;

  document.querySelectorAll('[data-nav]').forEach(nav => {
    nav.innerHTML = `
      <a href="index.html"${page === 'home' ? ' class="active"' : ''}>Home</a>
      <a href="about.html"${page === 'about' ? ' class="active"' : ''}>About</a>
      <a href="services.html"${page === 'services' ? ' class="active"' : ''}>Services</a>
      <div class="nav-drop">
        <a href="sectors.html" class="nav-drop-toggle${sectorActive ? ' active' : ''}">Sectors
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </a>
        <div class="nav-mega">${mega}</div>
      </div>
      <a href="projects.html"${page === 'projects' ? ' class="active"' : ''}>Projects</a>
      <a href="partners.html"${page === 'partners' ? ' class="active"' : ''}>Partners</a>
      <a href="contact.html"${page === 'contact' ? ' class="active"' : ''}>Contact</a>`;
  });

  document.querySelectorAll('[data-mobile-nav]').forEach(panel => {
    const links = sectors.map(s => `<a href="${s.url}">${s.nav}</a>`).join('');
    panel.innerHTML = `
      <button class="mobile-close" aria-label="Close menu">&times;</button>
      <a href="index.html"${page === 'home' ? ' class="active"' : ''}>Home</a>
      <a href="about.html"${page === 'about' ? ' class="active"' : ''}>About</a>
      <a href="services.html"${page === 'services' ? ' class="active"' : ''}>Services</a>
      <button type="button" class="mobile-acc" data-mobile-sectors>Sectors <span>+</span></button>
      <div class="mobile-sub">${links}<a href="sectors.html">All sectors</a></div>
      <a href="projects.html"${page === 'projects' ? ' class="active"' : ''}>Projects</a>
      <a href="partners.html"${page === 'partners' ? ' class="active"' : ''}>Partners</a>
      <a href="contact.html"${page === 'contact' ? ' class="active"' : ''}>Contact</a>
      <a href="contact.html" class="btn btn--amber">Get in touch</a>`;
  });
}

function renderSectorCards(selector) {
  const host = document.querySelector(selector);
  if (!host) return;
  host.innerHTML = sigSectors().map(s => `
    <article class="biz-card reveal">
      <div class="biz-card-visual">
        <img src="${s.hero}" alt="${s.heroAlt}" loading="lazy">
        <span class="biz-num">${padNum(s.order)}</span>
      </div>
      <div class="biz-card-body">
        <h3>${s.title}</h3>
        <p>${s.card}</p>
        <a class="link-arrow" href="${s.url}">Learn more
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </div>
    </article>`).join('');
}

function orgTile(p) {
  const mark = p.logo
    ? `<div class="partner-logo"><img src="${p.logo}" alt="${p.name} logo" loading="lazy"></div>`
    : `<div class="partner-mark" aria-hidden="true">${p.initials}</div>`;
  return `
    <article class="partner-tile${p.logo ? ' has-logo' : ''}">
      ${mark}
      ${p.country ? `<span class="partner-country">${p.country}</span>` : ''}
      <h3>${p.name}</h3>
      <p>${p.blurb}</p>
    </article>`;
}

function renderPartners(selector) {
  const host = document.querySelector(selector);
  if (!host) return;
  const items = sigPartners();
  if (host.dataset.carousel === 'true') {
    host.innerHTML = `<div class="partner-track">${items.concat(items).map(orgTile).join('')}</div>`;
  } else {
    host.innerHTML = items.map(orgTile).join('');
  }
}

function renderClients(selector) {
  const host = document.querySelector(selector);
  if (!host) return;
  host.innerHTML = sigClients().map(orgTile).join('');
}

function renderLogoRow(selector) {
  const host = document.querySelector(selector);
  if (!host) return;
  const seen = new Set();
  host.innerHTML = sigPartners().concat(sigClients()).filter(o => o.logo && !seen.has(o.id) && seen.add(o.id)).map(o =>
    `<a class="logo-item" href="partners.html" title="${o.name}"><img src="${o.logo}" alt="${o.name}" loading="lazy"></a>`).join('');
}

function applyBackgrounds() {
  document.querySelectorAll('[data-bg]').forEach(el => {
    el.classList.add('has-bg');
    el.style.setProperty('--bg', `url("${el.dataset.bg}")`);
  });
}

function renderSectorPage() {
  const id = document.body.dataset.sector;
  if (!id) return;
  const s = sigSectors().find(x => x.id === id);
  const root = document.getElementById('sector-page');
  if (!s || !root) return;
  const gallery = (s.images || []).map(img => `
    <article class="gallery-card reveal in" data-src="${img.src}" data-title="${s.title}" data-category-label="${s.title}" data-desc="${img.alt}">
      <div class="gallery-thumb"><img src="${img.src}" alt="${img.alt}" loading="lazy"></div>
    </article>`).join('');
  const others = sigSectors().filter(x => x.id !== id).slice(0, 3).map(x => `
    <a class="biz-card" href="${x.url}">
      <div class="biz-card-visual"><img src="${x.hero}" alt="${x.heroAlt}" loading="lazy"></div>
      <div class="biz-card-body"><h3>${x.title}</h3><p>${x.card}</p></div>
    </a>`).join('');
  root.innerHTML = `
    <section class="page-hero">
      <div class="hero-media"><img src="${s.hero}" alt="${s.heroAlt}"></div>
      <div class="container">
        <p class="hero-badge">Sector ${padNum(s.order)}</p>
        <h1>${s.title}</h1>
        <p>${s.intro}</p>
      </div>
    </section>
    <section class="section">
      <div class="container split">
        <div class="reveal">
          <p class="eyebrow">Introduction</p>
          <h2>What this sector delivers.</h2>
          <p>${s.intro}</p>
          <p>${s.capabilities}</p>
          <a href="contact.html" class="btn btn--amber">Request an enquiry →</a>
        </div>
        <div class="split-media reveal"><img src="${s.hero}" alt="${s.heroAlt}"></div>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Services offered</p>
          <h2>Capabilities in ${s.title}.</h2>
        </div>
        <ul class="cap-list reveal">${(s.services || []).map(i => `<li>${i}</li>`).join('')}</ul>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Project applications</p>
          <h2>Where we apply this work.</h2>
        </div>
        <div class="grid grid-3 reveal">${(s.applications || []).map(i => `<div class="value-card"><h3>${i}</h3></div>`).join('')}</div>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        <div class="section-head center reveal">
          <p class="eyebrow">Relevant work</p>
          <h2>Project images</h2>
        </div>
        <div class="gallery-grid">${gallery}</div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Continue exploring</p>
          <h2>Other business sectors</h2>
        </div>
        <div class="related-sectors">${others}</div>
        <div style="text-align:center;margin-top:2rem;"><a class="link-arrow" href="sectors.html">All business sectors
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        <div class="cta-band reveal">
          <h2>Start a conversation.</h2>
          <p>Tell us about the site, programme and scope — we will bring in the right specialists.</p>
          <div class="cta-actions">
            <a href="contact.html" class="btn btn--amber">Contact / request a quotation →</a>
            <a href="tel:+251911533186" class="btn btn--ghost">+251 91 153 3186</a>
          </div>
        </div>
      </div>
    </section>`;
}

document.addEventListener('DOMContentLoaded', () => {
  fillNav();
  renderSectorCards('[data-sectors-grid]');
  renderPartners('[data-partners-grid]');
  renderClients('[data-clients-grid]');
  renderLogoRow('[data-logo-row]');
  applyBackgrounds();
  renderSectorPage();

  document.querySelectorAll('[data-mobile-sectors]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      sub?.classList.toggle('open');
      const mark = btn.querySelector('span');
      if (mark) mark.textContent = sub?.classList.contains('open') ? '–' : '+';
    });
  });

  const header = document.querySelector('.site-header');
  const top = document.querySelector('.scroll-top');
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 10);
    top?.classList.toggle('show', y > 500);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  top?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const toggle = document.querySelector('.nav-toggle');
  const mobile = document.querySelector('.mobile-nav');
  const close = document.querySelector('.mobile-close');
  toggle?.addEventListener('click', () => mobile?.classList.add('open'));
  close?.addEventListener('click', () => mobile?.classList.remove('open'));
  mobile?.addEventListener('click', (e) => { if (e.target === mobile) mobile.classList.remove('open'); });
  mobile?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobile.classList.remove('open')));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const acc = document.querySelectorAll('.acc-trigger');
  acc.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const panel = item.querySelector('.acc-panel');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
        i.querySelector('.acc-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // ============================================================
  // Project Gallery Filtering & Lightbox Modal
  // ============================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
  const lightbox = document.getElementById('projectLightbox');

  if (galleryCards.length && filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        galleryCards.forEach(card => {
          const cat = card.dataset.category || '';
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
            card.classList.add('in');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  if (lightbox) {
    const lbImg = lightbox.querySelector('#lightboxImg');
    const lbTitle = lightbox.querySelector('#lightboxTitle');
    const lbTag = lightbox.querySelector('#lightboxTag');
    const lbDesc = lightbox.querySelector('#lightboxDesc');
    const lbClose = lightbox.querySelector('.lightbox-close');
    const lbPrev = lightbox.querySelector('.lightbox-prev');
    const lbNext = lightbox.querySelector('.lightbox-next');
    const lbBackdrop = lightbox.querySelector('.lightbox-backdrop');

    let currentItems = [];
    let currentIndex = 0;

    const updateLightbox = (index) => {
      if (!currentItems.length) return;
      currentIndex = (index + currentItems.length) % currentItems.length;
      const el = currentItems[currentIndex];
      const src = el.dataset.src || el.querySelector('img')?.src;
      const title = el.dataset.title || el.querySelector('h3')?.textContent || 'Project View';
      const tag = el.dataset.categoryLabel || el.querySelector('.gallery-category')?.textContent || 'Project';
      const desc = el.dataset.desc || el.querySelector('p')?.textContent || '';

      if (lbImg) {
        lbImg.src = src;
        lbImg.alt = title;
      }
      if (lbTitle) lbTitle.textContent = title;
      if (lbTag) lbTag.textContent = tag;
      if (lbDesc) lbDesc.textContent = desc;
    };

    const openLightbox = (clickedEl) => {
      // Gather visible gallery cards or clickable items
      currentItems = galleryCards.filter(c => c.style.display !== 'none');
      if (!currentItems.length) {
        currentItems = Array.from(document.querySelectorAll('[data-lightbox]'));
      }
      const idx = currentItems.indexOf(clickedEl);
      updateLightbox(idx >= 0 ? idx : 0);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.gallery-card, [data-lightbox]').forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent lightbox if clicking a direct outbound link
        if (e.target.closest('a') && !e.target.closest('.gallery-card')) return;
        openLightbox(card);
      });
    });

    lbClose?.addEventListener('click', closeLightbox);
    lbBackdrop?.addEventListener('click', closeLightbox);
    lbPrev?.addEventListener('click', (e) => { e.stopPropagation(); updateLightbox(currentIndex - 1); });
    lbNext?.addEventListener('click', (e) => { e.stopPropagation(); updateLightbox(currentIndex + 1); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') updateLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') updateLightbox(currentIndex + 1);
    });
  }
});

