import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type RefObject,
} from 'react'

// ─── Image imports (real Nidus photos) ───────────────────────────────────────
import imgWarehouse from '@/imports/WhatsApp_Image_2026-08-11_at_4.23.59_PM__1_.jpeg'
import imgShelves from '@/imports/WhatsApp_Image_2026-08-11_at_4.23.59_PM.jpeg'
import imgFloor from '@/imports/WhatsApp_Image_2026-08-11_at_4.24.00_PM.jpeg'
import imgBlueEggs from '@/imports/WhatsApp_Image_2026-08-11_at_4.24.05_PM.jpeg'
import imgWall from '@/imports/WhatsApp_Image_2026-08-11_at_4.24.10_PM.jpeg'

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    id: 1, name: 'Huevos AA', presentation: 'Cartón × 12', weight: 'Tamaño grande',
    price: 'Precio a consultar', category: 'detal' as const,
    badge: 'Más pedido',
    desc: 'Huevos frescos de primera calidad, ideales para el hogar y el consumo diario.',
    img: imgBlueEggs,
  },
  {
    id: 2, name: 'Huevos A', presentation: 'Cartón × 6', weight: 'Tamaño mediano',
    price: 'Precio a consultar', category: 'detal' as const,
    desc: 'El tamaño perfecto para el consumo familiar sin desperdicios.',
    img: imgFloor,
  },
  {
    id: 3, name: 'Cubeta Estándar', presentation: 'Cubeta × 30', weight: 'Tamaño A',
    price: 'Precio a consultar', category: 'mayorista' as const,
    badge: 'Para negocios',
    desc: 'Para negocios que necesitan calidad constante y volumen confiable.',
    img: imgWarehouse,
  },
  {
    id: 4, name: 'Caja Mayorista', presentation: 'Caja × 180', weight: 'Surtido AA / A',
    price: 'Precio a consultar', category: 'mayorista' as const,
    badge: 'Mayorista',
    desc: 'La solución perfecta para distribuidores y operaciones de gran volumen.',
    img: imgWall,
  },
  {
    id: 5, name: 'Huevo Jumbo', presentation: 'Cartón × 12', weight: 'Extragrande',
    price: 'Precio a consultar', category: 'detal' as const,
    desc: 'Nuestros huevos más grandes, con mayor contenido proteico por unidad.',
    img: imgBlueEggs,
  },
  {
    id: 6, name: 'Pack Restaurante', presentation: '5 cubetas × 30', weight: 'A / AA',
    price: 'Precio a consultar', category: 'mayorista' as const,
    badge: 'Chef favorito',
    desc: 'Pensado para cocinas profesionales con flujo constante de producción.',
    img: imgShelves,
  },
]

const TESTIMONIALS = [
  { name: 'Carolina M.', biz: 'Restaurante La Cazuela', city: 'Bogotá', type: 'Restaurante',
    text: 'Llevamos más de dos años con Nidus. La calidad es impecable y la entrega siempre puntual. Para un restaurante, eso lo es todo.' },
  { name: 'Andrés F.', biz: 'Panadería El Trigal', city: 'Medellín', type: 'Panadería',
    text: 'Nidus transformó nuestra operación. Calidad constante, sin sorpresas. Nuestros clientes lo notan en cada producto que hacemos.' },
  { name: 'María José V.', biz: 'Hotel Camino Real', city: 'Cali', type: 'Hotel',
    text: 'Atención excepcional. Siempre disponibles, siempre con soluciones. El proveedor que necesita un hotel de nuestra categoría.' },
]

const QUALITY_CARDS = [
  { sym: '◎', title: 'Frescura', sub: 'Garantizada',
    desc: 'Recolección diaria y entrega en menos de 24 horas. Cadena de temperatura controlada en cada paso.',
    tags: ['Recolección diaria', 'Cadena de frío', 'Entrega exprés'] },
  { sym: '◈', title: 'Calidad', sub: 'Clasificada',
    desc: 'Selección manual por calibre, peso y calidad de cáscara. Solo pasan los mejores.',
    tags: ['Calibre AA', 'Calibre A', 'Control riguroso'] },
  { sym: '◇', title: 'Distribución', sub: 'Puntual',
    desc: 'Flota propia con rutas optimizadas. Tu negocio siempre tendrá stock, sin interrupciones.',
    tags: ['Flota propia', 'Ruta optimizada', 'Cobertura regional'] },
  { sym: '◉', title: 'Confianza', sub: 'Probada',
    desc: 'Años de trayectoria conectando productores con negocios y hogares. Entrega a entrega.',
    tags: ['Trayectoria sólida', 'Clientes satisfechos', 'Contrato flexible'] },
]

const STAGES = [
  { n: '01', t: 'Origen', d: 'Todo comienza en granjas cuidadosamente seleccionadas con estrictos estándares de bienestar animal y alimentación balanceada.' },
  { n: '02', t: 'Calidad', d: 'Cada huevo pasa por un proceso de clasificación que evalúa calibre, integridad de cáscara y frescura. Sin excepciones.' },
  { n: '03', t: 'Selección', d: 'Clasificamos por tamaño y calidad para que cada pedido llegue exactamente como lo necesitas, cada vez.' },
  { n: '04', t: 'Distribución', d: 'Nuestra flota lleva el producto con temperatura controlada, de manera eficiente y en el tiempo acordado.' },
  { n: '05', t: 'Tu mesa', d: 'Del campo a tu cocina o tu negocio. Nidus cierra el ciclo con calidad intacta y frescura garantizada.' },
]

const CITIES = [
  { name: 'Bogotá', x: 52, y: 58, primary: true },
  { name: 'Medellín', x: 37, y: 43, primary: true },
  { name: 'Cali', x: 33, y: 65, primary: true },
  { name: 'Barranquilla', x: 44, y: 16, primary: true },
  { name: 'Bucaramanga', x: 54, y: 36, primary: false },
  { name: 'Pereira', x: 37, y: 54, primary: false },
  { name: 'Cartagena', x: 33, y: 13, primary: false },
  { name: 'Manizales', x: 40, y: 51, primary: false },
  { name: 'Ibagué', x: 48, y: 60, primary: false },
  { name: 'Villavicencio', x: 60, y: 61, primary: false },
]

const BIZ_TYPES = [
  { id: 'restaurante', l: 'Restaurante', base: 50 },
  { id: 'panaderia',   l: 'Panadería',   base: 80 },
  { id: 'hotel',       l: 'Hotel',        base: 35 },
  { id: 'tienda',      l: 'Tienda',       base: 20 },
  { id: 'super',       l: 'Supermercado', base: 150 },
  { id: 'dist',        l: 'Distribuidor', base: 300 },
]
const BIZ_SIZES = [
  { id: 'p', l: 'Pequeño', m: 1 },
  { id: 'm', l: 'Mediano', m: 2.5 },
  { id: 'g', l: 'Grande',  m: 5 },
]
const BIZ_FREQ = [
  { id: 'd', l: 'Diario',    f: 7 },
  { id: 's', l: 'Semanal',   f: 1 },
  { id: 'q', l: 'Quincenal', f: 0.5 },
]

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const h = () => setY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return y
}

