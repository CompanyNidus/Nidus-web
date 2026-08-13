/* ── Data ─────────────────────────────────────────────────────────────── */

const IMG = {
  warehouse: '../src/imports/WhatsApp_Image_2026-08-11_at_4.23.59_PM__1_.jpeg',
  shelves:   '../src/imports/WhatsApp_Image_2026-08-11_at_4.23.59_PM.jpeg',
  floor:     '../src/imports/WhatsApp_Image_2026-08-11_at_4.24.00_PM.jpeg',
  blueEggs:  '../src/imports/WhatsApp_Image_2026-08-11_at_4.24.05_PM.jpeg',
  wall:      '../src/imports/WhatsApp_Image_2026-08-11_at_4.24.10_PM.jpeg',
};

const PRODUCTS = [
  { id: 1, name: 'Huevos AA', presentation: 'Cartón × 12', weight: 'Tamaño grande',
    price: 'Precio a consultar', category: 'detal', badge: 'Más pedido',
    desc: 'Huevos frescos de primera calidad, ideales para el hogar y el consumo diario.',
    img: IMG.blueEggs },
  { id: 2, name: 'Huevos A', presentation: 'Cartón × 6', weight: 'Tamaño mediano',
    price: 'Precio a consultar', category: 'detal', badge: null,
    desc: 'El tamaño perfecto para el consumo familiar sin desperdicios.',
    img: IMG.floor },
  { id: 3, name: 'Cubeta Estándar', presentation: 'Cubeta × 30', weight: 'Tamaño A',
    price: 'Precio a consultar', category: 'mayorista', badge: 'Para negocios',
    desc: 'Para negocios que necesitan calidad constante y volumen confiable.',
    img: IMG.warehouse },
  { id: 4, name: 'Caja Mayorista', presentation: 'Caja × 180', weight: 'Surtido AA / A',
    price: 'Precio a consultar', category: 'mayorista', badge: 'Mayorista',
    desc: 'La solución perfecta para distribuidores y operaciones de gran volumen.',
    img: IMG.wall },
  { id: 5, name: 'Huevo Jumbo', presentation: 'Cartón × 12', weight: 'Extragrande',
    price: 'Precio a consultar', category: 'detal', badge: null,
    desc: 'Nuestros huevos más grandes, con mayor contenido proteico por unidad.',
    img: IMG.blueEggs },
  { id: 6, name: 'Pack Restaurante', presentation: '5 cubetas × 30', weight: 'A / AA',
    price: 'Precio a consultar', category: 'mayorista', badge: 'Chef favorito',
    desc: 'Pensado para cocinas profesionales con flujo constante de producción.',
    img: IMG.shelves },
];

const CITIES = [
  { name: 'Bogotá',       x: 52, y: 58, primary: true  },
  { name: 'Medellín',     x: 37, y: 43, primary: true  },
  { name: 'Cali',         x: 33, y: 65, primary: true  },
  { name: 'Barranquilla', x: 44, y: 16, primary: true  },
  { name: 'Bucaramanga',  x: 54, y: 36, primary: false },
  { name: 'Pereira',      x: 37, y: 54, primary: false },
  { name: 'Cartagena',    x: 33, y: 13, primary: false },
  { name: 'Manizales',    x: 40, y: 51, primary: false },
  { name: 'Ibagué',       x: 48, y: 60, primary: false },
  { name: 'Villavicencio',x: 60, y: 61, primary: false },
];

const BIZ_TYPES = [
  { id: 'restaurante', base: 50  },
  { id: 'panaderia',   base: 80  },
  { id: 'hotel',       base: 35  },
  { id: 'tienda',      base: 20  },
  { id: 'super',       base: 150 },
  { id: 'dist',        base: 300 },
];
const BIZ_SIZES = [
  { id: 'p', m: 1   },
  { id: 'm', m: 2.5 },
  { id: 'g', m: 5   },
];
const BIZ_FREQ = [
  { id: 'd', f: 7   },
  { id: 's', f: 1   },
  { id: 'q', f: 0.5 },
];

/* ── State ────────────────────────────────────────────────────────────── */

let productFilter  = 'todos';
let chooseMode     = 'detal';
let calcState      = { btype: null, bsize: null, freq: null };
let testimonialIdx = 0;
let countersStarted = false;
let distHover      = null;
let dragStart      = 0;
let dragging       = false;

/* ── Helpers ──────────────────────────────────────────────────────────── */

