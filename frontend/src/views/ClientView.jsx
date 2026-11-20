import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  ShoppingBagIcon,
  ShieldIcon,
  UserIcon,
  SearchIcon,
  EyeIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XIcon,
  TruckIcon,
  PackageIcon,
  QrCodeIcon
} from '../components/Icons';

const DEFAULT_CATALOG = [
  {
    id: 'W01',
    name: 'Élan Royal Noir',
    collection: 'EDICIONES ESPECIALES',
    badge: 'EDICIÓN ESPECIAL',
    badgeClass: 'badge-admin',
    price: 7450,
    priceStr: 'Bs. 7,450',
    stock: 7,
    image: '/images/elan-royal-noir.jpg',
    reference: 'REF. ERN-2026-X',
    movement: 'Calibre Automático Élan 8100',
    caseMaterial: 'Titanio Grado 5 con acabado DLC Negro Mate (41 mm)',
    dial: 'Esfera esqueleto con puentes angulados a mano',
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
    priceStr: 'Bs. 5,200',
    stock: 12,
    image: '/images/heritage-chronometer.jpg',
    reference: 'REF. EHC-1936-COSC',
    movement: 'Calibre Manual Élan Heritage 1936 (Certificado COSC)',
    caseMaterial: 'Acero Inoxidable 316L pulido a espejo (39 mm)',
    dial: 'Esmalte Grand Feu marfil con números Breguet aplicados',
    strap: 'Cuero genuino de aligátor marrón cosido a mano',
    description: 'Inspirado en los cronómetros de navegación del siglo pasado. Manecillas azuladas a fuego a 300°C y cristal de zafiro de doble abombado.'
  },
  {
    id: 'W03',
    name: 'Vanguard Diver 300',
    collection: 'DEPORTIVOS & DIVER',
    badge: 'DEPORTIVO SUBMARINO',
    badgeClass: 'badge-almacen',
    price: 4850,
    priceStr: 'Bs. 4,850',
    stock: 9,
    image: '/images/vanguard-diver-300.jpg',
    reference: 'REF. EVD-300M-D',
    movement: 'Calibre Automático Antimagnético Élan Diver 300',
    caseMaterial: 'Acero 904L ultra-resistente a corrosión marina (42 mm)',
    dial: 'Negro abisal con índices Super-LumiNova Grado X1',
    strap: 'Brazalete de acero con extensión de buceo micro-ajustable',
    description: 'Instrumento profesional con hermeticidad de 300 metros, bisel cerámico giratorio unidireccional y válvula automática de escape de helio.'
  },
  {
    id: 'W04',
    name: 'Master Tourbillon Nocturne',
    collection: 'EDICIONES ESPECIALES',
    badge: 'ALTA COMPLICACIÓN',
    badgeClass: 'badge-admin',
    price: 13900,
    priceStr: 'Bs. 13,900',
    stock: 3,
    image: '/images/master-tourbillon-nocturne.jpg',
    reference: 'REF. EMT-72H-OR',
    movement: 'Tourbillon Volante de 60 segundos Élan Tourbillon T-01',
    caseMaterial: 'Oro Blanco macizo de 18 quilates (41 mm)',
    dial: 'Guilloché realizado artesanalmente con apertura a las 6h',
    strap: 'Piel de caimán negro de escama cuadrada con cierre en oro 18K',
    description: 'La máxima cumbre de la alta relojería artesanal: jaula de tourbillon ultraligera de titanio que anula los efectos de la gravedad terrestre.'
  },
  {
    id: 'W05',
    name: 'Grand Astral Chrono',
    collection: 'DEPORTIVOS & DIVER',
    badge: 'CRONÓGRAFO DEPORTIVO',
    badgeClass: 'badge-almacen',
    price: 6100,
    priceStr: 'Bs. 6,100',
    stock: 14,
    image: '/images/grand-astral-chrono.jpg',
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
    priceStr: 'Bs. 11,500',
    stock: 5,
    image: '/images/elan-imperial-aureum.jpg',
    reference: 'REF. EIA-440-GOLD',
    movement: 'Calibre Automático Ultra-Slim Élan 440 (espesor de 3.2 mm)',
    caseMaterial: 'Oro Amarillo macizo de 18 quilates (40 mm)',
    dial: 'Marfil guilloché rayos de sol con manecillas de hoja doradas',
    strap: 'Brazalete eslabonado en oro 18 quilates con cierre invisible',
    description: 'Símbolo indiscutible de distinción y elegancia perpetua, forjado enteramente en oro noble suizo con perfil ultra-plano.'
  }
];