function useMouse(ref: RefObject<HTMLElement | null>) {
  const [p, setP] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const h = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      setP({ x: (e.clientX - r.left - r.width / 2) / r.width,
             y: (e.clientY - r.top - r.height / 2) / r.height })
    }
    el.addEventListener('mousemove', h)
    return () => el.removeEventListener('mousemove', h)
  }, [ref])
  return p
}

function useVisible(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, vis }
}

function useCounter(target: number, active: boolean, dur = 1800) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!active) return
    const t0 = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1)
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target, dur])
  return v
}

// ─── Nidus Logo SVG ───────────────────────────────────────────────────────────
// Faithful recreation of the rooster-in-circle monoline mark from the brand logo

function NidusLogoMark({
  size = 56,
  color = '#8B2E1A',
  className = '',
}: { size?: number; color?: string; className?: string }) {
  const sw = size * 0.055
  const sw2 = size * 0.045
  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 100 110"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Main circle — the nest / body */}
      <circle cx="50" cy="67" r="36" strokeWidth={sw} />

      {/* Wing / breast S-curve inside circle */}
      <path
        d="M 14 82 C 26 64 40 84 50 67 C 60 50 74 70 86 56"
        strokeWidth={sw}
      />

      {/* Hen head — small rounded oval facing right */}
      <path
        d="M 56 30 C 56 21 64 16 72 20 C 80 24 82 33 79 40 C 77 47 68 51 61 47 C 54 43 52 39 56 30 Z"
        strokeWidth={sw}
      />

      {/* Comb — two-peak wavy crest */}
      <path
        d="M 57 26 C 55 16 60 11 62 18 C 64 11 68 13 67 22"
        strokeWidth={sw2}
      />

      {/* Eye */}
      <circle cx="72" cy="28" r={size * 0.032} fill={color} stroke="none" />

      {/* Beak */}
      <path
        d="M 80 34 L 89 37 L 80 41"
        strokeWidth={sw2}
      />

      {/* Wattle */}
      <path
        d="M 77 44 C 83 51 77 58 72 55"
        strokeWidth={sw2}
      />
    </svg>
  )
}

// ─── Nidus Wordmark ───────────────────────────────────────────────────────────

function NidusWordmark({ size = 22 }: { size?: number }) {
  return (
    <span
      style={{
        fontFamily: 'Fraunces, serif',
        fontWeight: 900,
        fontSize: size,
        letterSpacing: '-0.01em',
        lineHeight: 1,
      }}
    >
      <span style={{ color: '#3D4958' }}>N</span>
      <span style={{ color: '#8B2E1A' }}>IDUS</span>
      <span style={{ color: '#8B2E1A', fontSize: size * 0.55, verticalAlign: 'super' }}>°</span>
    </span>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ scrollY }: { scrollY: number }) {
  const [open, setOpen] = useState(false)
  const scrolled = scrollY > 60

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(250,247,242,0.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(139,46,26,0.1)' : 'transparent'}`,
        boxShadow: scrolled ? '0 2px 20px rgba(26,21,16,0.05)' : 'none',
      }}
    >
      <nav
        className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"
        role="navigation"
        aria-label="Navegación principal"
      >
        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5" aria-label="Nidus — inicio">
          <NidusLogoMark size={38} color="#8B2E1A" />
          <NidusWordmark size={20} />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {[['#productos', 'Productos'], ['#mayoristas', 'Mayoristas'], ['#calidad', 'Calidad'], ['#nosotros', 'Nosotros'], ['#contacto', 'Contacto']].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--terra)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          className="hidden md:block px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-250"
          style={{ backgroundColor: 'var(--terra)', color: 'var(--cream-lt)', fontFamily: 'Outfit, sans-serif' }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--terra-br)'
            ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(139,46,26,0.28)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--terra)'
            ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
          }}
        >
          Comprar ahora
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 flex flex-col gap-1.5"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="block w-6 h-0.5 transition-all duration-300"
              style={{
                backgroundColor: 'var(--terra)',
                transform: i === 0 && open ? 'rotate(45deg) translateY(8px)' : i === 2 && open ? 'rotate(-45deg) translateY(-8px)' : 'none',
                opacity: i === 1 && open ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        style={{
          maxHeight: open ? '380px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
          backgroundColor: 'rgba(250,247,242,0.97)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="px-6 pb-6 pt-2 flex flex-col gap-4">
          {[['#productos', 'Productos'], ['#mayoristas', 'Mayoristas'], ['#calidad', 'Calidad'], ['#nosotros', 'Nosotros'], ['#contacto', 'Contacto']].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-base py-2.5 border-b font-medium"
              style={{ color: 'var(--slate)', fontFamily: 'Outfit, sans-serif', borderColor: 'var(--border)' }}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <button
            className="mt-1 px-5 py-3 rounded-full text-sm font-semibold"
            style={{ backgroundColor: 'var(--terra)', color: 'var(--cream-lt)', fontFamily: 'Outfit, sans-serif' }}
          >
            Comprar ahora
          </button>
        </div>
      </div>
    </header>
  )
}

// ─── Pill button ──────────────────────────────────────────────────────────────

function Btn({
  children, primary = true, onClick,
}: { children: ReactNode; primary?: boolean; onClick?: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      className="px-7 py-4 rounded-full font-semibold text-base transition-all duration-300 flex items-center gap-2"
      style={{
        fontFamily: 'Outfit, sans-serif',
        backgroundColor: primary ? (hov ? '#A53822' : '#8B2E1A') : 'transparent',
        color: primary ? '#FAF7F2' : hov ? '#8B2E1A' : '#3D4958',
        border: primary ? 'none' : `2px solid ${hov ? '#8B2E1A' : 'rgba(61,73,88,0.28)'}`,
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov && primary ? '0 8px 28px rgba(139,46,26,0.28)' : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const m = useMouse(heroRef)
  const [imgHov, setImgHov] = useState(false)

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: 'var(--cream-lt)' }}
      aria-label="Bienvenida a Nidus"
    >
      {/* Decorative logo marks — watermark layer */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '5%', right: '2%',
          transform: `translate(${m.x * -22}px,${m.y * -14}px)`,
          transition: 'transform 0.12s ease-out',
          opacity: 0.06,
        }}
      >
        <NidusLogoMark size={320} color="#8B2E1A" />
      </div>
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '10%', left: '2%',
          transform: `translate(${m.x * 18}px,${m.y * 12}px)`,
          transition: 'transform 0.12s ease-out',
          opacity: 0.04,
          animation: 'float 7s ease-in-out infinite',
        }}
      >
        <NidusLogoMark size={180} color="#8B2E1A" />
      </div>

      {/* Right: egg photo with organic clip */}
      <div
        className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center"
        style={{ width: '48%' }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            transform: `translate(${m.x * -14}px,${m.y * -8}px)`,
            transition: 'transform 0.16s ease-out',
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              width: 420, height: 540,
              borderRadius: '50% 50% 50% 50% / 38% 38% 62% 62%',
              transform: imgHov ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)',
              boxShadow: imgHov
                ? '0 0 80px rgba(139,46,26,0.18), 0 40px 80px rgba(26,21,16,0.12)'
                : '0 30px 60px rgba(26,21,16,0.1)',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setImgHov(true)}
            onMouseLeave={() => setImgHov(false)}
          >
            <img
              src={imgBlueEggs}
              alt="Huevos frescos en cubeta — azules y marrones — de Nidus"
              className="w-full h-full object-cover"
              style={{
                transform: imgHov ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.7s ease-out',
                filter: 'brightness(0.96) contrast(1.05) saturate(1.1)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(242,236,227,0.55) 0%, transparent 40%)',
              }}
            />
          </div>

          {/* Hover info */}
          <div
            className="absolute"
            style={{
              bottom: 70, left: '50%', transform: 'translateX(-50%)',
              width: 300,
              opacity: imgHov ? 1 : 0,
              translate: imgHov ? '0 0' : '0 10px',
              transition: 'all 0.35s ease',
              backgroundColor: 'rgba(250,247,242,0.92)',
              backdropFilter: 'blur(12px)',
              borderRadius: 16,
              border: '1px solid rgba(139,46,26,0.15)',
              padding: '14px 20px',
            }}
          >
            <div
              className="text-xs font-semibold mb-1 uppercase tracking-wider"
              style={{ color: 'var(--terra)', fontFamily: 'Outfit, sans-serif' }}
            >
              Producto Nidus
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--slate)', fontFamily: 'Outfit, sans-serif' }}>
              Huevos frescos · Cubeta × 30
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif' }}>
              Calidad garantizada · Entrega en 24h
            </div>
          </div>
        </div>
      </div>

      {/* Left: content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="max-w-[580px]">

          {/* Eyebrow */}
          <div
            className="flex items-center gap-3 mb-8"
            style={{ animation: 'slide-in 0.8s ease both' }}
          >
            <div className="h-px w-10" style={{ backgroundColor: 'var(--terra)' }} />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: 'var(--terra)', fontFamily: 'Outfit, sans-serif' }}
            >
              Del origen a tu mesa
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(3rem,7.5vw,5.8rem)',
              fontWeight: 900,
              lineHeight: 0.98,
              letterSpacing: '-0.03em',
              color: 'var(--slate)',
              animation: 'slide-in 0.9s ease 0.08s both',
            }}
          >
            El huevo que<br />
            <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>mueve</em>
            {' '}tu<br />negocio.
          </h1>

          {/* Subheadline */}
          <p
            className="mt-6 text-lg leading-relaxed"
            style={{
              color: 'var(--muted)',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 300,
              maxWidth: 440,
              animation: 'slide-in 1s ease 0.18s both',
            }}
          >
            Huevos frescos, calidad constante y distribución para hogares y negocios en toda la región.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4 mt-10"
            style={{ animation: 'slide-in 1s ease 0.3s both' }}
          >
            <Btn primary>Comprar al detal →</Btn>
            <Btn primary={false}>
              <span className="text-xs opacity-60 mr-1">B2B</span>
              Comprar al por mayor
            </Btn>
          </div>

          {/* Mini stats */}
          <div
            className="flex flex-wrap gap-8 mt-14"
            style={{ animation: 'slide-in 1s ease 0.44s both' }}
          >
            {[
              { v: '+10K', l: 'Huevos / día' },
              { v: '+500', l: 'Clientes activos' },
              { v: '24h', l: 'Entrega máxima' },
            ].map(s => (
              <div key={s.l}>
                <div
                  style={{
                    fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 700,
                    color: 'var(--terra)', lineHeight: 1,
                  }}
                >
                  {s.v}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif' }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: 'slide-in 1s ease 0.8s both' }}
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--terra)', opacity: 0.45, fontFamily: 'Outfit, sans-serif' }}>
          Scroll
        </span>
        <div
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, var(--terra), transparent)', opacity: 0.5 }}
        />
      </div>
    </section>
  )
}