function qs(sel, ctx = document) { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function animCounter(el, target, dur = 1800) {
  const t0 = Date.now();
  const fmt = n => n.toLocaleString('es-CO');
  function tick() {
    const p = Math.min((Date.now() - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.round(eased * target));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ── IntersectionObserver setup ───────────────────────────────────────── */

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

qsa('.reveal').forEach(el => revealObs.observe(el));

/* ── Counters (stats section) ─────────────────────────────────────────── */

const statsSection = qs('#stats-grid');
if (statsSection) {
  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        qsa('.stat-item', statsSection).forEach(item => {
          const numEl  = qs('.stat-num', item);
          const target = parseInt(item.dataset.target, 10);
          animCounter(numEl, target);
        });
        statsObs.disconnect();
      }
    });
  }, { threshold: 0.18 });
  statsObs.observe(statsSection);
}

/* ── Navbar ───────────────────────────────────────────────────────────── */

const navbar    = qs('#navbar');
const hamburger = qs('#hamburger');
const mobileMenu = qs('#mobile-menu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('navbar--scrolled');
  } else {
    navbar.classList.remove('navbar--scrolled');
  }
}, { passive: true });

hamburger && hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileMenu.classList.toggle('mobile-menu--open', open);
  mobileMenu.setAttribute('aria-hidden', !open);
});

qsa('.mobile-link').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('mobile-menu--open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

/* ── Hero parallax ────────────────────────────────────────────────────── */

const heroSection = qs('#hero');
const heroWm1 = qs('#hero-wm-1');
const heroWm2 = qs('#hero-wm-2');
const heroPhotoInner = qs('#hero-photo-inner');

heroSection && heroSection.addEventListener('mousemove', (e) => {
  const r = heroSection.getBoundingClientRect();
  const mx = (e.clientX - r.left - r.width / 2)  / r.width;
  const my = (e.clientY - r.top  - r.height / 2) / r.height;
  if (heroWm1) heroWm1.style.transform = `translate(${mx * -22}px, ${my * -14}px)`;
  if (heroWm2) heroWm2.style.transform = `translate(${mx * 18}px, ${my * 12}px)`;
  if (heroPhotoInner) heroPhotoInner.style.transform = `translate(${mx * -14}px, ${my * -8}px)`;
});

/* ── Hero photo tooltip ───────────────────────────────────────────────── */

const heroPhotoClip = qs('#hero-photo-clip');
const heroPhotoTip  = qs('#hero-photo-tip');

if (heroPhotoClip && heroPhotoTip) {
  heroPhotoClip.addEventListener('mouseenter', () => {
    heroPhotoTip.style.opacity = '1';
    heroPhotoTip.style.transform = 'translateX(-50%) translateY(0)';
  });
  heroPhotoClip.addEventListener('mouseleave', () => {
    heroPhotoTip.style.opacity = '0';
    heroPhotoTip.style.transform = 'translateX(-50%) translateY(10px)';
  });
}

/* ── Choose toggle ────────────────────────────────────────────────────── */

const toggleBtns  = qsa('.toggle-btn');
const panelDetal  = qs('#choose-detal');
const panelMayor  = qs('#choose-mayorista');
const chooseImg   = qs('#choose-img');
const chooseImgClip = qs('#choose-img-clip');

function setChooseMode(mode) {
  chooseMode = mode;
  toggleBtns.forEach(btn => {
    const active = btn.dataset.mode === mode;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active);
  });

  if (mode === 'detal') {
    panelDetal.classList.remove('hidden');
    panelMayor.classList.add('hidden');
    if (chooseImg) {
      chooseImg.src = IMG.blueEggs;
      chooseImg.alt = 'Cubeta de huevos frescos azules y marrones para el hogar';
    }
    if (chooseImgClip) chooseImgClip.classList.remove('mayorista');
  } else {
    panelDetal.classList.add('hidden');
    panelMayor.classList.remove('hidden');
    if (chooseImg) {
      chooseImg.src = IMG.warehouse;
      chooseImg.alt = 'Bodega Nidus con cubetas listas para distribución mayorista';
    }
    if (chooseImgClip) chooseImgClip.classList.add('mayorista');
  }

  [panelDetal, panelMayor].forEach(p => {
    if (!p.classList.contains('hidden')) {
      p.style.animation = 'none';
      p.offsetHeight; // reflow
      p.style.animation = 'fade-up 0.45s ease both';
    }
  });
}

toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => setChooseMode(btn.dataset.mode));
});

/* ── Products grid ────────────────────────────────────────────────────── */

const productsGrid = qs('#products-grid');

