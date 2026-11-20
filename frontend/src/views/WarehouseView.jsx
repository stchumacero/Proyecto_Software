import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  WarehouseIcon,
  ShieldIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  PackageIcon,
  TruckIcon,
  XIcon,
  SearchIcon,
  PlusIcon
} from '../components/Icons';

export function WarehouseView() {
  const { user } = useAuth();

  // Estados de inventario y pedidos desde el backend
  const [stockItems, setStockItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtros
  const [orderFilter, setOrderFilter] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal de Empaque y Generación de Precinto Suizo
  const [packagingOrder, setPackagingOrder] = useState(null);
  const [inspectionChecks, setInspectionChecks] = useState({
    opticalCheck: true,
    coscCheck: true,
    walnutBoxCheck: true,
    cryptoCertCheck: true
  });
  const [customSeal, setCustomSeal] = useState('');

  // Carga inicial de datos
  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [prodRes, ordRes] = await Promise.all([
        api.get('/api/products').catch(() => null),
        api.get('/api/orders').catch(() => null)
      ]);

      if (prodRes && prodRes.products) {
        setStockItems(prodRes.products.map(p => ({
          id: p.id,
          name: p.name,
          ref: p.reference,
          collection: p.collection,
          stock: p.stock,
          minStock: 3,
          location: p.id === 'W01' ? 'Cámara A - Bóveda 1' :
                    p.id === 'W02' ? 'Cámara B - Vitrina 3' :
                    p.id === 'W03' ? 'Cámara C - Vitrina 2' :
                    p.id === 'W04' ? 'Bóveda Alta Joyería' :
                    p.id === 'W05' ? 'Cámara D - Vitrina 1' : 'Bóveda E - Oro 18K',
          price: p.price
        })));
      } else {
        // Fallback local
        setStockItems([
          { id: 'W01', name: 'Élan Royal Noir', ref: 'ERN-2026-X', collection: 'Ediciones Especiales', stock: 7, minStock: 3, location: 'Cámara A - Bóveda 1', price: 7450 },
          { id: 'W02', name: 'Heritage Chronometer', ref: 'EHC-1936-COSC', collection: 'Clásicos & Tradición', stock: 12, minStock: 3, location: 'Cámara B - Vitrina 3', price: 5200 },
          { id: 'W03', name: 'Vanguard Diver 300', ref: 'EVD-300M-D', collection: 'Deportivos & Diver', stock: 9, minStock: 3, location: 'Cámara C - Vitrina 2', price: 4850 },
          { id: 'W04', name: 'Master Tourbillon Oro Rosa', ref: 'EMT-72H-OR', collection: 'Ediciones Especiales', stock: 3, minStock: 3, location: 'Bóveda Alta Joyería', price: 13900 },
          { id: 'W05', name: 'Grand Astral Chrono', ref: 'EAC-775-FLY', collection: 'Deportivos & Diver', stock: 14, minStock: 3, location: 'Cámara D - Vitrina 1', price: 6100 },
          { id: 'W06', name: 'Élan Imperial Aureum', ref: 'EIA-440-GOLD', collection: 'Clásicos & Tradición', stock: 5, minStock: 3, location: 'Bóveda E - Oro 18K', price: 11500 }
        ]);
      }

      if (ordRes && ordRes.orders) {
        setOrders(ordRes.orders);
      } else {
        // Fallback de demostración
        setOrders([
          { id: 'ELAN-849201', customer_name: 'Juan Perez', customer_email: 'juanperes@gmail.com', status: 'PAGADO', payment_method: 'QR', payment_reference: 'QR-BNB-88301', total_amount: 4850, created_at: '2026-11-16 10:15', security_seal: null, tracking_number: null, items: [{ product_name: 'Vanguard Diver 300', quantity: 1, unit_price: 4850 }] },
          { id: 'ELAN-310928', customer_name: 'Valerie Dubois', customer_email: 'valerie.dubois@geneve.ch', status: 'EN_PREPARACION', payment_method: 'DEPOSITO_BANCARIO', payment_reference: 'DEP-BNB-449102', total_amount: 5200, created_at: '2026-11-16 09:30', security_seal: null, tracking_number: null, items: [{ product_name: 'Heritage Chronometer', quantity: 1, unit_price: 5200 }] },
          { id: 'ELAN-552109', customer_name: 'Marcus Vance', customer_email: 'marcus.vance@zurich.ch', status: 'EMPAQUETADO', payment_method: 'PAYPAL', payment_reference: 'PAYID-MX99281', total_amount: 13900, created_at: '2026-11-15 16:45', security_seal: 'PREC-2026-CH9081', tracking_number: null, items: [{ product_name: 'Master Tourbillon Oro Rosa', quantity: 1, unit_price: 13900 }] },
          { id: 'ELAN-992014', customer_name: 'Helena Lindqvist', customer_email: 'helena.lind@nordic.se', status: 'ENTREGADO', payment_method: 'QR', payment_reference: 'QR-SIMPLE-11029', total_amount: 7450, created_at: '2026-11-14 11:00', security_seal: 'PREC-2026-CH7712', tracking_number: 'ELAN-TRK-8812-BO', items: [{ product_name: 'Élan Royal Noir', quantity: 1, unit_price: 7450 }] }
        ]);
      }
    } catch (err) {
      setErrorMsg('Error al conectar con la base de datos de almacén: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Ajuste y reposición de existencias en tiempo real
  const handleStockAdjust = async (productId, delta) => {
    const item = stockItems.find(p => p.id === productId);
    if (!item) return;
    const newStock = Math.max(0, item.stock + delta);

    try {
      await api.patch(`/api/products/${productId}/stock`, { stock: newStock });
      setStockItems(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
      setSuccessMsg(`Stock de ${item.name} actualizado exitosamente a ${newStock} unidades.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Error al actualizar existencias: ' + err.message);
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // Transición 1: PAGADO -> EN_PREPARACION
  const handleStartPreparation = async (orderId) => {
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status: 'EN_PREPARACION' });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'EN_PREPARACION' } : o));
      setSuccessMsg(`Pedido ${orderId} asignado a la mesa de preparación en taller.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Error al cambiar estado: ' + err.message);
    }
  };

  // Abrir Modal de Empaque y Precinto
  const handleOpenPackagingModal = (order) => {
    setPackagingOrder(order);
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    setCustomSeal(`PREC-2026-CH${randomHex}`);
    setInspectionChecks({
      opticalCheck: true,
      coscCheck: true,
      walnutBoxCheck: true,
      cryptoCertCheck: true
    });
  };

  // Transición 2: EN_PREPARACION -> EMPAQUETADO (Con Precinto de Seguridad)
  const handleConfirmPackaging = async () => {
    if (!packagingOrder) return;
    const sealCode = customSeal.trim() || `PREC-2026-CH${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await api.patch(`/api/orders/${packagingOrder.id}/status`, {
        status: 'EMPAQUETADO',
        security_seal: sealCode
      });
      setOrders(prev => prev.map(o => o.id === packagingOrder.id ? {
        ...o,
        status: 'EMPAQUETADO',
        security_seal: sealCode
      } : o));
      setSuccessMsg(`Pedido ${packagingOrder.id} empaquetado con éxito. Precinto emitido: ${sealCode}`);
      setPackagingOrder(null);
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      setErrorMsg('Error al registrar precinto y empaque: ' + err.message);
    }
  };

  // Transición 3: EMPAQUETADO -> EN_TRANSITO (Despacho a Courier)
  const handleDispatchCourier = async (orderId) => {
    const trackingCode = `ELAN-TRK-${Math.floor(1000 + Math.random() * 9000)}-BO`;
    try {
      await api.patch(`/api/orders/${orderId}/status`, {
        status: 'EN_TRANSITO',
        tracking_number: trackingCode
      });
      setOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        status: 'EN_TRANSITO',
        tracking_number: trackingCode
      } : o));
      setSuccessMsg(`Pedido ${orderId} despachado a DHL Express. Guía asignada: ${trackingCode}`);
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      setErrorMsg('Error al despachar pedido: ' + err.message);
    }
  };

  // Transición 4: EN_TRANSITO -> ENTREGADO (Finalización del Proceso)
  const handleFinalizeDelivery = async (orderId) => {
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status: 'ENTREGADO' });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'ENTREGADO' } : o));
      setSuccessMsg(`Proceso logístico finalizado: Pedido ${orderId} entregado satisfactoriamente al cliente.`);
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      setErrorMsg('Error al finalizar entrega: ' + err.message);
    }
  };

  // Filtrado de pedidos
  const filteredOrders = orders.filter(o => {
    const matchStatus = orderFilter === 'TODOS' || o.status === orderFilter;
    const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (o.customer_name && o.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (o.security_seal && o.security_seal.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (o.tracking_number && o.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div>
      {/* Cabecera del Módulo de Almacén */}
      <div className="page-header">
        <div className="page-titles">
          <span className="page-category">Subsistema de Logística & Inventario</span>
          <h2 className="page-title">Módulo de Almacén, Preparación & Empaque</h2>
          <p className="page-subtitle">
            Control de existencias de alta relojería, protocolo de empaque con precinto de seguridad suizo y despacho para entrega finalizada.
          </p>
        </div>

        {/* Badge de Operador Activo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.35)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.78rem',
          color: '#93c5fd'
        }}>
          <WarehouseIcon size={16} color="#60a5fa" />
          <span>Operador: <strong>{user?.email || 'almacen@elanwatches.com'}</strong> • Rol: <strong>{user?.role || 'ALMACEN'}</strong></span>
        </div>
      </div>

      {/* Alertas de Notificación */}
      {successMsg && (
        <div style={{
          padding: '0.85rem 1.25rem',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: 'var(--radius-sm)',
          color: '#34d399',
          fontSize: '0.82rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <CheckCircleIcon size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{
          padding: '0.85rem 1.25rem',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 'var(--radius-sm)',
          color: '#f87171',
          fontSize: '0.82rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <AlertTriangleIcon size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grilla de Métricas de Almacén */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card stat-card-total">
          <div className="stat-card-header">
            <span className="stat-label">Total Referencias</span>
            <div className="stat-icon-wrapper total" title="Variedad de modelos en almacén">
              <PackageIcon size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-value">{stockItems.length} <small className="stat-unit">modelos</small></span>
            <span className="stat-subtext">Catálogo en almacén</span>
          </div>
        </div>

        <div className="stat-card stat-card-active">
          <div className="stat-card-header">
            <span className="stat-label">Unidades en Bóveda</span>
            <div className="stat-icon-wrapper active" title="Total de existencias físicas disponibles">
              <WarehouseIcon size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-value green">
              {stockItems.reduce((acc, i) => acc + i.stock, 0)} <small className="stat-unit green">piezas</small>
            </span>
            <span className="stat-subtext">Stock físico en bóveda</span>
          </div>
        </div>

        <div className="stat-card stat-card-admins">
          <div className="stat-card-header">
            <span className="stat-label">Alertas Stock Crítico (≤ 3)</span>
            <div className="stat-icon-wrapper admins" title="Modelos con existencia igual o menor al umbral mínimo">
              <AlertTriangleIcon size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-value gold">
              {stockItems.filter(i => i.stock <= i.minStock).length} <small className="stat-unit gold">piezas</small>
            </span>
            <span className="stat-subtext">Reposición prioritaria</span>
          </div>
        </div>

        <div className="stat-card stat-card-total">
          <div className="stat-card-header">
            <span className="stat-label">Pedidos en Logística</span>
            <div className="stat-icon-wrapper total" title="Órdenes activas en preparación o tránsito">
              <TruckIcon size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-value">
              {orders.filter(o => o.status !== 'ENTREGADO').length} <small className="stat-unit">activos</small>
            </span>
            <span className="stat-subtext">En preparación o tránsito</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: CONTROL DE EXISTENCIAS Y REPOSICIÓN (HU19 / RF08, RF14) */}
      <div className="card card-luxury" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Control de Existencias en Bóveda Central (Stock Físico)
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Monitoreo y ajuste micrométrico de existencias persistido directamente en SQLite
            </span>
          </div>
          <span className="badge badge-almacen">HU19 • Control de Stock</span>
        </div>

        <div className="table-container" style={{ margin: 0 }}>
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Pieza de Relojería</th>
                <th>Colección</th>
                <th>Ubicación en Bóveda</th>
                <th style={{ textAlign: 'center' }}>Stock Físico</th>
                <th style={{ textAlign: 'center' }}>Stock Mínimo</th>
                <th>Estado Nivel</th>
                <th style={{ textAlign: 'center' }}>Ajuste de Stock</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map(item => {
                const isCritical = item.stock <= item.minStock;
                const isAgotado = item.stock === 0;
                return (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--gold-light)' }}>
                      {item.ref}
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{item.name}</strong>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {item.collection}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {item.location}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', color: isAgotado ? '#ef4444' : (isCritical ? '#fbbf24' : '#34d399') }}>
                      {item.stock}
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      {item.minStock}
                    </td>
                    <td>
                      {isAgotado ? (
                        <span className="badge badge-inactive" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)' }}>
                          ● AGOTADO
                        </span>
                      ) : isCritical ? (
                        <span className="badge badge-inactive" style={{ color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.1)' }}>
                          ⚠️ Reposición Crítica
                        </span>
                      ) : (
                        <span className="badge badge-active" style={{ fontSize: '0.68rem' }}>
                          ✓ Nivel Óptimo
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                          onClick={() => handleStockAdjust(item.id, -1)}
                          disabled={item.stock <= 0}
                          title="Restar 1 unidad"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', color: '#34d399' }}
                          onClick={() => handleStockAdjust(item.id, 1)}
                          title="Reponer 1 unidad"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-gold"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                          onClick={() => handleStockAdjust(item.id, 5)}
                          title="Entrada lote de 5 piezas"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECCIÓN 2: CONTROL DE PREPARACIÓN, EMPAQUE Y ENTREGA (HU22 / RF16 + Requisitos Docente) */}
      <div className="card card-luxury" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Mesa de Preparación, Sellado & Despacho de Pedidos
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Protocolo oficial de 5 etapas: Cobro Verificado &rarr; Preparación en Taller &rarr; Empaque & Precinto Suizo &rarr; En Tránsito &rarr; Entrega Finalizada
            </span>
          </div>
          <span className="badge badge-almacen">HU22 • Logística & Empaque</span>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'TODOS', label: 'Todos' },
              { id: 'PAGADO', label: '1. Pagados' },
              { id: 'EN_PREPARACION', label: '2. En Preparación' },
              { id: 'EMPAQUETADO', label: '3. Empacados' },
              { id: 'EN_TRANSITO', label: '4. En Tránsito' },
              { id: 'ENTREGADO', label: '5. Entregados' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                className={`btn ${orderFilter === f.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
                onClick={() => setOrderFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ maxWidth: '280px', width: '100%' }} className="search-input-wrapper">
            <SearchIcon size={14} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por código, cliente o guía..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem' }}
            />
          </div>
        </div>

        {/* Tabla de Gestión de Pedidos */}
        <div className="table-container" style={{ margin: 0 }}>
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Código Pedido</th>
                <th>Cliente & Destino</th>
                <th>Método de Cobro</th>
                <th>Estado de Flujo</th>
                <th>Precinto Suizo</th>
                <th>Guía Courier</th>
                <th style={{ textAlign: 'right' }}>Acción de Almacén</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No se encontraron pedidos con el filtro seleccionado.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--gold-light)', fontWeight: 600 }}>
                      {order.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.customer_name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.customer_email}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#93c5fd' }}>
                        {order.payment_method === 'QR' ? '📱 QR Simple' :
                         order.payment_method === 'DEPOSITO_BANCARIO' ? '🏦 Depósito' :
                         order.payment_method === 'PAYPAL' ? '💳 PayPal API' : order.payment_method}
                      </span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        Ref: {order.payment_reference || 'N/A'}
                      </div>
                    </td>
                    <td>
                      {order.status === 'PAGADO' && (
                        <span className="badge badge-inactive" style={{ color: '#60a5fa', borderColor: 'rgba(96, 165, 250, 0.4)', background: 'rgba(96, 165, 250, 0.1)', fontSize: '0.68rem' }}>
                          ● 1. Pagado (Pendiente Taller)
                        </span>
                      )}
                      {order.status === 'EN_PREPARACION' && (
                        <span className="badge badge-inactive" style={{ color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.4)', background: 'rgba(251, 191, 36, 0.1)', fontSize: '0.68rem' }}>
                          ⏳ 2. En Mesa de Taller
                        </span>
                      )}
                      {order.status === 'EMPAQUETADO' && (
                        <span className="badge badge-admin" style={{ fontSize: '0.68rem' }}>
                          📦 3. Empacado & Precintado
                        </span>
                      )}
                      {order.status === 'EN_TRANSITO' && (
                        <span className="badge badge-almacen" style={{ fontSize: '0.68rem' }}>
                          🚚 4. En Tránsito (Courier)
                        </span>
                      )}
                      {order.status === 'ENTREGADO' && (
                        <span className="badge badge-active" style={{ fontSize: '0.68rem' }}>
                          ✓ 5. Entregado & Finalizado
                        </span>
                      )}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: order.security_seal ? 'var(--gold-light)' : 'var(--text-muted)' }}>
                      {order.security_seal || '— Sin precinto —'}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: order.tracking_number ? '#60a5fa' : 'var(--text-muted)' }}>
                      {order.tracking_number || '— Pendiente despacho —'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {/* ACCIONES SEGÚN ROL ALMACÉN */}
                      {order.status === 'PAGADO' && (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem', borderColor: '#3b82f6', color: '#93c5fd' }}
                          onClick={() => handleStartPreparation(order.id)}
                        >
                          Iniciar Preparación &rarr;
                        </button>
                      )}

                      {order.status === 'EN_PREPARACION' && (
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}
                          onClick={() => handleOpenPackagingModal(order)}
                        >
                          📦 Empacar & Precinto Suizo &rarr;
                        </button>
                      )}

                      {order.status === 'EMPAQUETADO' && (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem', borderColor: 'var(--gold-primary)', color: 'var(--gold-light)' }}
                          onClick={() => handleDispatchCourier(order.id)}
                        >
                          🚚 Despachar a Courier &rarr;
                        </button>
                      )}

                      {order.status === 'EN_TRANSITO' && (
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem', background: 'var(--color-success)', color: '#08080a', borderColor: 'var(--color-success)' }}
                          onClick={() => handleFinalizeDelivery(order.id)}
                        >
                          ✓ Confirmar Entrega
                        </button>
                      )}

                      {order.status === 'ENTREGADO' && (
                        <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                          ✓ Proceso Cerrado
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE EMPAQUE Y PRECINTO SUIZO */}
      {packagingOrder && (
        <div className="modal-backdrop" onClick={() => setPackagingOrder(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Protocolo de Empaque & Precinto Suizo</h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Pedido: {packagingOrder.id} &bull; Cliente: {packagingOrder.customer_name}
                </span>
              </div>
              <button className="btn-icon" onClick={() => setPackagingOrder(null)}>
                <XIcon size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                El rol de <strong>ALMACÉN</strong> debe validar la lista de comprobación de calidad y emitir el precinto holográfico numerado antes de autorizar el despacho:
              </div>

              {/* Checklist de Control de Calidad */}
              <div style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-muted)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.8rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={inspectionChecks.opticalCheck}
                    onChange={(e) => setInspectionChecks({ ...inspectionChecks, opticalCheck: e.target.checked })}
                  />
                  <span>Inspección óptica microscópica de bisel, dial y cristal de zafiro</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.8rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={inspectionChecks.coscCheck}
                    onChange={(e) => setInspectionChecks({ ...inspectionChecks, coscCheck: e.target.checked })}
                  />
                  <span>Calibración de marcha cronométrica oficial COSC (+/- 2 seg/día)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.8rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={inspectionChecks.walnutBoxCheck}
                    onChange={(e) => setInspectionChecks({ ...inspectionChecks, walnutBoxCheck: e.target.checked })}
                  />
                  <span>Estuche de madera noble de nogal con forro de terciopelo y guantes</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.8rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={inspectionChecks.cryptoCertCheck}
                    onChange={(e) => setInspectionChecks({ ...inspectionChecks, cryptoCertCheck: e.target.checked })}
                  />
                  <span>Certificado de manufactura suiza con firma digital de atelier</span>
                </label>
              </div>

              {/* Generación de Precinto Suizo */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Número Único de Precinto Suizo de Alta Seguridad:
                </label>
                <input
                  type="text"
                  className="search-input"
                  value={customSeal}
                  onChange={(e) => setCustomSeal(e.target.value)}
                  style={{ width: '100%', fontFamily: 'monospace', fontWeight: 700, color: 'var(--gold-light)', fontSize: '0.95rem' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
                  El precinto es inviolable e intransferible. Queda registrado en la base de datos para verificación del cliente.
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setPackagingOrder(null)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmPackaging}
                disabled={!inspectionChecks.opticalCheck || !inspectionChecks.coscCheck || !inspectionChecks.walnutBoxCheck}
              >
                Sellar y Marcar como Empaquetado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nota de Aislamiento de Seguridad */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem 1.25rem',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <ShieldIcon size={20} color="var(--gold-primary)" />
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong>Aislamiento de Privilegios RBAC (HU27 / RF21):</strong> El operador con rol <code>ALMACEN</code> tiene control exclusivo sobre inventarios, preparación, precintos y despachos. Cualquier intento no autorizado de acceder a cuentas de usuarios o roles es rechazado automáticamente por el backend con <code>403 Forbidden</code>.
        </span>
      </div>
    </div>
  );
}
