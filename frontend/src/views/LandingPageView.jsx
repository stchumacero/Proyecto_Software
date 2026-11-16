import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  ShieldIcon,
  ShoppingBagIcon,
  EyeIcon,
  SearchIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XIcon,
  TruckIcon,
  PackageIcon,
  QrCodeIcon,
  WarehouseIcon,
  UserIcon
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
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
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
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1547996160-71dfa6309697?auto=format&fit=crop&w=800&q=80',
    reference: 'REF. EVD-300M-D',
    movement: 'Calibre Automático Antimagnético Élan Diver 300',
    caseMaterial: 'Acero 904L ultra-resistente a corrosión marina (42 mm)',
    dial: 'Negro abisal con índices tridimensionales Super-LumiNova Grado X1',
    strap: 'Brazalete de acero con extensión de buceo micro-ajustable',
    description: 'Instrumento profesional con hermeticidad garantizada de 300 metros, bisel cerámico giratorio unidireccional y válvula automática de escape de helio.'
  },
  {
    id: 'W04',
    name: 'Master Tourbillon Nocturne',
    collection: 'EDICIONES ESPECIALES',
    badge: 'ALTA COMPLICACIÓN',
    badgeClass: 'badge-admin',
    price: 13900,
    priceStr: '$13,900 USD',
    stock: 3,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    reference: 'REF. EMT-72H-OR',
    movement: 'Tourbillon Volante de 60 segundos Élan Tourbillon T-01 (72h reserva)',
    caseMaterial: 'Oro Blanco macizo de 18 quilates con fondo zafiro (41 mm)',
    dial: 'Guilloché realizado artesanalmente con apertura calada a las 6h',
    strap: 'Piel de caimán negro de escama cuadrada con cierre desplegable en oro 18K',
    description: 'La máxima cumbre de la alta relojería artesanal: jaula de tourbillon ultraligera de titanio que anula los efectos de la gravedad terrestre.'
  },
  {
    id: 'W05',
    name: 'Grand Astral Chrono',
    collection: 'DEPORTIVOS & DIVER',
    badge: 'CRONÓGRAFO DEPORTIVO',
    badgeClass: 'badge-almacen',
    price: 6100,
    priceStr: '$6,100 USD',
    stock: 14,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    reference: 'REF. EAC-775-FLY',
    movement: 'Calibre Automático Cronógrafo Flyback con rueda de pilares',
    caseMaterial: 'Acero 316L con bisel en taquímetro cerámico azul (42 mm)',
    dial: 'Azul petróleo con rayos de sol y subesferas plateadas azuleadas',
    strap: 'Correa de caucho náutico azul con pespuntes en contraste',
    description: 'Cronógrafo de alta precisión diseñado para medir intervalos de velocidad con función de retorno al vuelo inmediato (Flyback).'
  },
  {
    id: 'W06',
    name: 'Élan Imperial Aureum',
    collection: 'CLÁSICOS & TRADICIÓN',
    badge: 'CLÁSICO EN ORO 18K',
    badgeClass: 'badge-cliente',
    price: 11500,
    priceStr: '$11,500 USD',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    reference: 'REF. EIA-440-GOLD',
    movement: 'Calibre Automático Ultra-Slim Élan 440 (espesor de 3.2 mm)',
    caseMaterial: 'Oro Amarillo macizo de 18 quilates (40 mm)',
    dial: 'Marfil guilloché rayos de sol con manecillas de hoja doradas',
    strap: 'Brazalete eslabonado en oro 18 quilates con cierre invisible',
    description: 'Símbolo indiscutible de distinción y elegancia perpetua, forjado enteramente en oro noble suizo con perfil ultra-plano.'
  }
];