// ─── Story Section ────────────────────────────────────────────────────────────

function StorySection() {
  const { ref, vis } = useVisible(0.06)

  return (
    <section
      ref={ref}
      className="py-32"
      style={{ backgroundColor: 'var(--cream)' }}
      aria-labelledby="story-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`mb-20 reveal ${vis ? 'visible' : ''}`}>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--terra)' }} />
            <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--terra)', fontFamily: 'Outfit, sans-serif' }}>
              El recorrido
            </span>
          </div>
          <h2
            id="story-heading"
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(2rem,4.5vw,3.4rem)',
              fontWeight: 700,
              color: 'var(--slate)',
              letterSpacing: '-0.025em',
              lineHeight: 1.08,
            }}
          >
            De la granja a tu puerta,
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>sin excepciones.</em>
          </h2>
        </div>

        {/* Right side real photo */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div
              className="absolute left-0 w-px hidden lg:block"
              style={{
                top: 0, height: '100%',
                background: 'linear-gradient(to bottom, rgba(139,46,26,0.4), rgba(139,46,26,0.03))',
                transform: `scaleY(${vis ? 1 : 0})`,
                transformOrigin: 'top',
                transition: 'transform 1.5s ease 0.3s',
                position: 'relative',
              }}
            />
            <div className="space-y-0">
              {STAGES.map((s, i) => (
                <StoryRow key={s.n} s={s} i={i} vis={vis} />
              ))}
            </div>
          </div>

          {/* Warehouse photo as visual anchor */}
          <div
            className="hidden lg:block sticky top-32"
            style={{
              opacity: vis ? 1 : 0,
              transform: vis ? 'translateX(0)' : 'translateX(30px)',
              transition: 'all 0.8s ease 0.3s',
            }}
          >
            <div
              className="overflow-hidden"
              style={{
                borderRadius: '2rem',
                aspectRatio: '3/4',
                boxShadow: '0 20px 60px rgba(26,21,16,0.12)',
              }}
            >
              <img
                src={imgWall}
                alt="Instalaciones de Nidus — estanterías con cientos de cubetas de huevos organizadas"
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.88) contrast(1.06)' }}
                loading="lazy"
              />
            </div>
            <div
              className="mt-5 px-1"
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 15,
                fontStyle: 'italic',
                color: 'var(--muted)',
              }}
            >
              Instalaciones Nidus — capacidad para miles de huevos diarios
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StoryRow({ s, i, vis }: { s: (typeof STAGES)[0]; i: number; vis: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className="flex gap-6 py-8 border-b"
      style={{
        borderColor: 'var(--border)',
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateX(0)' : 'translateX(-32px)',
        transition: `all 0.65s ease ${i * 0.13}s`,
        cursor: 'default',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="flex-shrink-0 w-12 pt-1">
        <span
          style={{
            fontFamily: 'Fraunces, serif', fontSize: 12, fontWeight: 700,
            color: hov ? 'var(--terra)' : 'rgba(139,46,26,0.3)',
            transition: 'color 0.3s ease', letterSpacing: '0.07em',
          }}
        >
          {s.n}
        </span>
      </div>
      <div className="flex-1 flex flex-col md:flex-row md:items-baseline gap-3 md:gap-10">
        <h3
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(1.4rem,2.5vw,2rem)',
            fontWeight: 700,
            color: hov ? 'var(--slate)' : 'rgba(61,73,88,0.65)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            transition: 'color 0.3s ease',
            minWidth: 130, flexShrink: 0,
          }}
        >
          {s.t}
        </h3>
        <p
          className="text-sm leading-relaxed max-w-md"
          style={{
            color: hov ? 'var(--muted)' : 'rgba(122,110,98,0.55)',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 300,
            transition: 'color 0.3s ease',
          }}
        >
          {s.d}
        </p>
      </div>
      <div
        className="hidden lg:block flex-shrink-0 pt-1"
        style={{
          opacity: hov ? 1 : 0,
          transform: hov ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <NidusLogoMark size={32} color="var(--terra)" />
      </div>
    </div>
  )
}

// ─── Choose Section ───────────────────────────────────────────────────────────

const B2C_DATA = {
  label: 'Para tu hogar',
  headline: 'La frescura que tu familia merece.',
  desc: 'Desde cartones de 6 hasta presentaciones especiales, Nidus tiene el huevo perfecto para cada comida y cada presupuesto.',
  features: ['Huevos AA y A clasificados', 'Entrega a domicilio disponible', 'Sin intermediarios', 'Precio justo y constante'],
  cta: 'Comprar al detal',
  img: imgBlueEggs,
  imgAlt: 'Cubeta de huevos frescos azules y marrones para el hogar',
  stat: { v: '+2.000', l: 'hogares abastecidos' },
}
const B2B_DATA = {
  label: 'Para tu negocio',
  headline: 'Volumen, calidad y cumplimiento.',
  desc: 'Restaurantes, panaderías, hoteles y distribuidores confían en Nidus para garantizar su operación sin contratiempos.',
  features: ['Precios mayoristas competitivos', 'Entregas programadas', 'Crédito y facturación', 'Asesor de cuenta dedicado'],
  cta: 'Solicitar cotización B2B',
  img: imgWarehouse,
  imgAlt: 'Bodega Nidus con cubetas listas para distribución mayorista',
  stat: { v: '+300', l: 'negocios activos' },
}

function ChooseSection() {
  const [mode, setMode] = useState<'detal' | 'mayorista'>('detal')
  const { ref, vis } = useVisible(0.08)
  const data = mode === 'detal' ? B2C_DATA : B2B_DATA

  return (
    <section
      id="mayoristas"
      ref={ref}
      className="py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--cream-lt)' }}
      aria-labelledby="choose-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-14 reveal ${vis ? 'visible' : ''}`}>
          <h2
            id="choose-heading"
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(2rem,4vw,3.2rem)',
              fontWeight: 700, color: 'var(--slate)',
              letterSpacing: '-0.022em',
            }}
          >
            Elige tu{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>Nidus</em>
          </h2>
          <p className="mt-3 text-base" style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif' }}>
            Atendemos hogares y negocios con la misma dedicación.
          </p>
        </div>

        {/* Toggle */}
        <div className={`flex justify-center mb-14 reveal ${vis ? 'visible' : ''}`}>
          <div
            className="flex p-1.5 rounded-full"
            style={{ backgroundColor: 'var(--cream-dk)', border: '1px solid var(--border)' }}
          >
            {(['detal', 'mayorista'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-8 py-3 rounded-full text-sm font-semibold transition-all duration-350"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  backgroundColor: mode === m ? 'var(--terra)' : 'transparent',
                  color: mode === m ? 'var(--cream-lt)' : 'var(--muted)',
                }}
                aria-pressed={mode === m}
              >
                {m === 'detal' ? 'Al detal — Hogar' : 'Al por mayor — Negocio'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div
          className="grid lg:grid-cols-2 gap-14 items-center"
          style={{
            opacity: vis ? 1 : 0,
            transform: vis ? 'translateY(0)' : 'translateY(28px)',
            transition: 'all 0.65s ease 0.15s',
          }}
        >
          <div key={mode} style={{ animation: 'fade-up 0.45s ease both' }}>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5"
              style={{ backgroundColor: 'var(--terra-lt)', color: 'var(--terra)', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.05em' }}
            >
              {data.label}
            </span>
            <h3
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(1.8rem,3vw,2.7rem)',
                fontWeight: 700, color: 'var(--slate)',
                letterSpacing: '-0.022em', lineHeight: 1.13, marginBottom: 16,
              }}
            >
              {data.headline}
            </h3>
            <p style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif', fontWeight: 300, lineHeight: 1.72, marginBottom: 22, fontSize: 15 }}>
              {data.desc}
            </p>
            <ul className="space-y-3 mb-9" role="list">
              {data.features.map(f => (
                <li key={f} className="flex items-center gap-3">
                  <NidusLogoMark size={16} color="var(--terra)" />
                  <span style={{ color: 'var(--dark)', fontFamily: 'Outfit, sans-serif', fontSize: 14 }}>{f}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-7">
              <Btn primary>{data.cta}</Btn>
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 700, color: 'var(--terra)', lineHeight: 1 }}>
                  {data.stat.v}
                </div>
                <div style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif', fontSize: 11 }}>
                  {data.stat.l}
                </div>
              </div>
            </div>
            {mode === 'mayorista' && (
              <div className="mt-7 flex flex-wrap gap-2">
                {['Restaurantes', 'Panaderías', 'Hoteles', 'Supermercados', 'Distribuidores'].map(b => (
                  <span key={b} className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'var(--cream-dk)', color: 'var(--muted)', border: '1px solid var(--border)', fontFamily: 'Outfit, sans-serif' }}>
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div key={`img-${mode}`} className="relative" style={{ animation: 'fade-up 0.45s ease 0.1s both' }}>
            <div
              className="relative overflow-hidden w-full"
              style={{
                borderRadius: mode === 'detal' ? '60% 40% 52% 48% / 48% 52% 56% 44%' : '40% 60% 44% 56% / 56% 44% 60% 40%',
                aspectRatio: '4/3',
                transition: 'border-radius 0.6s ease',
                boxShadow: '0 20px 60px rgba(26,21,16,0.1)',
              }}
            >
              <img
                src={data.img}
                alt={data.imgAlt}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.9) contrast(1.06)' }}
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(139,46,26,0.08) 0%, transparent 55%)' }} />
            </div>
            <div className="absolute -top-4 -right-4" style={{ animation: 'float 5.5s ease-in-out infinite', opacity: 0.35 }}>
              <NidusLogoMark size={64} color="var(--terra)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Products Section ─────────────────────────────────────────────────────────

function ProductCard({ p, idx }: { p: (typeof PRODUCTS)[0]; idx: number }) {
  const [hov, setHov] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { ref, vis } = useVisible(0.08)

  return (
    <>
      <article
        ref={ref}
        className="relative rounded-3xl overflow-hidden"
        style={{
          backgroundColor: '#fff',
          border: `1px solid ${hov ? 'rgba(139,46,26,0.3)' : 'rgba(139,46,26,0.1)'}`,
          opacity: vis ? 1 : 0,
          transform: vis ? 'translateY(0)' : 'translateY(36px)',
          transition: `opacity 0.65s ease ${idx * 0.09}s, transform 0.65s ease ${idx * 0.09}s, border-color 0.3s ease, box-shadow 0.3s ease`,
          boxShadow: hov ? '0 16px 48px rgba(26,21,16,0.1)' : '0 2px 12px rgba(26,21,16,0.05)',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => setShowModal(true)}
      >
        <div className="relative overflow-hidden" style={{ height: 200 }}>
          <img
            src={p.img}
            alt={`${p.name} — ${p.presentation}`}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hov ? 'scale(1.08)' : 'scale(1)', filter: 'brightness(0.88) contrast(1.08)' }}
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.9) 100%)' }} />
          {p.badge && (
            <span
              className="absolute top-3.5 left-4 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'var(--terra)', color: 'var(--cream-lt)', fontFamily: 'Outfit, sans-serif' }}
            >
              {p.badge}
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--terra)', fontFamily: 'Outfit, sans-serif' }}>
            {p.presentation} · {p.weight}
          </div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 700, color: 'var(--slate)', letterSpacing: '-0.01em', lineHeight: 1.18, marginBottom: 6 }}>
            {p.name}
          </h3>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
            {p.desc}
          </p>
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
              {p.price}
            </span>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
              style={{
                backgroundColor: hov ? 'var(--terra)' : 'var(--terra-lt)',
                color: hov ? 'var(--cream-lt)' : 'var(--terra)',
                fontFamily: 'Outfit, sans-serif',
                transform: hov ? 'translateY(-1px)' : 'translateY(0)',
              }}
              aria-label={`Ver detalles de ${p.name}`}
            >
              Ver más
              <span style={{ display: 'inline-block', transition: 'transform 0.3s ease', transform: hov ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
          </div>
        </div>
      </article>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(26,21,16,0.65)', backdropFilter: 'blur(8px)', animation: 'fade-up 0.3s ease both' }}
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Detalle de ${p.name}`}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl overflow-hidden"
            style={{ backgroundColor: '#fff', boxShadow: '0 40px 100px rgba(26,21,16,0.25)', animation: 'fade-up 0.35s ease both' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="relative" style={{ height: 260 }}>
              <img src={p.img} alt={p.name} className="w-full h-full object-cover" style={{ filter: 'brightness(0.88)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.95) 100%)' }} />
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200"
                style={{ backgroundColor: 'rgba(250,247,242,0.9)', color: 'var(--slate)', backdropFilter: 'blur(8px)' }}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <div className="px-7 pb-7 pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--terra)', fontFamily: 'Outfit, sans-serif' }}>
                {p.presentation} · {p.weight}
              </div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 700, color: 'var(--slate)', letterSpacing: '-0.02em', marginBottom: 8 }}>
                {p.name}
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                {p.desc}
              </p>
              <div className="flex gap-3">
                <Btn primary>Solicitar pedido</Btn>
                <Btn primary={false}>WhatsApp</Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ProductsSection() {
  const [filter, setFilter] = useState<'todos' | 'detal' | 'mayorista'>('todos')
  const { ref, vis } = useVisible(0.05)
  const shown = filter === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter)

  return (
    <section
      id="productos"
      ref={ref}
      className="py-32"
      style={{ backgroundColor: 'var(--cream)' }}
      aria-labelledby="products-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal ${vis ? 'visible' : ''}`}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8" style={{ backgroundColor: 'var(--terra)' }} />
              <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--terra)', fontFamily: 'Outfit, sans-serif' }}>
                Productos
              </span>
            </div>
            <h2
              id="products-heading"
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(2rem,4vw,3rem)',
                fontWeight: 700, color: 'var(--slate)',
                letterSpacing: '-0.022em', lineHeight: 1.08,
              }}
            >
              Calidad en cada
              <br />
              <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>presentación.</em>
            </h2>
          </div>
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrar productos">
            {(['todos', 'detal', 'mayorista'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  backgroundColor: filter === f ? 'var(--terra)' : 'rgba(139,46,26,0.07)',
                  color: filter === f ? 'var(--cream-lt)' : 'var(--muted)',
                  border: `1px solid ${filter === f ? 'var(--terra)' : 'var(--border)'}`,
                }}
                aria-pressed={filter === f}
              >
                {f === 'todos' ? 'Todos' : f === 'detal' ? 'Detal' : 'Mayorista'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((p, i) => <ProductCard key={p.id} p={p} idx={i} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Quality Section ──────────────────────────────────────────────────────────

function QualitySection() {
  const { ref, vis } = useVisible(0.08)
  const [active, setActive] = useState<number | null>(null)

  return (
    <section
      id="calidad"
      ref={ref}
      className="py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--cream-lt)' }}
      aria-labelledby="quality-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-18 reveal ${vis ? 'visible' : ''}`}>
          <h2
            id="quality-heading"
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(2.2rem,5vw,4rem)',
              fontWeight: 700, color: 'var(--slate)',
              letterSpacing: '-0.03em', lineHeight: 1.04,
            }}
          >
            Calidad{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>Nidus°</em>
          </h2>
          <p className="mt-4 text-base max-w-sm mx-auto" style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif' }}>
            Cuatro pilares que sostienen cada entrega, cada cliente, cada huevo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {QUALITY_CARDS.map((q, i) => {
            const on = active === i
            return (
              <article
                key={q.title}
                className="relative p-8 rounded-3xl transition-all duration-400"
                style={{
                  backgroundColor: on ? '#fff' : 'var(--cream)',
                  border: `1px solid ${on ? 'rgba(139,46,26,0.3)' : 'var(--border)'}`,
                  opacity: vis ? 1 : 0,
                  transform: vis ? 'translateY(0)' : 'translateY(26px)',
                  transition: `opacity 0.65s ease ${i * 0.1}s, transform 0.65s ease ${i * 0.1}s, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease`,
                  boxShadow: on ? '0 12px 40px rgba(26,21,16,0.08)' : 'none',
                  cursor: 'default',
                }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                <div
                  className="text-3xl mb-5 transition-transform duration-350"
                  style={{ color: 'var(--terra)', fontFamily: 'monospace', transform: on ? 'scale(1.25)' : 'scale(1)' }}
                >
                  {q.sym}
                </div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 700, color: on ? 'var(--slate)' : 'rgba(61,73,88,0.75)', letterSpacing: '-0.01em', marginBottom: 4, transition: 'color 0.3s ease' }}>
                  {q.title}
                </h3>
                <div className="text-sm font-semibold mb-3" style={{ color: 'var(--terra)', fontFamily: 'Outfit, sans-serif', opacity: on ? 1 : 0.55, transition: 'opacity 0.3s ease' }}>
                  {q.sub}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: on ? 'var(--muted)' : 'rgba(122,110,98,0.55)', fontFamily: 'Outfit, sans-serif', fontWeight: 300, transition: 'color 0.3s ease' }}>
                  {q.desc}
                </p>
                <div
                  className="flex flex-wrap gap-2 mt-5"
                  style={{
                    opacity: on ? 1 : 0,
                    transform: on ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'all 0.3s ease 0.08s',
                  }}
                >
                  {q.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-xs"
                      style={{ backgroundColor: 'var(--terra-lt)', color: 'var(--terra)', fontFamily: 'Outfit, sans-serif' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Stats Section ────────────────────────────────────────────────────────────

const STATS = [
  { val: 10000, suf: '+', lab: 'Huevos distribuidos al día' },
  { val: 500,   suf: '+', lab: 'Clientes activos en la región' },
  { val: 300,   suf: '+', lab: 'Negocios abastecidos mensualmente' },
  { val: 100,   suf: '%', lab: 'Compromiso con la calidad' },
]


function StatItem({ s, vis, delay }: { s: (typeof STATS)[0]; vis: boolean; delay: number }) {
  const n = useCounter(s.val, vis)
  return (
    <div
      className="text-center"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(26px)',
        transition: `all 0.65s ease ${delay}s`,
      }}
    >
      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 900, color: 'var(--cream-lt)', lineHeight: 1, letterSpacing: '-0.03em' }}>
        {n.toLocaleString('es-CO')}{s.suf}
      </div>
      <div className="mt-3 text-sm leading-snug" style={{ color: 'rgba(250,247,242,0.65)', fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
        {s.lab}
      </div>
    </div>
  )
}

function StatsSection() {
  const { ref, vis } = useVisible(0.18)

  return (
    <section
      className="py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--terra)', position: 'relative' }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.06 }}>
        <NidusLogoMark size={400} color="var(--cream-lt)" />
      </div>
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 reveal ${vis ? 'visible' : ''}`}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'var(--cream-lt)', letterSpacing: '-0.022em' }}>
            Números que{' '}
            <em style={{ fontStyle: 'italic' }}>respaldan</em> la confianza.
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {STATS.map((s, i) => (
            <StatItem key={s.lab} s={s} vis={vis} delay={i * 0.13} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Calculator Section ───────────────────────────────────────────────────────

function CalcChip({ label, selected, enabled, onClick }: { label: string; selected: boolean; enabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      className="py-3 px-4 rounded-2xl text-sm font-medium transition-all duration-200"
      style={{
        fontFamily: 'Outfit, sans-serif',
        backgroundColor: selected ? 'var(--terra)' : 'rgba(139,46,26,0.07)',
        color: selected ? 'var(--cream-lt)' : enabled ? 'var(--slate)' : 'rgba(61,73,88,0.3)',
        border: `1px solid ${selected ? 'var(--terra)' : 'var(--border)'}`,
        cursor: enabled ? 'pointer' : 'not-allowed',
      }}
      aria-pressed={selected}
    >
      {label}
    </button>
  )
}

function CalcStep({ n, title, on, children }: { n: string; title: string; on: boolean; children: ReactNode }) {
  return (
    <div className="mb-8 transition-opacity duration-350" style={{ opacity: on ? 1 : 0.35, pointerEvents: on ? 'auto' : 'none' }}>
      <div className="flex items-center gap-3 mb-4">
        <span style={{ fontFamily: 'Fraunces, serif', fontSize: 12, fontWeight: 700, color: 'var(--terra)', letterSpacing: '0.07em' }}>{n}</span>
        <span className="text-sm font-medium" style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function CalculatorSection() {
  const { ref, vis } = useVisible(0.08)
  const [btype, setBtype] = useState<string | null>(null)
  const [bsize, setBsize] = useState<string | null>(null)
  const [freq,  setFreq]  = useState<string | null>(null)

  const result = (() => {
    if (!btype || !bsize || !freq) return null
    const bt = BIZ_TYPES.find(b => b.id === btype)!
    const bs = BIZ_SIZES.find(s => s.id === bsize)!
    const fr = BIZ_FREQ.find(f => f.id === freq)!
    const weekly = Math.round(bt.base * bs.m * fr.f)
    return { weekly, cubetas: Math.ceil(weekly / 30), cajas: Math.ceil(weekly / 180), name: bt.l }
  })()

  return (
    <section
      className="py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--cream)' }}
      ref={ref}
      aria-labelledby="calc-heading"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className={`text-center mb-14 reveal ${vis ? 'visible' : ''}`}>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--terra)' }} />
            <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--terra)', fontFamily: 'Outfit, sans-serif' }}>Para mayoristas</span>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--terra)' }} />
          </div>
          <h2
            id="calc-heading"
            style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: 'var(--slate)', letterSpacing: '-0.022em', lineHeight: 1.08 }}
          >
            ¿Cuántos huevos necesita
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>tu negocio?</em>
          </h2>
          <p className="mt-4 text-base" style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif' }}>
            Calcula tu pedido ideal en segundos.
          </p>
        </div>

        <div
          className="rounded-3xl p-8 md:p-12"
          style={{
            backgroundColor: '#fff',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 30px rgba(26,21,16,0.06)',
            opacity: vis ? 1 : 0,
            transform: vis ? 'translateY(0)' : 'translateY(28px)',
            transition: 'all 0.65s ease 0.18s',
          }}
        >
          <CalcStep n="01" title="Tipo de negocio" on={true}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {BIZ_TYPES.map(b => (
                <CalcChip key={b.id} label={b.l} selected={btype === b.id} enabled={true} onClick={() => setBtype(b.id)} />
              ))}
            </div>
          </CalcStep>

          <CalcStep n="02" title="Tamaño del negocio" on={!!btype}>
            <div className="grid grid-cols-3 gap-3">
              {BIZ_SIZES.map(s => (
                <CalcChip key={s.id} label={s.l} selected={bsize === s.id} enabled={!!btype} onClick={() => setBsize(s.id)} />
              ))}
            </div>
          </CalcStep>

          <CalcStep n="03" title="Frecuencia de pedido" on={!!bsize}>
            <div className="grid grid-cols-3 gap-3">
              {BIZ_FREQ.map(f => (
                <CalcChip key={f.id} label={f.l} selected={freq === f.id} enabled={!!bsize} onClick={() => setFreq(f.id)} />
              ))}
            </div>
          </CalcStep>

          {result && (
            <div
              className="mt-6 p-6 rounded-2xl"
              style={{
                backgroundColor: 'var(--terra-lt)',
                border: '1px solid var(--border-str)',
                animation: 'fade-up 0.4s ease both',
              }}
              role="status"
              aria-live="polite"
            >
              <div className="text-sm mb-3" style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif' }}>
                Recomendación para tu {result.name.toLowerCase()}:
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.3rem,3vw,1.9rem)', fontWeight: 700, color: 'var(--slate)', lineHeight: 1.28 }}>
                Aproximadamente{' '}
                <span style={{ color: 'var(--terra)' }}>{result.cubetas} cubetas</span> por semana
              </div>
              <div className="flex gap-4 mt-2.5 text-sm flex-wrap" style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif' }}>
                <span>≈ {result.weekly.toLocaleString('es-CO')} huevos / semana</span>
                <span>·</span>
                <span>≈ {result.cajas} cajas de 180</span>
              </div>
              <button
                className="mt-5 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300"
                style={{ backgroundColor: 'var(--terra)', color: 'var(--cream-lt)', fontFamily: 'Outfit, sans-serif' }}
                onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--terra-br)'; ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--terra)'; ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              >
                Solicitar cotización personalizada →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Distribution Section ─────────────────────────────────────────────────────

function DistributionSection() {
  const { ref, vis } = useVisible(0.08)
  const [hover, setHover] = useState<string | null>(null)

  return (
    <section
      id="nosotros"
      className="py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--slate)' }}
      ref={ref}
      aria-labelledby="dist-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`reveal ${vis ? 'visible' : ''}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8" style={{ backgroundColor: 'var(--terra)' }} />
              <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--terra)', fontFamily: 'Outfit, sans-serif' }}>Cobertura</span>
            </div>
            <h2
              id="dist-heading"
              style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: 'var(--cream-lt)', letterSpacing: '-0.022em', lineHeight: 1.1, marginBottom: 18 }}
            >
              Llevamos Nidus hasta
              <br />
              <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>donde lo necesitas.</em>
            </h2>
            <p style={{ color: 'rgba(250,247,242,0.58)', fontFamily: 'Outfit, sans-serif', fontWeight: 300, lineHeight: 1.72, marginBottom: 22, fontSize: 15 }}>
              Nuestra red de distribución cubre las principales ciudades y municipios con flota propia, rutas optimizadas y entregas puntuales.
            </p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map(c => (
                <span
                  key={c.name}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-220 cursor-default"
                  style={{
                    backgroundColor: hover === c.name ? 'rgba(139,46,26,0.25)' : 'rgba(250,247,242,0.08)',
                    color: hover === c.name ? 'var(--terra)' : 'rgba(250,247,242,0.6)',
                    border: `1px solid ${hover === c.name ? 'rgba(139,46,26,0.4)' : 'rgba(250,247,242,0.12)'}`,
                    fontFamily: 'Outfit, sans-serif', fontWeight: c.primary ? 600 : 400,
                  }}
                  onMouseEnter={() => setHover(c.name)}
                  onMouseLeave={() => setHover(null)}
                >
                  {c.primary ? '●' : '○'} {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* Abstract SVG map */}
          <div
            style={{
              opacity: vis ? 1 : 0,
              transform: vis ? 'translateX(0)' : 'translateX(40px)',
              transition: 'all 0.8s ease 0.2s',
            }}
          >
            <div
              className="relative w-full"
              style={{
                paddingBottom: '125%',
                backgroundColor: 'rgba(250,247,242,0.05)',
                borderRadius: 32,
                border: '1px solid rgba(250,247,242,0.1)',
                overflow: 'hidden',
              }}
            >
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 350">
                {/* Colombia simplified silhouette */}
                <path
                  d="M115 22 C148 16,182 28,196 44 C210 60,212 80,205 100 C225 106,234 122,228 142 C222 162,207 167,192 156 C188 178,177 193,166 208 C155 223,141 228,132 243 C123 258,118 278,114 298 C110 314,105 328,98 338 C91 348,80 352,70 347 C60 342,56 328,62 314 C68 300,80 284,85 264 C90 244,90 224,80 204 C70 184,55 168,50 148 C45 128,56 108,67 94 C78 80,94 70,100 55 C106 40,112 24,115 22 Z"
                  fill="rgba(250,247,242,0.04)"
                  stroke="rgba(250,247,242,0.1)"
                  strokeWidth={1}
                />
                {/* Dashed lines from center */}
                {vis && CITIES.map(c => (
                  <line
                    key={`l-${c.name}`}
                    x1={130} y1={185}
                    x2={c.x * 2.32 + 16} y2={c.y * 3.1 + 10}
                    stroke="rgba(139,46,26,0.12)"
                    strokeWidth={0.7} strokeDasharray="3 4"
                  />
                ))}
                {/* City dots */}
                {CITIES.map((c, i) => {
                  const x = c.x * 2.32 + 16
                  const y = c.y * 3.1 + 10
                  const on = hover === c.name
                  return (
                    <g key={c.name}>
                      {c.primary && vis && (
                        <circle cx={x} cy={y} r={on ? 11 : 7} fill="none"
                          stroke={on ? 'rgba(139,46,26,0.6)' : 'rgba(139,46,26,0.2)'}
                          strokeWidth={0.9} style={{ transition: 'all 0.3s ease' }} />
                      )}
                      <circle
                        cx={x} cy={y}
                        r={c.primary ? (on ? 5.5 : 3.5) : (on ? 3.5 : 2)}
                        fill={on ? '#D4890A' : c.primary ? '#8B2E1A' : 'rgba(139,46,26,0.45)'}
                        style={{
                          transition: 'all 0.3s ease', cursor: 'pointer',
                          opacity: vis ? 1 : 0,
                          animation: vis ? `dot-pop 0.5s ease ${i * 0.11}s both` : 'none',
                        }}
                        onMouseEnter={() => setHover(c.name)}
                        onMouseLeave={() => setHover(null)}
                      />
                      {(on || c.primary) && (
                        <text x={x + 7} y={y + 4} fontSize={on ? 7.5 : 5.5}
                          fill={on ? 'rgba(250,247,242,0.9)' : 'rgba(250,247,242,0.45)'}
                          fontFamily="Outfit, sans-serif"
                          style={{ pointerEvents: 'none', transition: 'all 0.2s ease' }}>
                          {c.name}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection() {
  const { ref, vis } = useVisible(0.08)
  const [active, setActive] = useState(0)
  const [dragStart, setDragStart] = useState(0)
  const [dragging, setDragging] = useState(false)
  const next = useCallback(() => setActive(a => (a + 1) % TESTIMONIALS.length), [])
  const prev = useCallback(() => setActive(a => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), [])

  return (
    <section
      className="py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--cream)' }}
      ref={ref}
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 reveal ${vis ? 'visible' : ''}`}>
          <h2
            id="testimonials-heading"
            style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: 'var(--slate)', letterSpacing: '-0.022em' }}
          >
            Lo que dicen nuestros
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>clientes.</em>
          </h2>
        </div>

        <div
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          onMouseDown={e => { setDragging(true); setDragStart(e.clientX) }}
          onMouseUp={e => { if (!dragging) return; setDragging(false); const d = e.clientX - dragStart; if (Math.abs(d) > 50) d < 0 ? next() : prev() }}
          onMouseLeave={() => setDragging(false)}
          onTouchStart={e => setDragStart(e.touches[0].clientX)}
          onTouchEnd={e => { const d = e.changedTouches[0].clientX - dragStart; if (Math.abs(d) > 50) d < 0 ? next() : prev() }}
        >
          <div className="grid md:grid-cols-3 gap-5 select-none">
            {TESTIMONIALS.map((t, i) => {
              const on = i === active
              return (
                <article
                  key={i}
                  className="rounded-3xl p-7 transition-all duration-500"
                  style={{
                    backgroundColor: on ? '#fff' : 'var(--cream-dk)',
                    border: `1px solid ${on ? 'rgba(139,46,26,0.3)' : 'var(--border)'}`,
                    transform: on ? 'scale(1)' : 'scale(0.965)',
                    opacity: on ? 1 : 0.55,
                    boxShadow: on ? '0 16px 50px rgba(26,21,16,0.1)' : 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActive(i)}
                >
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 56, color: on ? 'rgba(139,46,26,0.22)' : 'rgba(139,46,26,0.08)', lineHeight: 0.8, marginBottom: 16, transition: 'color 0.3s ease' }}>
                    "
                  </div>
                  <p className="text-sm leading-relaxed mb-6"
                    style={{ color: on ? 'var(--muted)' : 'rgba(122,110,98,0.45)', fontFamily: 'Outfit, sans-serif', fontWeight: 300, transition: 'color 0.3s ease' }}>
                    {t.text}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--terra-lt)' }}>
                      <span style={{ fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 700, color: 'var(--terra)' }}>
                        {t.name[0]}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: on ? 'var(--slate)' : 'rgba(61,73,88,0.52)', fontFamily: 'Outfit, sans-serif', transition: 'color 0.3s ease' }}>
                        {t.name}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--terra)', fontFamily: 'Outfit, sans-serif', opacity: on ? 1 : 0.5 }}>
                        {t.biz} · {t.city}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="flex justify-center gap-2.5 mt-8" role="group" aria-label="Navegación de testimonios">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} aria-label={`Testimonio ${i + 1}`}
                style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 4, backgroundColor: i === active ? 'var(--terra)' : 'rgba(139,46,26,0.2)', transition: 'all 0.3s ease' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Contact / Final CTA ──────────────────────────────────────────────────────

function FinalCTA() {
  const { ref, vis } = useVisible(0.08)
  const secRef = useRef<HTMLDivElement>(null)
  const m = useMouse(secRef)

  return (
    <section
      id="contacto"
      className="py-40 overflow-hidden relative"
      style={{ backgroundColor: 'var(--cream-lt)' }}
      ref={ref}
      aria-labelledby="cta-heading"
    >
      <div ref={secRef} className="absolute inset-0 pointer-events-none">
        {/* Parallax logo marks */}
        <div style={{ position: 'absolute', top: '5%', left: '4%', transform: `translate(${m.x * 22}px,${m.y * 14}px)`, transition: 'transform 0.18s ease-out', animation: 'float-r 8s ease-in-out infinite', opacity: 0.07 }}>
          <NidusLogoMark size={120} color="var(--terra)" />
        </div>
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', transform: `translate(${m.x * -20}px,${m.y * -12}px)`, transition: 'transform 0.18s ease-out', animation: 'float 7s ease-in-out infinite 2s', opacity: 0.05 }}>
          <NidusLogoMark size={160} color="var(--terra)" />
        </div>
        <div style={{ position: 'absolute', top: '35%', right: '18%', transform: `translate(${m.x * 30}px,${m.y * -20}px)`, transition: 'transform 0.18s ease-out', animation: 'float 5.5s ease-in-out infinite 1s', opacity: 0.08 }}>
          <NidusLogoMark size={55} color="var(--terra)" />
        </div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(139,46,26,0.05) 0%, transparent 65%)' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(36px)', transition: 'all 0.8s ease' }}>
          <h2
            id="cta-heading"
            style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2.5rem,6.5vw,5rem)', fontWeight: 900, color: 'var(--slate)', letterSpacing: '-0.03em', lineHeight: 1.04, marginBottom: 18 }}
          >
            Hagamos que Nidus
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>llegue hasta ti.</em>
          </h2>
          <p className="text-lg mb-12 max-w-md mx-auto" style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
            Sea para tu hogar o tu negocio, Nidus tiene el pedido perfecto para ti.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Btn primary>Quiero comprar al detal</Btn>
            <Btn primary={false}>Quiero comprar al por mayor</Btn>
          </div>

          {/* Contact chips */}
          <div className="flex flex-wrap gap-3 justify-center mt-10">
            {[
              { label: 'WhatsApp', href: 'https://wa.me/57XXXXXXXXXX' },
              { label: 'Correo electrónico', href: 'mailto:info@nidus.co' },
              { label: 'Llamar ahora', href: 'tel:+57XXXXXXXXXX' },
            ].map(c => (
              <a
                key={c.label}
                href={c.href}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: 'var(--terra-lt)',
                  color: 'var(--terra)',
                  border: '1px solid var(--border)',
                  fontFamily: 'Outfit, sans-serif',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--terra)'; ;(e.currentTarget as HTMLElement).style.color = 'var(--cream-lt)' }}
                onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--terra-lt)'; ;(e.currentTarget as HTMLElement).style.color = 'var(--terra)' }}
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="py-12 border-t"
      style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-3">
            <NidusLogoMark size={32} color="var(--terra)" />
            <NidusWordmark size={18} />
          </div>
          <div className="flex flex-wrap gap-6">
            {[['#productos', 'Productos'], ['#mayoristas', 'Mayoristas'], ['#calidad', 'Calidad'], ['#nosotros', 'Nosotros'], ['#contacto', 'Contacto']].map(([href, label]) => (
              <a key={href} href={href} className="text-sm transition-colors duration-200"
                style={{ color: 'var(--muted)', fontFamily: 'Outfit, sans-serif', textDecoration: 'none' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--terra)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}>
                {label}
              </a>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'rgba(122,110,98,0.55)', fontFamily: 'Outfit, sans-serif' }}>
            © 2026 Nidus. Todos los derechos reservados.
          </div>
        </div>
        <div
          className="mt-10 text-center pointer-events-none"
          style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.4rem,4vw,2.5rem)', fontWeight: 700, fontStyle: 'italic', color: 'rgba(139,46,26,0.1)', letterSpacing: '-0.022em' }}
          aria-hidden="true"
        >
          Del origen a tu mesa.
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const scrollY = useScrollY()

  return (
    <>
      <Navbar scrollY={scrollY} />
      <main>
        <Hero />
        <StorySection />
        <ChooseSection />
        <ProductsSection />
        <QualitySection />
        <StatsSection />
        <CalculatorSection />
        <DistributionSection />
        <TestimonialsSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