export function ClientView() {
  const { user } = useAuth();

  const [catalog, setCatalog] = useState(DEFAULT_CATALOG);
  const [activeCategory, setActiveCategory] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [clientOrders, setClientOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Carga de catálogo y pedidos del cliente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/api/products').catch(() => null);
        if (prodRes && prodRes.products) {
          setCatalog(prev => prev.map(local => {
            const remote = prodRes.products.find(p => p.id === local.id);
            return remote ? { ...local, stock: remote.stock, price: remote.price, image: remote.image || local.image, priceStr: `Bs. ${remote.price.toLocaleString()}` } : local;
          }));
        }

        const ordRes = await api.get('/api/orders').catch(() => null);
        if (ordRes && ordRes.orders) {
          // Filtrar las del cliente o mostrar todas para modo demo
          const userOrders = ordRes.orders.filter(o => 
            !user?.email || o.customer_email === user.email || user.role === 'ADMINISTRADOR' || o.id === 'ELAN-849201'
          );
          setClientOrders(userOrders.length > 0 ? userOrders : ordRes.orders.slice(0, 3));
        } else {
          // Fallback de demostración
          setClientOrders([
            { id: 'ELAN-849201', customer_name: user?.full_name || 'Juan Perez', status: 'PAGADO', payment_method: 'QR', payment_reference: 'QR-BNB-88301', total_amount: 4850, created_at: '2026-11-16 10:15', security_seal: null, tracking_number: null },
            { id: 'ELAN-310928', customer_name: user?.full_name || 'Juan Perez', status: 'EN_PREPARACION', payment_method: 'DEPOSITO_BANCARIO', payment_reference: 'DEP-BNB-449102', total_amount: 5200, created_at: '2026-11-16 09:30', security_seal: null, tracking_number: null }
          ]);
        }
      } catch (err) {
        console.warn('Error al cargar datos de cliente:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchData();
  }, [user]);

  // Filtrado de relojes
  const filteredWatches = catalog.filter(w => {
    const matchCat = activeCategory === 'TODAS' || w.collection === activeCategory;
    const matchSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        w.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        w.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Barra Informativa del Usuario Autenticado */}
      <div style={{
        background: 'rgba(21, 21, 27, 0.9)',
        border: '1px solid var(--border-muted)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--gold-subtle)',
            border: '1px solid var(--gold-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-primary)'
          }}>
            <UserIcon size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Portal de Cliente — {user?.full_name}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {user?.email} • Estado: <span style={{ color: 'var(--color-success)' }}>{user?.status}</span>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.72rem',
          color: 'var(--text-muted)'
        }}>
          <ShieldIcon size={14} color="var(--gold-primary)" />
          <span>HU01–HU12 / RF01–RF13 • Control de Stock & Pagos QR / PayPal</span>
        </div>
      </div>

      {/* SECCIÓN 1: MIS PEDIDOS Y TRAZABILIDAD EN TIEMPO REAL (5 ETAPAS) */}
      <div className="card card-luxury" style={{ marginBottom: '2.5rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Mis Pedidos y Trazabilidad de Alta Relojería
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Seguimiento en vivo de preparación, precinto de seguridad suizo y despacho
            </span>
          </div>
          <span className="badge badge-cliente">Trazabilidad en Vivo</span>
        </div>

        {clientOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No registra pedidos recientes. Puede adquirir piezas desde la página principal o nuestro catálogo curado.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {clientOrders.map(order => {
              const phases = [
                { id: 'PAGADO', label: '1. Pago Confirmado', sub: order.payment_method === 'QR' ? '📱 QR Simple' : (order.payment_method === 'PAYPAL' ? '💳 PayPal' : '🏦 Depósito') },
                { id: 'EN_PREPARACION', label: '2. En Preparación', sub: 'Taller Central' },
                { id: 'EMPAQUETADO', label: '3. Empacado & Precinto', sub: order.security_seal || 'Sello Suizo' },
                { id: 'EN_TRANSITO', label: '4. En Tránsito', sub: order.tracking_number || 'DHL Courier' },
                { id: 'ENTREGADO', label: '5. Entregado', sub: 'Finalizado' }
              ];
              const statusOrder = ['PAGADO', 'EN_PREPARACION', 'EMPAQUETADO', 'EN_TRANSITO', 'ENTREGADO'];
              const currentIndex = statusOrder.indexOf(order.status);

              return (
                <div
                  key={order.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-muted)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                        {order.id}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                        Fecha: {order.created_at || '2026-11-16'} &bull; Importe: <strong style={{ color: 'var(--gold-light)' }}>Bs. {order.total_amount?.toLocaleString()}</strong>
                      </span>
                    </div>
                    <div>
                      <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
                        Estado: {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Stepper de 5 Fases para el Cliente */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                    {phases.map((ph, idx) => {
                      const isDone = idx <= currentIndex;
                      const isNow = idx === currentIndex;
                      return (
                        <div
                          key={ph.id}
                          style={{
                            background: isNow ? 'rgba(197, 160, 89, 0.15)' : (isDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)'),
                            border: isNow ? '1.5px solid var(--gold-primary)' : (isDone ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-muted)'),
                            borderRadius: '4px',
                            padding: '0.65rem 0.5rem',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            margin: '0 auto 0.35rem auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: isDone ? 'var(--color-success)' : 'rgba(255,255,255,0.1)',
                            color: isDone ? '#08080a' : 'var(--text-muted)'
                          }}>
                            {isDone ? '✓' : (idx + 1)}
                          </div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: isNow ? 'var(--gold-light)' : (isDone ? '#34d399' : 'var(--text-muted)') }}>
                            {ph.label}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.15rem', fontFamily: 'monospace' }}>
                            {ph.sub}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECCIÓN 2: CATÁLOGO CURADO ÉLAN WATCHES CON CONTROL DE DISPONIBILIDAD */}
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
          CATÁLOGO DE ALTA RELOJERÍA SUIZA
        </span>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '0.04em',
          marginBottom: '0.75rem'
        }}>
          Colecciones de Atelier
        </h2>
        <p style={{
          maxWidth: '680px',
          margin: '0 auto',
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          lineHeight: 1.6
        }}>
          Existencias y calibres sincronizados en tiempo real con nuestra bóveda central.
        </p>
      </div>

      {/* Barra de Filtros por Categoría */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.65rem',
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
            style={{ fontSize: '0.75rem', padding: '0.55rem 1.15rem' }}
            onClick={() => setActiveCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Barra de Búsqueda de Relojes */}
      <div style={{ maxWidth: '460px', margin: '0 auto 2.5rem auto' }}>
        <div className="search-input-wrapper">
          <SearchIcon size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar reloj por nombre, referencia o colección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grilla de Relojes con Control de Existencias */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.75rem',
        marginBottom: '3rem'
      }}>
        {filteredWatches.map(watch => (
          <div
            key={watch.id}
            className="card card-luxury"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.75rem',
              transition: 'transform 0.25s ease, border-color 0.25s ease',
              position: 'relative'
            }}
          >
            <div>
              {/* Badges de Colección y Disponibilidad */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span className={`badge ${watch.badgeClass}`}>
                  {watch.badge}
                </span>
                {watch.stock <= 0 ? (
                  <span className="badge badge-inactive" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)', fontSize: '0.68rem', fontWeight: 700 }}>
                    ● AGOTADO
                  </span>
                ) : watch.stock <= 3 ? (
                  <span className="badge badge-inactive" style={{ color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.4)', background: 'rgba(251, 191, 36, 0.1)', fontSize: '0.68rem', fontWeight: 600 }}>
                    ⚠️ ¡Últimas {watch.stock} piezas!
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="status-dot active" />
                    {watch.stock} disponibles
                  </span>
                )}
              </div>

              {/* Imagen del Reloj */}
              <div style={{
                position: 'relative',
                height: '180px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                backgroundColor: '#0a0a0e',
                border: '1px solid var(--border-muted)',
                marginBottom: '1.25rem'
              }}>
                <img
                  src={watch.image}
                  alt={watch.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(13,13,16,0.85) 0%, transparent 60%)'
                }} />
                <span style={{
                  position: 'absolute',
                  bottom: '0.5rem',
                  left: '0.75rem',
                  fontSize: '0.68rem',
                  color: 'var(--gold-light)',
                  fontWeight: 600,
                  fontFamily: 'monospace'
                }}>
                  {watch.reference}
                </span>
              </div>

              {/* Título y Descripción */}
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

            {/* Precio y Botones de Acción */}
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
                  Precio Sugerido:
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '0.55rem' }}
                  onClick={() => setSelectedWatch(watch)}
                >
                  <EyeIcon size={14} />
                  <span>Ver Ficha Técnica Oficial</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ficha Técnica Detallada */}
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

              <div style={{
                background: 'rgba(197, 160, 89, 0.08)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <ShieldIcon size={18} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Garantía Internacional Élan Watches por 5 años con precinto de seguridad suizo y registro criptográfico.
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setSelectedWatch(null)}>
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
