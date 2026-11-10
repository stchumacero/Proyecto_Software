import React, { useState } from 'react';
import {
  ShieldIcon,
  ShoppingBagIcon,
  EyeIcon,
  SearchIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XIcon
} from '../components/Icons';

const WATCH_CATALOG = [
  {
    id: 'W01',
    name: 'Élan Royal Noir',
    collection: 'EDICIONES ESPECIALES',
    badge: 'EDICIÓN ESPECIAL',
    badgeClass: 'badge-admin',
    price: 7450,
    priceStr: '$7,450 USD',
    stock: 7,
    reference: 'REF. ERN-2026-X',
    movement: 'Calibre Automático Élan 8100 (28,800 alt/h)',
    caseMaterial: 'Titanio Grado 5 con acabado DLC Negro Mate (41 mm)',
    dial: 'Esfera esqueleto con puentes angulados y rodiados a mano',
    strap: 'Caucho vulcanizado premium con hebilla desplegable en titanio',
    description: 'Cada ejemplar encarna la devoción por la precisión micrométrica y el diseño atemporal. Una pieza insignia con caja de titanio DLC y calibre manufactura de alta frecuencia.'
  },
  {
    id: 'W02',
    name: 'Heritage Chronometer',
    collection: 'CLÁSICOS & TRADICIÓN',
    badge: 'CLÁSICO SUIZO',
    badgeClass: 'badge-cliente',
    price: 5200,
    priceStr: '$5,200 USD',
    stock: 12,
    reference: 'REF. EHC-1936-COSC',
    movement: 'Calibre Manual Élan Heritage 1936 (Certificado Oficial COSC)',
    caseMaterial: 'Acero Inoxidable 316L pulido a espejo (39 mm)',
    dial: 'Esmalte Grand Feu marfil con números Breguet aplicados en oro',
    strap: 'Cuero genuino de aligátor marrón cosido a mano con puntada artesanal',
    description: 'Inspirado en los cronómetros suizos de navegación histórica. Manecillas azuladas a fuego a 300°C y cristal de zafiro de doble abombado.'
  },
  {
    id: 'W03',
    name: 'Vanguard Diver 300',
    collection: 'DEPORTIVOS & DIVER',
    badge: 'DEPORTIVO SUBMARINO',
    badgeClass: 'badge-almacen',
    price: 4850,
    priceStr: '$4,850 USD',
    stock: 9,
    reference: 'REF. EVD-300M-D',
    movement: 'Calibre Automático Antimagnético Élan Diver 300',
    caseMaterial: 'Acero 904L ultra-resistente a corrosión marina (42 mm)',
    dial: 'Negro abisal con índices tridimensionales Super-LumiNova Grado X1',
    strap: 'Brazalete de acero con extensión de buceo micro-ajustable',
    description: 'Instrumento profesional con hermeticidad garantizada de 300 metros, bisel cerámico giratorio unidireccional y válvula automática de escape de helio.'
  },
  {
    id: 'W04',
    name: 'Master Tourbillon Oro Rosa',
    collection: 'EDICIONES ESPECIALES',
    badge: 'ALTA COMPLICACIÓN',
    badgeClass: 'badge-admin',
    price: 14900,
    priceStr: '$14,900 USD',
    stock: 3,
    reference: 'REF. EMT-72H-OR',
    movement: 'Tourbillon Volante de 60 segundos Élan Tourbillon T-01 (72h reserva)',
    caseMaterial: 'Oro Rosa macizo de 18 quilates 5N (40.5 mm)',
    dial: 'Guilloché realizado artesanalmente con apertura calada a las 6h',
    strap: 'Piel de caimán negro de escama cuadrada con cierre desplegable en oro 18K',
    description: 'La máxima cumbre de la alta relojería artesanal: jaula de tourbillon ultraligera de titanio que anula los efectos de la gravedad terrestre.'
  }
];