export function LandingPageView({ onGoToLogin }) {
  const [catalog, setCatalog] = useState(WATCH_CATALOG);
  const [activeCategory, setActiveCategory] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Estados para Pasarela de Pago (QR, Depósito, PayPal)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('QR'); // 'QR' | 'DEPOSITO' | 'PAYPAL'
  const [customerInfo, setCustomerInfo] = useState({
    name: 'Juan Perez',
    email: 'juanperes@gmail.com',
    password: 'ClientePass2026!',
    phone: '+591 71234567',
    city: 'Sucre, Bolivia'
  });
  const [depositRef, setDepositRef] = useState('');
  const [qrTimer, setQrTimer] = useState(895); // 15 minutos en segundos
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Estados para Rastreo de Pedido en Vivo
  const [trackingQuery, setTrackingQuery] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isSearchingTracking, setIsSearchingTracking] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Sincronizar catálogo y stock en tiempo real desde el backend SQLite
  const loadProducts = async () => {
    try {
      const res = await api.get('/api/products');
      if (res && res.products && res.products.length > 0) {
        setCatalog(prev => prev.map(localItem => {
          const remote = res.products.find(p => p.id === localItem.id);
          if (remote) {
            return {
              ...localItem,
              stock: remote.stock,
              price: remote.price,
              priceStr: `$${remote.price.toLocaleString()} USD`
            };
          }
          return localItem;
        }));
      }
    } catch (err) {
      console.warn('Catálogo operando con datos locales de contingencia:', err.message);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Temporizador para expiración de código QR
  useEffect(() => {
    if (!isCheckoutModalOpen || paymentMethod !== 'QR') return;
    const interval = setInterval(() => {
      setQrTimer(prev => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCheckoutModalOpen, paymentMethod]);

  const formatTimer = (s) => {
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const filteredWatches = catalog.filter(w => {
    const matchCat = activeCategory === 'TODAS' || w.collection === activeCategory;
    const matchSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        w.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        w.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (watch) => {
    const currentInCart = cart.find(item => item.id === watch.id)?.qty || 0;
    if (watch.stock <= 0) {
      alert(`La pieza "${watch.name}" se encuentra actualmente AGOTADA en nuestra manufactura.`);
      return;
    }
    if (currentInCart >= watch.stock) {
      alert(`Existencias limitadas: Solo disponemos de ${watch.stock} unidad(es) de "${watch.name}". No puede agregar más piezas.`);
      return;
    }
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

  // Procesar orden real en el backend con descuento atómico de stock
  const processOrder = async (customRef = null, method = paymentMethod) => {
    if (cart.length === 0) return;
    setIsProcessingPayment(true);
    setCheckoutError('');

    try {
      const refCode = customRef || (
        method === 'QR' ? `QR-SIMPLE-${Date.now().toString().slice(-6)}` :
        method === 'DEPOSITO' ? (depositRef.trim() || `DEP-BNB-${Math.floor(100000 + Math.random() * 900000)}`) :
        `PAYID-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      );

      const payload = {
        customer_name: customerInfo.name || 'Cliente Élan',
        customer_email: customerInfo.email || 'cliente@elanwatches.com',
        customer_password: customerInfo.password || 'ClientePass2026!',
        payment_method: method,
        payment_reference: refCode,
        items: cart.map(i => ({
          product_id: i.id,
          quantity: i.qty,
          price: i.price
        }))
      };

      const res = await api.post('/api/orders/checkout', payload);
      if (res && res.order) {
        setConfirmedOrder({
          orderId: res.order.id,
          items: [...cart],
          total: res.order.total_amount,
          date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: res.order.status,
          paymentMethod: res.order.payment_method,
          paymentRef: res.order.payment_reference,
          securitySeal: res.order.security_seal,
          trackingNumber: res.order.tracking_number,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          userAccount: res.user_account
        });
        setCart([]);
        setIsCartOpen(false);
        setIsCheckoutModalOpen(false);
        // Recargar inventario para reflejar descuento inmediato
        await loadProducts();
      }
    } catch (err) {
      setCheckoutError(err.message || 'Error al procesar la compra.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Simulación de flujo oficial con PayPal SDK/API
  const handlePaypalCheckout = async () => {
    setIsProcessingPayment(true);
    setCheckoutError('');
    try {
      // 1. Crear Orden en PayPal API
      const createRes = await api.post('/api/payments/paypal/create-order', {
        amount: cartTotal,
        currency: 'USD'
      });
      const orderId = createRes?.id || `PAYPAL-ORD-${Date.now()}`;

      // 2. Capturar Orden en PayPal API
      const captureRes = await api.post('/api/payments/paypal/capture-order', {
        order_id: orderId
      });
      const transactionId = captureRes?.transaction_id || `PAYID-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      // 3. Confirmar pedido en la base de datos de Élan Watches
      await processOrder(transactionId, 'PAYPAL');
    } catch (err) {
      setCheckoutError(err.message || 'Error en la pasarela de PayPal.');
      setIsProcessingPayment(false);
    }
  };

  // Búsqueda y trazabilidad en vivo de pedido (Público)
  const handleSearchTracking = async (orderIdToSearch) => {
    const id = (orderIdToSearch || trackingQuery || '').trim();
    if (!id) return;
    setIsSearchingTracking(true);
    setTrackingError('');
    setTrackingResult(null);

    try {
      const res = await api.get(`/api/orders/tracking/${id}`);
      if (res && res.order) {
        setTrackingResult(res.order);
      } else {
        setTrackingError(`No se encontró el pedido ${id}. Verifique el código ingresado.`);
      }
    } catch (err) {
      // Fallback a demostración académica si está desconectado
      const demoMap = {
        'ELAN-849201': { id: 'ELAN-849201', customer_name: 'Juan Perez', status: 'PAGADO', payment_method: 'QR', total_amount: 4850, created_at: '2026-11-16 10:15', security_seal: null, tracking_number: null },
        'ELAN-310928': { id: 'ELAN-310928', customer_name: 'Valerie Dubois', status: 'EN_PREPARACION', payment_method: 'DEPOSITO_BANCARIO', total_amount: 5200, created_at: '2026-11-16 09:30', security_seal: null, tracking_number: null },
        'ELAN-552109': { id: 'ELAN-552109', customer_name: 'Marcus Vance', status: 'EMPAQUETADO', payment_method: 'PAYPAL', total_amount: 13900, created_at: '2026-11-15 16:45', security_seal: 'PREC-2026-CH9081', tracking_number: null },
        'ELAN-992014': { id: 'ELAN-992014', customer_name: 'Helena Lindqvist', status: 'ENTREGADO', payment_method: 'QR', total_amount: 7450, created_at: '2026-11-14 11:00', security_seal: 'PREC-2026-CH7712', tracking_number: 'ELAN-TRK-8812-BO' }
      };
      if (demoMap[id]) {
        setTrackingResult(demoMap[id]);
      } else {
        setTrackingError(`No se encontró registro para "${id}". Intente con un pedido demo (ej. ELAN-849201, ELAN-310928, ELAN-552109, ELAN-992014).`);
      }
    } finally {
      setIsSearchingTracking(false);
    }
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
                <button className="nav-link" onClick={() => scrollToSection('rastreo')}>
                  Rastreo en Vivo
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
                  {watch.stock <= 0 ? (
                    <span className="badge badge-inactive" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.12)', fontSize: '0.68rem', fontWeight: 700 }}>
                      ● AGOTADO
                    </span>
                  ) : watch.stock <= 3 ? (
                    <span className="badge badge-inactive" style={{ color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.4)', background: 'rgba(251, 191, 36, 0.12)', fontSize: '0.68rem', fontWeight: 600 }}>
                      ⚠️ ¡Últimas {watch.stock} piezas!
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span className="status-dot active" />
                      {watch.stock} disponibles
                    </span>
                  )}
                </div>

                {/* Imagen del Reloj con Vista Previa de Lujo */}
                <div style={{
                  position: 'relative',
                  height: '210px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  marginBottom: '1.25rem',
                  backgroundColor: '#0a0a0e',
                  border: '1px solid var(--border-muted)'
                }}>
                  <img
                    src={watch.image}
                    alt={watch.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      transition: 'transform 0.6s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(13,13,16,0.92) 0%, rgba(13,13,16,0.2) 60%, transparent 100%)',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '0.65rem',
                    left: '0.75rem',
                    right: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 2
                  }}>
                    <span style={{
                      fontSize: '0.68rem',
                      color: 'var(--gold-light)',
                      letterSpacing: '0.12em',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {watch.reference}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedWatch(watch)}
                      style={{
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.68rem',
                        background: 'rgba(8,8,10,0.85)',
                        border: '1px solid var(--gold-border)',
                        color: 'var(--gold-light)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      Ficha técnica →
                    </button>
                  </div>
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
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.55rem',
                      opacity: watch.stock <= 0 ? 0.45 : 1,
                      cursor: watch.stock <= 0 ? 'not-allowed' : 'pointer'
                    }}
                    onClick={() => watch.stock > 0 && addToCart(watch)}
                    disabled={watch.stock <= 0}
                  >
                    <ShoppingBagIcon size={14} />
                    <span>{watch.stock <= 0 ? 'Agotado' : 'Añadir'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Sección de Manufactura & Ateliers Suizos */}
      <section id="manufactura" style={{
        padding: '6rem 1.5rem',
        background: '#09090c',
        borderTop: '1px solid var(--border-muted)',
        borderBottom: '1px solid var(--border-muted)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Cabecera de la sección */}
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <span style={{
              fontSize: '0.72rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--gold-primary)',
              fontWeight: 700,
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              HAUTE HORLOGERIE SUISSE · SAVOIR-FAIRE
            </span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.5rem',
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              lineHeight: 1.2
            }}>
              Manufactura de Ginebra: El Arte Donde el Metal Cobra Vida
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'var(--gold-primary)', margin: '0 auto 1.5rem auto' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8 }}>
              En los talleres de <strong>Élan Watches</strong>, la maestría centenaria de los maestros relojeros suizos se fusiona con la ingeniería mecánica de precisión micrométrica. Cada tornillo, puente y espiral es tratado con veneración artística.
            </p>
          </div>

          {/* Banner Fotográfico del Atelier con Cita */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--gold-border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            marginBottom: '4rem'
          }}>
            <img
              src="https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1400&q=80"
              alt="Atelier de Alta Relojería Élan en Ginebra"
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                display: 'block'
              }}
              loading="lazy"
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(8,8,10,0.95) 0%, rgba(8,8,10,0.4) 50%, rgba(8,8,10,0.2) 100%)'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '2rem',
              left: '2rem',
              right: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '1.5rem'
            }}>
              <div style={{ maxWidth: '640px' }}>
                <span style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-primary)',
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '0.4rem'
                }}>
                  MANIFESTO ATELIER ÉLAN · GENÈVE
                </span>
                <p style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  color: 'var(--text-primary)',
                  fontStyle: 'italic',
                  lineHeight: 1.5
                }}>
                  "No medimos solamente las horas transcurridas; custodiamos los instantes que definen tu legado."
                </p>
              </div>
              <div style={{
                background: 'rgba(15,15,20,0.85)',
                padding: '0.85rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--gold-border)',
                backdropFilter: 'blur(8px)'
              }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Tolerancia Micrométrica</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--gold-light)', fontWeight: 700 }}>± 0.001 mm</span>
              </div>
            </div>
          </div>

          {/* 4 Pilares de la Manufactura */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
            marginBottom: '4rem'
          }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--gold-primary)' }}>⚙️</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                Calibres Propios de Alta Frecuencia
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Movimientos mecánicos de 28,800 alternancias/hora (4 Hz) con volantes de inercia variable, espiral antimagnética de silicio y rotores esqueletados decorados a mano en oro macizo.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--gold-primary)' }}>💎</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                Decoración Haute Horlogerie
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Acabados artesanales <em>Côtes de Genève</em>, perlage circular en platinas, tornillos azulados térmicamente a 300°C y biselado manual con varillas de madera de saúco.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--gold-primary)' }}>🛡️</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                Metales Nobles & Grado Aeroespacial
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Cajas forjadas en titanio Grado 5 con revestimiento DLC de alta dureza, oro ético de 18 quilates 5N y acero 904L inmune al agua salina y corrosión extrema.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--gold-primary)' }}>⏱️</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                Certificación COSC & 360h de Prueba
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Cada ejemplar es sometido a 15 días consecutivos de pruebas cronométricas en 5 posiciones y a 3 temperaturas diferentes antes de recibir el sello de atelier.
              </p>
            </div>
          </div>

          {/* El Proceso en 4 Pasos */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-muted)',
            padding: '2.5rem'
          }}>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.35rem',
              color: 'var(--text-primary)',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              Las 4 Fases de Creación de una Pieza Élan
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', fontWeight: 700, fontFamily: 'monospace' }}>FASE 01</span>
                <h5 style={{ color: 'var(--text-primary)', fontSize: '0.92rem', margin: '0.3rem 0 0.5rem 0' }}>Concepción & Modelado 3D</h5>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Cálculo de momentos de inercia y diseño cinemático de los trenes de engranajes en software CAD especializado.
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', fontWeight: 700, fontFamily: 'monospace' }}>FASE 02</span>
                <h5 style={{ color: 'var(--text-primary)', fontSize: '0.92rem', margin: '0.3rem 0 0.5rem 0' }}>Mecanizado por Electroerosión</h5>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Corte por hilo micrométrico de los componentes en titanio, rubíes sintéticos y metales preciosos con tolerancia de micras.
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', fontWeight: 700, fontFamily: 'monospace' }}>FASE 03</span>
                <h5 style={{ color: 'var(--text-primary)', fontSize: '0.92rem', margin: '0.3rem 0 0.5rem 0' }}>Angulado & Guilloché Manual</h5>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Grabado artístico y guilloché a mano en tornos tradicionales rose engine por maestros artesanos de Ginebra.
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', fontWeight: 700, fontFamily: 'monospace' }}>FASE 04</span>
                <h5 style={{ color: 'var(--text-primary)', fontSize: '0.92rem', margin: '0.3rem 0 0.5rem 0' }}>Montaje en Sala Blanca ISO 5</h5>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Ensamblado final de más de 280 piezas microscópicas en ambiente libre de partículas, lubricación con micro-gotas y prueba estanca.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Sección de Filosofía */}
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

      {/* 8. Sección de Rastreo de Pedidos en Vivo (HU22/RF16 + Criterios de Evaluación) */}
      <section id="rastreo" style={{
        padding: '5rem 1.5rem',
        background: '#07080b',
        borderTop: '1px solid var(--border-muted)',
        borderBottom: '1px solid var(--border-muted)'
      }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{
              fontSize: '0.72rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--gold-primary)',
              fontWeight: 700,
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              TRAZABILIDAD Y LOGÍSTICA SUIZA
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Rastreo de Pedidos en Tiempo Real
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '640px', margin: '0 auto' }}>
              Consulte el estado exacto de su adquisición: desde la verificación de cobro (QR, Depósito o PayPal), preparación y precinto suizo en almacén, hasta la entrega finalizada.
            </p>
          </div>

          {/* Barra de Búsqueda de Rastreo */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-muted)',
            padding: '1.75rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
          }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSearchTracking(); }} style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '240px' }} className="search-input-wrapper">
                <SearchIcon size={18} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Ingrese su Código de Pedido (ej. ELAN-849201 o su código reciente)..."
                  value={trackingQuery}
                  onChange={(e) => setTrackingQuery(e.target.value)}
                  style={{ width: '100%', fontSize: '0.9rem' }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSearchingTracking}
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
              >
                {isSearchingTracking ? 'Consultando...' : 'Rastrear Envío →'}
              </button>
            </form>

            {/* Accesos rápidos de demostración para el evaluador */}
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.74rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Probar pedidos de demostración:</span>
              {[
                { id: 'ELAN-849201', label: '1. Pago Confirmado (QR)', color: '#60a5fa' },
                { id: 'ELAN-310928', label: '2. En Preparación', color: '#fbbf24' },
                { id: 'ELAN-552109', label: '3. Empacado & Precinto', color: '#a78bfa' },
                { id: 'ELAN-992014', label: '5. Entregado y Finalizado', color: '#34d399' }
              ].map(demo => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => { setTrackingQuery(demo.id); handleSearchTracking(demo.id); }}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-muted)',
                    color: demo.color,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.72rem'
                  }}
                >
                  {demo.id} ({demo.label})
                </button>
              ))}
            </div>
          </div>

          {/* Mensaje de Error en Rastreo */}
          {trackingError && (
            <div style={{
              padding: '1rem 1.25rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-sm)',
              color: '#f87171',
              fontSize: '0.82rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <AlertTriangleIcon size={18} />
              <span>{trackingError}</span>
            </div>
          )}

          {/* Resultado de Rastreo en Vivo con Stepper de 5 Fases */}
          {trackingResult && (
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gold-border)',
              padding: '2rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
            }}>
              {/* Encabezado del Pedido */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                borderBottom: '1px solid var(--border-muted)',
                paddingBottom: '1.25rem',
                marginBottom: '1.75rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pedido Élan</span>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    {trackingResult.id}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Cliente: <strong>{trackingResult.customer_name}</strong> • Total: <strong style={{ color: 'var(--gold-light)' }}>${trackingResult.total_amount?.toLocaleString()} USD</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Método de Cobro:</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#93c5fd' }}>
                    {trackingResult.payment_method === 'QR' ? '📱 QR Simple / BNB' :
                     trackingResult.payment_method === 'DEPOSITO_BANCARIO' ? '🏦 Depósito Bancario' :
                     trackingResult.payment_method === 'PAYPAL' ? '💳 PayPal REST API' : trackingResult.payment_method}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    Ref: {trackingResult.payment_reference || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Stepper de 5 Fases */}
              <div style={{ marginBottom: '2rem' }}>
                {(() => {
                  const phases = [
                    { id: 'PAGADO', label: '1. Pago Confirmado', sub: 'Cobro Verificado' },
                    { id: 'EN_PREPARACION', label: '2. En Preparación', sub: 'Taller & Almacén' },
                    { id: 'EMPAQUETADO', label: '3. Empacado & Sellado', sub: 'Precinto Suizo' },
                    { id: 'EN_TRANSITO', label: '4. En Tránsito', sub: 'Courier DHL Express' },
                    { id: 'ENTREGADO', label: '5. Finalizado', sub: 'Entrega Exitosa' }
                  ];
                  const statusOrder = ['PAGADO', 'EN_PREPARACION', 'EMPAQUETADO', 'EN_TRANSITO', 'ENTREGADO'];
                  const currentIndex = statusOrder.indexOf(trackingResult.status);

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', position: 'relative' }}>
                      {phases.map((ph, idx) => {
                        const isCompleted = idx <= currentIndex;
                        const isCurrent = idx === currentIndex;
                        return (
                          <div
                            key={ph.id}
                            style={{
                              background: isCurrent ? 'rgba(197, 160, 89, 0.12)' : (isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)'),
                              border: isCurrent ? '1.5px solid var(--gold-primary)' : (isCompleted ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-muted)'),
                              borderRadius: 'var(--radius-sm)',
                              padding: '1rem 0.75rem',
                              textAlign: 'center',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              margin: '0 auto 0.6rem auto',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: isCompleted ? 'var(--color-success)' : 'rgba(255,255,255,0.1)',
                              color: isCompleted ? '#08080a' : 'var(--text-muted)'
                            }}>
                              {isCompleted ? '✓' : (idx + 1)}
                            </div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isCurrent ? 'var(--gold-light)' : (isCompleted ? '#34d399' : 'var(--text-muted)') }}>
                              {ph.label}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                              {ph.sub}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Ficha de Detalles de Seguridad & Precintos */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                background: 'rgba(0,0,0,0.3)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-muted)',
                fontSize: '0.8rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Precinto de Seguridad Suizo:</span>
                  <strong style={{ color: trackingResult.security_seal ? 'var(--gold-light)' : 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {trackingResult.security_seal || 'Pendiente de generación en empaque'}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Guía de Transporte / Courier:</span>
                  <strong style={{ color: trackingResult.tracking_number ? '#60a5fa' : 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {trackingResult.tracking_number || 'Pendiente de asignación en despacho'}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Fecha de Registro:</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{trackingResult.created_at || '2026-11-16'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 9. Sección de Concierge & Citas */}
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
              {/* Imagen de Alta Resolución del Reloj Seleccionado */}
              <div style={{
                position: 'relative',
                height: '230px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                backgroundColor: '#0a0a0e',
                border: '1px solid var(--gold-border)'
              }}>
                <img
                  src={selectedWatch.image}
                  alt={selectedWatch.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(13,13,16,0.85) 0%, transparent 60%)'
                }} />
                <span style={{
                  position: 'absolute',
                  bottom: '0.75rem',
                  left: '1rem',
                  fontSize: '0.75rem',
                  color: 'var(--gold-light)',
                  fontWeight: 600,
                  letterSpacing: '0.1em'
                }}>
                  {selectedWatch.reference} &bull; {selectedWatch.collection}
                </span>
              </div>

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
                        gap: '0.85rem',
                        padding: '0.85rem',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-muted)'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '52px',
                          height: '52px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid var(--border-muted)',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.reference} • Cantidad: {item.qty}</div>
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
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutModalOpen(true);
                  }}
                >
                  Proceder al Pago & Pasarela →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 10. Modal de Pasarela de Pagos Completa (QR, Depósito Bancario, PayPal API) */}
      {isCheckoutModalOpen && (
        <div className="modal-backdrop" onClick={() => !isProcessingPayment && setIsCheckoutModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Pasarela de Pago Segura</span>
                  <span className="badge badge-admin" style={{ fontSize: '0.65rem' }}>SSL 256-Bit</span>
                </h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Élan Watches Horlogerie S.A. • Proceso de Cobro y Reserva de Stock
                </span>
              </div>
              <button className="btn-icon" disabled={isProcessingPayment} onClick={() => setIsCheckoutModalOpen(false)}>
                <XIcon size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Resumen de Importe */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.12) 0%, rgba(13, 13, 16, 0.8) 100%)',
                border: '1px solid var(--gold-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Total a Liquidar ({cart.length} pieza{cart.length > 1 ? 's' : ''}):
                  </span>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    ${cartTotal.toLocaleString()} USD
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tipo de Cambio Oficial (6.96):</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#93c5fd', fontFamily: 'monospace' }}>
                    Bs. {(cartTotal * 6.96).toLocaleString()} BOB
                  </div>
                </div>
              </div>

              {/* Datos de Identificación y Creación de Rol CLIENTE */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Datos del Cliente & Verificación de Cuenta:
                  </label>
                  <span className="badge badge-cliente" style={{ fontSize: '0.62rem' }}>
                    Rol Automático: CLIENTE
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Nombre Completo</span>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Ej. Juan Perez"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      style={{ fontSize: '0.8rem', padding: '0.55rem 0.75rem', width: '100%' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Correo Electrónico (Usuario)</span>
                    <input
                      type="email"
                      className="search-input"
                      placeholder="cliente@ejemplo.com"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      style={{ fontSize: '0.8rem', padding: '0.55rem 0.75rem', width: '100%' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Contraseña para Portal Privado</span>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Clave (mín. 6 caracteres)"
                      value={customerInfo.password}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, password: e.target.value })}
                      style={{ fontSize: '0.8rem', padding: '0.55rem 0.75rem', width: '100%' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Teléfono Móvil</span>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="+591 71234567"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      style={{ fontSize: '0.8rem', padding: '0.55rem 0.75rem', width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Dirección de Entrega / Ciudad</span>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Ej. Av. Hernando Siles #450, Sucre, Bolivia"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      style={{ fontSize: '0.8rem', padding: '0.55rem 0.75rem', width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{
                  marginTop: '0.65rem',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  color: '#93c5fd',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <ShieldIcon size={14} color="#60a5fa" />
                  <span>
                    <strong>Verificación de Seguridad:</strong> Al liquidar tu pedido, el backend verificará tu cuenta en la base de datos SQLite y le asignará el rol <strong>CLIENTE</strong> activo para darte acceso al panel privado y seguimiento en vivo.
                  </span>
                </div>
              </div>

              {/* Selector de Métodos de Pago Requeridos por el Docente */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Seleccione Método de Cobro Oficial:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QR')}
                    style={{
                      padding: '0.7rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: paymentMethod === 'QR' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-surface)',
                      border: paymentMethod === 'QR' ? '1.5px solid #3b82f6' : '1px solid var(--border-muted)',
                      color: paymentMethod === 'QR' ? '#93c5fd' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <QrCodeIcon size={20} color={paymentMethod === 'QR' ? '#60a5fa' : 'currentColor'} />
                    <span>Pago con QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('DEPOSITO')}
                    style={{
                      padding: '0.7rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: paymentMethod === 'DEPOSITO' ? 'rgba(197, 160, 89, 0.15)' : 'var(--bg-surface)',
                      border: paymentMethod === 'DEPOSITO' ? '1.5px solid var(--gold-primary)' : '1px solid var(--border-muted)',
                      color: paymentMethod === 'DEPOSITO' ? 'var(--gold-light)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <WarehouseIcon size={20} color={paymentMethod === 'DEPOSITO' ? 'var(--gold-primary)' : 'currentColor'} />
                    <span>Depósito Bancario</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PAYPAL')}
                    style={{
                      padding: '0.7rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: paymentMethod === 'PAYPAL' ? 'rgba(234, 179, 8, 0.15)' : 'var(--bg-surface)',
                      border: paymentMethod === 'PAYPAL' ? '1.5px solid #eab308' : '1px solid var(--border-muted)',
                      color: paymentMethod === 'PAYPAL' ? '#fde047' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span style={{ fontWeight: 900, fontSize: '1.05rem', color: '#38bdf8' }}>P<span style={{ color: '#0284c7' }}>P</span></span>
                    <span>PayPal API</span>
                  </button>
                </div>
              </div>

              {/* DETALLE SEGÚN EL MÉTODO SELECCIONADO */}

              {/* OPCIÓN 1: PAGO CON QR INTEROPERABLE (SIMPLE / BNB / BISA) */}
              {paymentMethod === 'QR' && (
                <div style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-muted)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Código Simple QR Interoperable (Bolivia)</span>
                    <span style={{ color: '#fbbf24', fontWeight: 600 }}>⏱️ Expira en: {formatTimer(qrTimer)}</span>
                  </div>

                  {/* Renderizado de Código QR Vectorial con Logotipo Élan */}
                  <div style={{
                    background: '#ffffff',
                    padding: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    position: 'relative'
                  }}>
                    <svg width="170" height="170" viewBox="0 0 170 170">
                      {/* Patrones de Esquinas QR */}
                      <rect x="10" y="10" width="40" height="40" fill="#000" rx="4" />
                      <rect x="16" y="16" width="28" height="28" fill="#fff" rx="2" />
                      <rect x="22" y="22" width="16" height="16" fill="#000" rx="1" />

                      <rect x="120" y="10" width="40" height="40" fill="#000" rx="4" />
                      <rect x="126" y="16" width="28" height="28" fill="#fff" rx="2" />
                      <rect x="132" y="22" width="16" height="16" fill="#000" rx="1" />

                      <rect x="10" y="120" width="40" height="40" fill="#000" rx="4" />
                      <rect x="16" y="126" width="28" height="28" fill="#fff" rx="2" />
                      <rect x="22" y="132" width="16" height="16" fill="#000" rx="1" />

                      {/* Matriz de Datos Simulada */}
                      <rect x="60" y="15" width="8" height="8" fill="#000" />
                      <rect x="75" y="15" width="8" height="8" fill="#000" />
                      <rect x="90" y="15" width="8" height="8" fill="#000" />
                      <rect x="105" y="15" width="8" height="8" fill="#000" />
                      <rect x="60" y="30" width="8" height="8" fill="#000" />
                      <rect x="90" y="30" width="8" height="8" fill="#000" />
                      <rect x="75" y="45" width="8" height="8" fill="#000" />
                      <rect x="105" y="45" width="8" height="8" fill="#000" />
                      
                      <rect x="15" y="60" width="8" height="8" fill="#000" />
                      <rect x="30" y="60" width="8" height="8" fill="#000" />
                      <rect x="45" y="60" width="8" height="8" fill="#000" />
                      <rect x="120" y="60" width="8" height="8" fill="#000" />
                      <rect x="135" y="60" width="8" height="8" fill="#000" />
                      
                      <rect x="15" y="75" width="8" height="8" fill="#000" />
                      <rect x="45" y="75" width="8" height="8" fill="#000" />
                      <rect x="120" y="75" width="8" height="8" fill="#000" />
                      <rect x="150" y="75" width="8" height="8" fill="#000" />

                      <rect x="15" y="90" width="8" height="8" fill="#000" />
                      <rect x="30" y="90" width="8" height="8" fill="#000" />
                      <rect x="135" y="90" width="8" height="8" fill="#000" />
                      
                      <rect x="60" y="120" width="8" height="8" fill="#000" />
                      <rect x="75" y="120" width="8" height="8" fill="#000" />
                      <rect x="90" y="120" width="8" height="8" fill="#000" />
                      <rect x="105" y="120" width="8" height="8" fill="#000" />
                      <rect x="120" y="120" width="8" height="8" fill="#000" />
                      <rect x="60" y="135" width="8" height="8" fill="#000" />
                      <rect x="90" y="135" width="8" height="8" fill="#000" />
                      <rect x="135" y="135" width="8" height="8" fill="#000" />
                      <rect x="75" y="150" width="8" height="8" fill="#000" />
                      <rect x="105" y="150" width="8" height="8" fill="#000" />
                      <rect x="150" y="150" width="8" height="8" fill="#000" />

                      {/* Emblema Central Élan */}
                      <rect x="68" y="68" width="34" height="34" fill="#08080a" rx="6" />
                      <text x="85" y="91" fill="#c5a059" fontSize="20" fontWeight="bold" textAnchor="middle" fontFamily="serif">É</text>
                    </svg>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Beneficiario: <strong>Élan Watches S.A.</strong> &bull; BNB / BISA &bull; Importe: <strong>Bs. {(cartTotal * 6.96).toLocaleString()}</strong>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isProcessingPayment}
                    onClick={() => processOrder(null, 'QR')}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem' }}
                  >
                    {isProcessingPayment ? 'Validando con Sistema Bancario...' : '📲 Simular Escaneo y Confirmar Pago QR'}
                  </button>
                </div>
              )}

              {/* OPCIÓN 2: DEPÓSITO O TRANSFERENCIA BANCARIA */}
              {paymentMethod === 'DEPOSITO' && (
                <div style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-muted)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Realice la transferencia bancaria o depósito en ventanilla a cualquiera de nuestras cuentas oficiales:
                  </div>

                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-muted)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem',
                    fontSize: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}>
                    <div>🏦 <strong>Banco Nacional de Bolivia (BNB):</strong> Cta. Cte. M/N <code>150-1092841-01</code></div>
                    <div>🏢 <strong>Titular:</strong> Élan Watches Horlogerie S.A. &bull; <strong>NIT:</strong> 1028391024</div>
                    <div>🌐 <strong>UBS Suiza (Internacional):</strong> IBAN <code>CH93 0024 0240 0258 2900 1</code></div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Número de Comprobante / Transacción Bancaria:
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Ej. DEP-BNB-849102 o Nro. de Factura"
                      value={depositRef}
                      onChange={(e) => setDepositRef(e.target.value)}
                      style={{ width: '100%', fontSize: '0.85rem' }}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isProcessingPayment}
                    onClick={() => processOrder(depositRef || null, 'DEPOSITO_BANCARIO')}
                    style={{ padding: '0.75rem', fontSize: '0.85rem' }}
                  >
                    {isProcessingPayment ? 'Registrando Comprobante...' : '🏦 Confirmar Depósito Bancario y Descontar Stock'}
                  </button>
                </div>
              )}

              {/* OPCIÓN 3: PAYPAL API (SDK REST OFICIAL) */}
              {paymentMethod === 'PAYPAL' && (
                <div style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-muted)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Integración oficial mediante <strong>PayPal Orders v2 REST API</strong>.
                    El sistema ejecuta la creación de la orden (`/api/payments/paypal/create-order`) y la captura de fondos (`/api/payments/paypal/capture-order`).
                  </div>

                  {/* Botón Estilo Oficial PayPal Gold */}
                  <div style={{ width: '100%', maxWidth: '340px' }}>
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={handlePaypalCheckout}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1.5rem',
                        background: '#ffc439',
                        color: '#003087',
                        border: 'none',
                        borderRadius: '24px',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        cursor: isProcessingPayment ? 'wait' : 'pointer',
                        boxShadow: '0 4px 14px rgba(255, 196, 57, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <span>PayPal</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0079c1' }}>Checkout</span>
                    </button>
                  </div>

                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    🔒 Transacción protegida por PayPal Sandbox API • Moneda: USD
                  </span>
                </div>
              )}

              {/* Mensaje de Error si el backend rechaza por stock */}
              {checkoutError && (
                <div style={{
                  padding: '0.85rem 1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#f87171',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertTriangleIcon size={16} />
                  <span>{checkoutError}</span>
                </div>
              )}

            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isProcessingPayment}
                onClick={() => setIsCheckoutModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Modal de Confirmación de Pedido y Trazabilidad */}
      {confirmedOrder && (
        <div className="modal-backdrop" onClick={() => setConfirmedOrder(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title">¡Adquisición Registrada con Éxito!</h3>
              <button className="btn-icon" onClick={() => setConfirmedOrder(null)}>
                <XIcon size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--color-success-bg)',
                border: '1.5px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-success)',
                margin: '0 auto 1.25rem auto'
              }}>
                <CheckCircleIcon size={34} />
              </div>

              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Cobro Verificado & Stock Descontado
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Su orden ha ingresado formalmente al Subsistema de Almacén e Inventario de Élan Watches.
              </p>

              {/* Ficha de Detalles de Orden */}
              <div style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                border: '1px solid var(--border-muted)',
                textAlign: 'left',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Código de Pedido:</span>
                  <strong style={{ color: 'var(--gold-light)', fontFamily: 'monospace' }}>{confirmedOrder.orderId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Monto Liquidado:</span>
                  <strong style={{ color: 'var(--gold-light)' }}>${confirmedOrder.total?.toLocaleString()} USD</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Método de Cobro:</span>
                  <span style={{ color: '#93c5fd', fontWeight: 600 }}>{confirmedOrder.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Comprobante / Ref:</span>
                  <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{confirmedOrder.paymentRef}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estado Actual:</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>{confirmedOrder.status}</span>
                </div>
              </div>

              {/* Confirmación de Verificación y Creación de Rol CLIENTE */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1rem',
                textAlign: 'left',
                fontSize: '0.78rem',
                marginBottom: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#93c5fd', fontWeight: 700 }}>
                  <ShieldIcon size={16} color="#60a5fa" />
                  <span>Cuenta de Cliente Verificada & Rol Creado</span>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  Usuario: <strong style={{ color: 'var(--text-primary)' }}>{confirmedOrder.customerEmail}</strong> &bull; Rol: <span className="badge badge-cliente" style={{ fontSize: '0.65rem' }}>CLIENTE (ACTIVO)</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Se ha registrado y verificado tu cuenta en la base de datos de seguridad. Puedes iniciar sesión en <strong>"Acceso Privado"</strong> para ver tus compras y dar seguimiento en tiempo real.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setConfirmedOrder(null)}
                >
                  Entendido
                </button>
                <button
                  type="button"
                  className="btn btn-outline-gold"
                  onClick={() => {
                    setConfirmedOrder(null);
                    onGoToLogin();
                  }}
                >
                  Ingresar a Mi Cuenta (Privado) →
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const id = confirmedOrder.orderId;
                    setConfirmedOrder(null);
                    setTrackingQuery(id);
                    handleSearchTracking(id);
                    scrollToSection('rastreo');
                  }}
                >
                  Ver Rastreo en Vivo →
                </button>
              </div>
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
