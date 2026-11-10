import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { WarehouseIcon, ShieldIcon, CheckCircleIcon, AlertTriangleIcon } from '../components/Icons';

export function WarehouseView() {
  const { user } = useAuth();

  // Datos simulados de inventario físico según Visión del Proyecto Grupo 22
  const [stockItems, setStockItems] = useState([
    { id: 'W01', name: 'Élan Royal Noir', ref: 'ERN-2026-X', collection: 'Ediciones Especiales', stock: 7, minStock: 3, location: 'Cámara A - Bóveda 1' },
    { id: 'W02', name: 'Heritage Chronometer', ref: 'EHC-1936-COSC', collection: 'Clásicos & Tradición', stock: 12, minStock: 5, location: 'Cámara B - Vitrina 3' },
    { id: 'W03', name: 'Vanguard Diver 300', ref: 'EVD-300M-D', collection: 'Deportivos & Diver', stock: 9, minStock: 4, location: 'Cámara C - Vitrina 2' },
    { id: 'W04', name: 'Master Tourbillon Oro Rosa', ref: 'EMT-72H-OR', collection: 'Ediciones Especiales', stock: 3, minStock: 3, location: 'Cámara Seguridad Alta Joyería' }
  ]);

  const [pendingOrders, setPendingOrders] = useState([
    { id: 'ELAN-849201', customer: 'Juan Perez', watch: 'Vanguard Diver 300', qty: 1, status: 'PENDIENTE', date: '2026-10-16 13:25' },
    { id: 'ELAN-310928', customer: 'Valerie Dubois', watch: 'Heritage Chronometer', qty: 1, status: 'PREPARADO', date: '2026-10-16 11:10' }
  ]);

  const markAsPrepared = (orderId) => {
    setPendingOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'PREPARADO' } : o));
  };

  return (
    <div>
      {/* Cabecera del Módulo de Almacén */}
      <div className="page-header">
        <div className="page-titles">
          <span className="page-category">Subsistema de Logística & Inventario</span>
          <h2 className="page-title">Módulo de Almacén e Inventario</h2>
          <p className="page-subtitle">
            Control de existencias de alta relojería suiza, movimientos de bodega y preparación de pedidos para distribución.
          </p>
        </div>

        {/* Badge de Seguridad y Trazabilidad con Visión 22 */}
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
          <span>HU19–HU22 / RF08, RF14, RF16 • Visión Grupo 22</span>
        </div>
      </div>

      {/* Grilla de Métricas de Almacén */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-label">Total Referencias</span>
          <span className="stat-value">{stockItems.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Unidades en Bóveda</span>
          <span className="stat-value green">
            {stockItems.reduce((acc, i) => acc + i.stock, 0)} piezas
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Alertas Stock Mínimo</span>
          <span className="stat-value gold">1 pieza crítica</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pedidos en Preparación</span>
          <span className="stat-value">
            {pendingOrders.filter(o => o.status === 'PENDIENTE').length}
          </span>
        </div>
      </div>

      {/* Sección 1: Control de Existencias (HU19, HU20, HU21 / RF08, RF14) */}
      <div className="card card-luxury" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Existencias de Piezas de Alta Relojería (Stock Real)
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Monitoreo continuo de existencias físicas y umbrales de seguridad para reabastecimiento
            </span>
          </div>
          <span className="badge badge-almacen">HU19 • Existencias</span>
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
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map(item => {
                const isCritical = item.stock <= item.minStock;
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
                    <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '1rem', color: isCritical ? '#f87171' : '#34d399' }}>
                      {item.stock}
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      {item.minStock}
                    </td>
                    <td>
                      {isCritical ? (
                        <span className="badge badge-inactive" style={{ fontSize: '0.68rem' }}>
                          ⚠️ Reposición Sugerida
                        </span>
                      ) : (
                        <span className="badge badge-active" style={{ fontSize: '0.68rem' }}>
                          ✓ Nivel Óptimo
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección 2: Preparación de Pedidos Confirmados (HU22 / RF16) */}
      <div className="card card-luxury" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Pedidos Confirmados Pendientes de Empaque & Preparación
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Verificación técnica de estuche de lujo, certificado cronométrico y garantía internacional
            </span>
          </div>
          <span className="badge badge-almacen">HU22 • Preparación</span>
        </div>

        <div className="table-container" style={{ margin: 0 }}>
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Código Pedido</th>
                <th>Cliente</th>
                <th>Pieza Solicitada</th>
                <th>Fecha Confirmación</th>
                <th>Estado de Preparación</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--gold-light)' }}>
                    {order.id}
                  </td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {order.customer}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {order.watch} (x{order.qty})
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {order.date}
                  </td>
                  <td>
                    {order.status === 'PREPARADO' ? (
                      <span className="badge badge-active" style={{ fontSize: '0.68rem' }}>
                        ✓ Listo para Asignar a Repartidor
                      </span>
                    ) : (
                      <span className="badge badge-inactive" style={{ fontSize: '0.68rem' }}>
                        ⏳ En Espera de Empaque
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {order.status === 'PENDIENTE' ? (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}
                        onClick={() => markAsPrepared(order.id)}
                      >
                        Marcar Preparado
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Completado
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
          <strong>Aislamiento de Privilegios RBAC (HU27 / RF21):</strong> El perfil <code>ALMACEN</code> tiene acceso restringido a la gestión de existencias y preparación. El backend de Flask bloquea automáticamente cualquier intento de consulta o modificación sobre la tabla de usuarios con error <code>403 Forbidden</code>.
        </span>
      </div>
    </div>
  );
}