export function LandingPageView({ onGoToLogin }) {
  const [activeCategory, setActiveCategory] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const filteredWatches = WATCH_CATALOG.filter(w => {
    const matchCat = activeCategory === 'TODAS' || w.collection === activeCategory;
    const matchSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        w.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        w.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (watch) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === watch.id);
      if (existing) {
        return prev.map(item => item.id === watch.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...watch, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (watchId) => {
    setCart(prev => prev.filter(item => item.id !== watchId));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleCheckout = () => {
    const orderNumber = 'ELAN-' + Math.floor(100000 + Math.random() * 900000);
    setConfirmedOrder({
      orderId: orderNumber,
      items: [...cart],
      total: cartTotal,
      date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'Confirmado — En preparación en almacén'
    });
    setCart([]);
    setIsCartOpen(false);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      
      {/* 1. Barra Superior de Contexto Académico */}
      <div className="landing-header-announcement">
        <div className="landing-header-announcement-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{
              background: 'rgba(197, 160, 89, 0.15)',
              border: '1px solid var(--gold-border)',
              color: 'var(--gold-light)',
              padding: '0.15rem 0.5rem',
              borderRadius: '3px',
              fontSize: '0.65rem',
              fontWeight: 700
            }}>
              ACADÉMICO
            </span>
            <span>Ingeniería de Software (SIS 324) • Grupo 22 • Docente: Ing. Ramiro Alberto Duran Quiroga</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>Manufacture d'Horlogerie Suisse • Genève</span>
            <span>Sucre, 2026</span>
          </div>
        </div>
      </div>

      {/* 2. Barra de Navegación de Lujo */}
      <header className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="navbar-inner">
          {/* Logo Élan Watches */}
          <div className="brand-container" onClick={() => scrollToSection('inicio')}>
            <div className="brand-emblem">
              <span>É</span>
            </div>
            <div className="brand-titles">
              <span className="brand-name">ÉLAN WATCHES</span>
              <span className="brand-subtitle">HAUTE HORLOGERIE · SUISSE</span>
            </div>
          </div>

          {/* Menú Central */}
          <nav className="desktop-menu">
            <ul className="nav-links">
              <li>
                <button className="nav-link" onClick={() => scrollToSection('colecciones')}>
                  Colección
                </button>
              </li>
              <li>
                <button className="nav-link" onClick={() => scrollToSection('filosofia')}>
                  Filosofía
                </button>
              </li>
              <li>
                <button className="nav-link" onClick={() => scrollToSection('manufactura')}>
                  Manufactura
                </button>
              </li>
              <li>
                <button className="nav-link" onClick={() => scrollToSection('concierge')}>
                  Concierge & Citas
                </button>
              </li>
            </ul>
          </nav>

          {/* Acciones de Cabecera: Bolsa de Compra + Botón de Acceso Privado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn-icon"
              style={{ position: 'relative', width: '40px', height: '40px' }}
              onClick={() => setIsCartOpen(true)}
              title="Ver Bolsa de Compra"
            >
              <ShoppingBagIcon size={18} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--gold-primary)',
                  color: '#08080a',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(197, 160, 89, 0.5)'
                }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* BOTÓN PROMINENTE DE ACCESO PRIVADO (Abre la Seguridad) */}
            <button
              className="btn-private-access"
              onClick={onGoToLogin}
              title="Ingreso al Subsistema de Seguridad y Gestión de Usuarios"
            >
              <ShieldIcon size={16} color="var(--gold-primary)" />
              <span>Acceso Privado</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section (Inspirado en la captura de pantalla de Élan Watches) */}
      <section id="inicio" className="landing-hero">
        {/* Píldora de Manufactura */}
        <div className="landing-pill">
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold-primary)' }} />
          <span>MANUFACTURE D'HORLOGERIE SUISSE · GENÈVE</span>
        </div>

        {/* Título Principal de Lujo */}
        <h1 className="landing-hero-title">
          La Elegancia del Tiempo,
          <span>Esculpida en Perfección.</span>
        </h1>

        {/* Subtítulo Descriptivo */}
        <p className="landing-hero-subtitle">
          En la cúspide de la alta relojería suiza, <strong>Élan Watches</strong> trasciende lo cotidiano.
          Creamos piezas mecánicas atemporales concebidas en metales nobles, cristales de zafiro y movimientos de manufactura de precisión inquebrantable.
        </p>

        {/* Botones de Llamada a la Acción (CTA) */}
        <div className="landing-hero-ctas">
          <button
            className="btn btn-primary"
            style={{ padding: '0.9rem 2rem', fontSize: '0.85rem' }}
            onClick={() => scrollToSection('colecciones')}
          >
            <span>Descubrir Colección →</span>
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.9rem 2rem', fontSize: '0.85rem' }}
            onClick={() => scrollToSection('filosofia')}
          >
            <span>Nuestra Filosofía</span>
          </button>
        </div>

        {/* 4. Banner de Características / Indicadores de Excelencia */}
        <div className="highlights-banner">
          <div className="highlight-item">
            <div className="highlight-icon-box">👑</div>
            <div>
              <div className="highlight-content-title">100%</div>
              <div className="highlight-content-sub">Manufactura Suiza</div>
            </div>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon-box">⏱️</div>
            <div>
              <div className="highlight-content-title">72 Horas</div>
              <div className="highlight-content-sub">Reserva de Marcha</div>
            </div>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon-box">🏅</div>
            <div>
              <div className="highlight-content-title">COSC</div>
              <div className="highlight-content-sub">Precisión Certificada</div>
            </div>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon-box">♾️</div>
            <div>
              <div className="highlight-content-title">Vitalicia</div>
              <div className="highlight-content-sub">Garantía de Atelier</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Catálogo de Colecciones Destacadas */}
      <section id="colecciones" style={{ padding: '5rem 1.5rem', maxWidth: '1320px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--gold-primary)',
            fontWeight: 700,
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            CATÁLOGO CURADO 2026
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.6rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
            marginBottom: '0.75rem'
          }}>
            Colecciones Destacadas
          </h2>
          <p style={{
            maxWidth: '680px',
            margin: '0 auto',
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            lineHeight: 1.6
          }}>
            Cada ejemplar encarna la devoción por la precisión micrométrica y el diseño atemporal. Explora nuestras líneas creadas para ocasiones trascendentales.
          </p>
        </div>

        {/* Pestañas de Filtro */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'TODAS LAS PIEZAS', value: 'TODAS' },
            { label: 'CLÁSICOS & TRADICIÓN', value: 'CLÁSICOS & TRADICIÓN' },
            { label: 'DEPORTIVOS & DIVER', value: 'DEPORTIVOS & DIVER' },
            { label: 'EDICIONES ESPECIALES', value: 'EDICIONES ESPECIALES' }
          ].map(cat => (
            <button
              key={cat.value}
              className={`btn ${activeCategory === cat.value ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.76rem', padding: '0.6rem 1.25rem' }}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div style={{ maxWidth: '440px', margin: '0 auto 2.5rem auto' }}>
          <div className="search-input-wrapper">
            <SearchIcon size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar reloj por nombre o referencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grilla de Relojes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}>
          {filteredWatches.map(watch => (
            <div
              key={watch.id}
              className="card card-luxury"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.75rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span className={`badge ${watch.badgeClass}`}>
                    {watch.badge}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="status-dot active" />
                    {watch.stock} disponibles
                  </span>
                </div>

                {/* Emblema Reloj */}
                <div style={{
                  height: '140px',
                  background: 'radial-gradient(circle, #201e17 0%, #0d0d10 80%)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    border: '2px solid var(--gold-border)',
                    boxShadow: '0 0 20px rgba(197, 160, 89, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#15151b'
                  }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--gold-light)' }}>
                      É
                    </span>
                  </div>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginTop: '0.5rem', textTransform: 'uppercase' }}>
                    {watch.reference}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  color: 'var(--text-primary)',
                  marginBottom: '0.35rem'
                }}>
                  {watch.name}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5, minHeight: '48px' }}>
                  {watch.description}
                </p>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-muted)',
                  marginBottom: '1rem'
                }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
                    Precio Oficial:
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: 'var(--gold-light)'
                  }}>
                    {watch.priceStr}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '0.55rem' }}
                    onClick={() => setSelectedWatch(watch)}
                  >
                    <EyeIcon size={14} />
                    <span>Detalles</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-gold"
                    style={{ fontSize: '0.72rem', padding: '0.55rem' }}
                    onClick={() => addToCart(watch)}
                  >
                    <ShoppingBagIcon size={14} />
                    <span>Añadir</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Sección de Filosofía */}
      <section id="filosofia" style={{
        padding: '5rem 1.5rem',
        background: 'linear-gradient(180deg, #0b0b0e 0%, #111116 100%)',
        borderTop: '1px solid var(--border-muted)',
        borderBottom: '1px solid var(--border-muted)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold-primary)', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
            ATELIER GENÈVE
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Nuestra Filosofía de Manufactura
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            En Élan Watches, cada calibre es concebido como una obra de arte mecánica. No producimos piezas en masa; cada movimiento es ensamblado, ajustado y decorado a mano por maestros relojeros en Ginebra, garantizando tolerancias microscópicas y una fiabilidad que trasciende generaciones.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)', marginBottom: '0.5rem' }}>Metales Nobles</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Oro ético de 18 quilates, titanio aeroespacial Grado 5 y aceros 904L tratados térmicamente.</p>
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)', marginBottom: '0.5rem' }}>Precisión COSC</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sometidos a 15 días de pruebas extremas de temperatura y posición en laboratorios oficiales.</p>
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)', marginBottom: '0.5rem' }}>Arquitectura Segura</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Plataforma digital integrada con el Subsistema de Seguridad desarrollado para SIS 324.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Sección de Concierge & Citas */}
      <section id="concierge" style={{ padding: '5rem 1.5rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold-primary)', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
          SERVICIO EXCLUSIVO
        </span>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Concierge Privado & Citas Personalizadas
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Para adquirir piezas de gran complicación o solicitar asesoramiento privado con nuestros expertos de alta relojería, acceda a nuestro portal o comuníquese con el concierge oficial de Élan Watches.
        </p>

        <button
          className="btn-private-access"
          style={{ margin: '0 auto' }}
          onClick={onGoToLogin}
        >
          <ShieldIcon size={16} color="var(--gold-primary)" />
          <span>Ingreso para Clientes y Personal Administrativo</span>
        </button>
      </section>

      {/* 8. Modal de Ficha Técnica */}
      {selectedWatch && (
        <div className="modal-backdrop" onClick={() => setSelectedWatch(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedWatch.name}</h3>
              <button className="btn-icon" onClick={() => setSelectedWatch(null)}>
                <XIcon size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${selectedWatch.badgeClass}`}>{selectedWatch.collection}</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--gold-light)', fontWeight: 700 }}>
                  {selectedWatch.priceStr}
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {selectedWatch.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
                  <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>Movimiento</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>{selectedWatch.movement}</span>
                </div>
                <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
                  <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>Caja</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>{selectedWatch.caseMaterial}</span>
                </div>
                <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
                  <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>Esfera</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>{selectedWatch.dial}</span>
                </div>
                <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
                  <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>Correa</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>{selectedWatch.strap}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedWatch(null)}>
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  addToCart(selectedWatch);
                  setSelectedWatch(null);
                }}
              >
                Añadir a la Bolsa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Drawer / Modal de Carrito de Compras */}
      {isCartOpen && (
        <div className="modal-backdrop" onClick={() => setIsCartOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Bolsa de Piezas Seleccionadas</h3>
              <button className="btn-icon" onClick={() => setIsCartOpen(false)}>
                <XIcon size={18} />
              </button>
            </div>
            <div className="modal-body">
              {cart.length === 0 ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <ShoppingBagIcon size={34} color="var(--gold-primary)" />
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Su bolsa de compra se encuentra vacía.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cart.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-muted)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.reference} • Cantidad: {item.qty}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--gold-light)', fontWeight: 700 }}>${(item.price * item.qty).toLocaleString()} USD</div>
                      </div>
                      <button
                        className="btn-icon danger"
                        onClick={() => removeFromCart(item.id)}
                        title="Eliminar de la bolsa"
                      >
                        <XIcon size={14} />
                      </button>
                    </div>
                  ))}

                  <div style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-muted)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Estimado:</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                      ${cartTotal.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsCartOpen(false)}>
                Continuar Explorando
              </button>
              {cart.length > 0 && (
                <button type="button" className="btn btn-primary" onClick={handleCheckout}>
                  Confirmar Pedido Simulado
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 10. Modal de Confirmación de Pedido Simulado */}
      {confirmedOrder && (
        <div className="modal-backdrop" onClick={() => setConfirmedOrder(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Pedido Registrado con Éxito</h3>
              <button className="btn-icon" onClick={() => setConfirmedOrder(null)}>
                <XIcon size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--color-success-bg)',
                border: '1.5px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-success)',
                margin: '0 auto 1.25rem auto'
              }}>
                <CheckCircleIcon size={32} />
              </div>

              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                ¡Adquisición Confirmada!
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Código de Seguimiento de Pedido: <strong style={{ color: 'var(--gold-light)', fontFamily: 'monospace' }}>{confirmedOrder.orderId}</strong>
              </p>

              <div style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                border: '1px solid var(--border-muted)',
                textAlign: 'left',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Monto Total:</span>
                  <span style={{ color: 'var(--gold-light)', fontWeight: 700 }}>${confirmedOrder.total.toLocaleString()} USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estado:</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>{confirmedOrder.status}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Simulación académica conforme a los requisitos del proyecto Élan Watches (Grupo 22).
              </p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button type="button" className="btn btn-primary" onClick={() => setConfirmedOrder(null)}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Footer Institucional */}
      <footer style={{
        background: '#06070a',
        borderTop: '1px solid var(--border-muted)',
        padding: '3rem 1.5rem 2rem 1.5rem',
        marginTop: '4rem'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="brand-emblem" style={{ width: '36px', height: '36px' }}>
              <span>É</span>
            </div>
            <div>
              <span className="brand-name" style={{ fontSize: '1rem' }}>ÉLAN WATCHES</span>
              <span className="brand-subtitle" style={{ fontSize: '0.62rem' }}>HAUTE HORLOGERIE SUIZA</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div>Grupo 22 • Ingeniería de Software (SIS 324) • Docente: Ing. Ramiro Alberto Duran Quiroga</div>
            <div style={{ marginTop: '0.25rem' }}>Chumacero Steffany • Anagua Muñoz Jhaqueline • Monasterios Rojas Erland Mauricio</div>
          </div>

          <div>
            <button
              className="btn btn-outline-gold"
              style={{ fontSize: '0.72rem', padding: '0.5rem 1rem' }}
              onClick={onGoToLogin}
            >
              <ShieldIcon size={14} />
              <span>Acceso al Subsistema de Seguridad</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