function renderProducts() {
  if (!productsGrid) return;
  const shown = productFilter === 'todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === productFilter);

  productsGrid.innerHTML = shown.map((p, i) => `
    <article class="product-card reveal"
      style="transition-delay: ${i * 0.09}s"
      data-id="${p.id}"
      data-category="${p.category}">
      <div class="product-card__img-wrap">
        <img src="${p.img}" alt="${p.name} — ${p.presentation}" class="product-card__img" loading="lazy">
        <div class="product-card__img-overlay"></div>
        ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ''}
      </div>
      <div class="product-card__body">
        <div class="product-card__meta">${p.presentation} · ${p.weight}</div>
        <h3 class="product-card__title">${p.name}</h3>
        <p class="product-card__desc">${p.desc}</p>
        <div class="product-card__footer">
          <span class="product-card__price">${p.price}</span>
          <button class="product-card__btn" aria-label="Ver detalles de ${p.name}">
            Ver más <span class="product-card__btn-icon">+</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  qsa('.product-card', productsGrid).forEach(card => {
    revealObs.observe(card);
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id, 10);
      const product = PRODUCTS.find(p => p.id === id);
      openModal(product);
    });
  });
}

qsa('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    productFilter = btn.dataset.filter;
    qsa('.filter-btn').forEach(b => {
      const a = b.dataset.filter === productFilter;
      b.classList.toggle('active', a);
      b.setAttribute('aria-pressed', a);
    });
    renderProducts();
  });
});

renderProducts();

/* ── Modal ────────────────────────────────────────────────────────────── */

const modalOverlay = qs('#modal-overlay');
const modalClose   = qs('#modal-close');

function openModal(product) {
  qs('#modal-img').src  = product.img;
  qs('#modal-img').alt  = product.name;
  qs('#modal-meta').textContent  = `${product.presentation} · ${product.weight}`;
  qs('#modal-title').textContent = product.name;
  qs('#modal-desc').textContent  = product.desc;
  modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
}

modalClose && modalClose.addEventListener('click', closeModal);
modalOverlay && modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ── Calculator ───────────────────────────────────────────────────────── */

const calcResult  = qs('#calc-result');
const step2       = qs('#calc-step-2');
const step3       = qs('#calc-step-3');

function updateCalcResult() {
  if (!calcState.btype || !calcState.bsize || !calcState.freq) return;
  const bt = BIZ_TYPES.find(b => b.id === calcState.btype);
  const bs = BIZ_SIZES.find(s => s.id === calcState.bsize);
  const fr = BIZ_FREQ.find(f => f.id === calcState.freq);
  const weekly  = Math.round(bt.base * bs.m * fr.f);
  const cubetas = Math.ceil(weekly / 30);
  const cajas   = Math.ceil(weekly / 180);
  const bizName = qs(`[data-val="${calcState.btype}"]`, qs('#calc-step-1')).textContent.toLowerCase();

  qs('#result-biz').textContent     = bizName;
  qs('#result-cubetas').textContent = `${cubetas} cubetas`;
  qs('#result-weekly').textContent  = `≈ ${weekly.toLocaleString('es-CO')} huevos / semana`;
  qs('#result-cajas').textContent   = `≈ ${cajas} cajas de 180`;

  calcResult.classList.remove('hidden');
  calcResult.style.animation = 'none';
  calcResult.offsetHeight;
  calcResult.style.animation = 'fade-up 0.4s ease both';
}

qsa('.calc-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    if (chip.disabled) return;
    const step = chip.dataset.step;
    calcState[step] = chip.dataset.val;

    qsa(`[data-step="${step}"]`).forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');

    if (step === 'btype') {
      step2.classList.remove('disabled');
      qsa('[data-step="bsize"]').forEach(c => { c.disabled = false; });
    }
    if (step === 'bsize') {
      step3.classList.remove('disabled');
      qsa('[data-step="freq"]').forEach(c => { c.disabled = false; });
    }
    if (step === 'freq') {
      updateCalcResult();
    }
  });
});

/* ── Distribution map ─────────────────────────────────────────────────── */

const mapLines = qs('#map-lines');
const mapDots  = qs('#map-dots');
const cityChips = qsa('.city-chip');

function renderMapDots(hovered = null) {
  if (!mapDots) return;
  mapDots.innerHTML = '';
  CITIES.forEach((c, i) => {
    const x = c.x * 2.32 + 16;
    const y = c.y * 3.1 + 10;
    const on = hovered === c.name;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    if (c.primary) {
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', x);
      ring.setAttribute('cy', y);
      ring.setAttribute('r', on ? 11 : 7);
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', on ? 'rgba(139,46,26,0.6)' : 'rgba(139,46,26,0.2)');
      ring.setAttribute('stroke-width', 0.9);
      ring.style.transition = 'all 0.3s ease';
      g.appendChild(ring);
    }

    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', x);
    dot.setAttribute('cy', y);
    dot.setAttribute('r', c.primary ? (on ? 5.5 : 3.5) : (on ? 3.5 : 2));
    dot.setAttribute('fill', on ? '#D4890A' : c.primary ? '#8B2E1A' : 'rgba(139,46,26,0.45)');
    dot.style.cursor = 'pointer';
    dot.style.animation = `dot-pop 0.5s ease ${i * 0.11}s both`;
    g.appendChild(dot);

    if (on || c.primary) {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', x + 7);
      label.setAttribute('y', y + 4);
      label.setAttribute('font-size', on ? 7.5 : 5.5);
      label.setAttribute('fill', on ? 'rgba(250,247,242,0.9)' : 'rgba(250,247,242,0.45)');
      label.setAttribute('font-family', 'Outfit, sans-serif');
      label.style.pointerEvents = 'none';
      label.textContent = c.name;
      g.appendChild(label);
    }

    g.addEventListener('mouseenter', () => {
      distHover = c.name;
      renderMapDots(c.name);
      cityChips.forEach(chip => {
        chip.classList.toggle('active', chip.dataset.city === c.name);
      });
    });
    g.addEventListener('mouseleave', () => {
      distHover = null;
      renderMapDots(null);
      cityChips.forEach(chip => chip.classList.remove('active'));
    });

    mapDots.appendChild(g);
  });
}

function renderMapLines() {
  if (!mapLines) return;
  mapLines.innerHTML = '';
  CITIES.forEach(c => {
    const x = c.x * 2.32 + 16;
    const y = c.y * 3.1 + 10;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', 130); line.setAttribute('y1', 185);
    line.setAttribute('x2', x);   line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(139,46,26,0.12)');
    line.setAttribute('stroke-width', 0.7);
    line.setAttribute('stroke-dasharray', '3 4');
    mapLines.appendChild(line);
  });
}

const distSection = qs('#nosotros');
if (distSection) {
  const distObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        renderMapLines();
        renderMapDots(null);
        distObs.disconnect();
      }
    });
  }, { threshold: 0.08 });
  distObs.observe(distSection);
}

cityChips.forEach(chip => {
  chip.addEventListener('mouseenter', () => {
    cityChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    renderMapDots(chip.dataset.city);
  });
  chip.addEventListener('mouseleave', () => {
    chip.classList.remove('active');
    renderMapDots(null);
  });
});

/* ── Testimonials ─────────────────────────────────────────────────────── */

const testimonialCards = qsa('.testimonial-card');
const testimonialDots  = qsa('.t-dot');

function setTestimonial(idx) {
  testimonialIdx = (idx + testimonialCards.length) % testimonialCards.length;
  testimonialCards.forEach((card, i) => card.classList.toggle('active', i === testimonialIdx));
  testimonialDots.forEach((dot, i) => dot.classList.toggle('active', i === testimonialIdx));
}

setTestimonial(0);

testimonialCards.forEach((card, i) => {
  card.addEventListener('click', () => setTestimonial(i));
});
testimonialDots.forEach((dot, i) => {
  dot.addEventListener('click', () => setTestimonial(i));
});

const testimonialTrack = qs('#testimonials-track');
if (testimonialTrack) {
  testimonialTrack.addEventListener('mousedown', (e) => { dragging = true; dragStart = e.clientX; });
  testimonialTrack.addEventListener('mouseup', (e) => {
    if (!dragging) return;
    dragging = false;
    const d = e.clientX - dragStart;
    if (Math.abs(d) > 50) setTestimonial(d < 0 ? testimonialIdx + 1 : testimonialIdx - 1);
  });
  testimonialTrack.addEventListener('mouseleave', () => { dragging = false; });
  testimonialTrack.addEventListener('touchstart', (e) => { dragStart = e.touches[0].clientX; }, { passive: true });
  testimonialTrack.addEventListener('touchend', (e) => {
    const d = e.changedTouches[0].clientX - dragStart;
    if (Math.abs(d) > 50) setTestimonial(d < 0 ? testimonialIdx + 1 : testimonialIdx - 1);
  });
}

/* ── CTA parallax ─────────────────────────────────────────────────────── */

const ctaSection = qs('#contacto');
const ctaDeco1   = qs('#cta-deco-1');
const ctaDeco2   = qs('#cta-deco-2');
const ctaDeco3   = qs('#cta-deco-3');

ctaSection && ctaSection.addEventListener('mousemove', (e) => {
  const r = ctaSection.getBoundingClientRect();
  const mx = (e.clientX - r.left - r.width / 2)  / r.width;
  const my = (e.clientY - r.top  - r.height / 2) / r.height;
  if (ctaDeco1) ctaDeco1.style.transform = `translate(${mx * 22}px, ${my * 14}px)`;
  if (ctaDeco2) ctaDeco2.style.transform = `translate(${mx * -20}px, ${my * -12}px)`;
  if (ctaDeco3) ctaDeco3.style.transform = `translate(${mx * 30}px, ${my * -20}px)`;
});
