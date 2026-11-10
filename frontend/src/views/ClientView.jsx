import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBagIcon,
  ShieldIcon,
  UserIcon,
  SearchIcon,
  EyeIcon,
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
    priceStr: '$5,200 USD',
    stock: 12,
    reference: 'REF. EHC-1936-COSC',
    movement: 'Calibre Manual Élan Heritage 1936 (Certificado COSC)',
    caseMaterial: 'Acero Inoxidable 316L pulido a espejo (39 mm)',
    dial: 'Esmalte Grand Feu marfil con números Breguet aplicados',
    strap: 'Cuero genuino de aligátor marrón cosido a mano',
    description: 'Inspirado en los cronómetros de navegación del siglo pasado. Manecillas azuladas a fuego a 300°C y cristal de zafiro '
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
    dial: 'Negro abisal con índices Super-LumiNova Grado X1',
    strap: 'Brazalete de acero con extensión de buceo micro-ajustable',
    description: 'Instrumento profesional con hermeticidad de 300 metros, bisel cerámico giratorio unidireccional y válvula automática de escape de helio.'
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
    movement: 'Tourbillon Volante de 60 segundos Élan Tourbillon T-01',
    caseMaterial: 'Oro Rosa macizo de 18 quilates 5N (40.5 mm)',
    dial: 'Guilloché realizado artesanalmente con apertura a las 6h',
    strap: 'Piel de caimán negro de escama cuadrada con cierre en oro 18K',
    description: 'La máxima cumbre de la alta relojería artesanal: jaula de tourbillon ultraligera de titanio que anula los efectos de la gravedad terrestre.'
  }
];

export function ClientView() {
  const { user } = useAuth();

  const [activeCategory, setActiveCategory] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Filtrado de relojes
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
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleSimulateOrder = () => {
    const orderNumber = 'ELAN-' + Math.floor(100000 + Math.random() * 900000);
    setConfirmedOrder({
      orderId: orderNumber,
      items: [...cart],
      total: cartTotal,
      date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'Confirmado — En preparación en almacén'
    });
    setCart([]);
    setOrderModalOpen(true);
  };

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
              {user?.email} • Estado de cuenta: <span style={{ color: 'var(--color-success)' }}>{user?.status}</span>
            </div>
          </div>
        </div>

        {/* Indicador de Carrito Simulado (RF09) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'var(--bg-surface)',
            padding: '0.45rem 0.95rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <ShoppingBagIcon size={16} color="var(--gold-primary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Bolsa: <strong style={{ color: 'var(--text-primary)' }}>{totalItems} piezas</strong> (${cartTotal.toLocaleString()} USD)
            </span>
            {totalItems > 0 && (
              <button
                className="btn btn-primary"
                style={{ padding: '0.25rem 0.65rem', fontSize: '0.7rem' }}
                onClick={handleSimulateOrder}
              >
                Checkout
              </button>
            )}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            borderLeft: '1px solid var(--border-muted)',
            paddingLeft: '1rem'
          }}>
            <ShieldIcon size={14} color="var(--gold-primary)" />
            <span>HU01–HU12 / RF01–RF13</span>
          </div>
        </div>
      </div>

      {/* Hero Section — Catálogo Curado Élan Watches */}
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
          fontSize: '2.5rem',
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

      {/* Grilla de Relojes de Alta Gama */}
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
                <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="status-dot active" />
                  {watch.stock} disponibles
                </span>
              </div>

              {/* Emblema Gráfico Simbólico del Reloj */}
              <div style={{
                height: '140px',
                background: 'radial-gradient(circle, #201e17 0%, #0d0d10 80%)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                position: 'relative',
                overflow: 'hidden'
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

      {/* Modal Ficha Técnica Detallada (RF07) */}
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
                  Garantía Internacional Élan Watches por 5 años con registro en manufactura suiza.
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedWatch(null)}>
                Cerrar Ficha
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  addToCart(selectedWatch);
                  setSelectedWatch(null);
                }}
              >
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Simulación de Orden (RF10, RF11, RF13) */}
      {orderModalOpen && confirmedOrder && (
        <div className="modal-backdrop" onClick={() => setOrderModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Pedido Confirmado (Simulación)</h3>
              <button className="btn-icon" onClick={() => setOrderModalOpen(false)}>
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
                ¡Compra Registrada Exitosamente!
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Código de Seguimiento Único (RF11): <strong style={{ color: 'var(--gold-light)', fontFamily: 'monospace' }}>{confirmedOrder.orderId}</strong>
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
                  <span style={{ color: 'var(--text-muted)' }}>Cliente:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user?.full_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Monto Total:</span>
                  <span style={{ color: 'var(--gold-light)', fontWeight: 700 }}>${confirmedOrder.total.toLocaleString()} USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estado de Distribución:</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>{confirmedOrder.status}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                De acuerdo con el Documento de Visión (Grupo 22), el proceso de pago ha sido simulado sin almacenar datos bancarios reales.
              </p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button type="button" className="btn btn-primary" onClick={() => setOrderModalOpen(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
