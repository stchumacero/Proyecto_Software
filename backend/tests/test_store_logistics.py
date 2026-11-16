import pytest
import os
import tempfile
from werkzeug.security import generate_password_hash
from app import create_app
from database import get_db, seed_initial_products
from models import UserModel, ProductModel, OrderModel

@pytest.fixture
def test_app():
    db_fd, db_path = tempfile.mkstemp(suffix=".sqlite")
    
    app = create_app({
        'TESTING': True,
        'DATABASE_PATH': db_path,
        'SECRET_KEY': 'test_secret_key_12345',
        'SESSION_COOKIE_SECURE': False
    })

    with app.app_context():
        db = get_db()
        # Sembrar admin y almacen
        admin_hash = generate_password_hash("AdminPass123!")
        UserModel.create(db, "Administrador Test", "admin@elanwatches.com", admin_hash, "ADMINISTRADOR", "ACTIVO")

        almacen_hash = generate_password_hash("AlmacenPass123!")
        UserModel.create(db, "Operador Almacén", "almacen@elanwatches.com", almacen_hash, "ALMACEN", "ACTIVO")

        # Sembrar productos
        seed_initial_products(db)

    yield app

    os.close(db_fd)
    if os.path.exists(db_path):
        os.unlink(db_path)

@pytest.fixture
def client(test_app):
    return test_app.test_client()

def test_get_products_list_and_stock(client):
    """Prueba que el catálogo público devuelva los 6 relojes con existencias mayores a 0."""
    res = client.get('/api/products')
    assert res.status_code == 200
    data = res.get_json()
    assert len(data['products']) == 6
    for p in data['products']:
        assert p['stock'] > 0
        assert p['price'] > 1000

def test_checkout_with_qr_and_stock_decrement(client):
    """Prueba que una compra con QR disminuya el stock disponible de forma atómica."""
    # Stock inicial de W01 es 7
    res_before = client.get('/api/products/W01')
    initial_stock = res_before.get_json()['product']['stock']

    order_payload = {
        "customer_name": "Cliente Prueba QR",
        "customer_email": "cliente.qr@gmail.com",
        "payment_method": "QR",
        "payment_reference": "QR-BNB-TEST1234",
        "items": [
            {"product_id": "W01", "quantity": 2}
        ]
    }
    res_order = client.post('/api/orders/checkout', json=order_payload)
    assert res_order.status_code == 201
    order_data = res_order.get_json()['order']
    assert order_data['status'] == 'PAGADO'
    assert order_data['payment_method'] == 'QR'
    assert order_data['total_amount'] == 7450.0 * 2

    # Verificar decremento de stock a 5
    res_after = client.get('/api/products/W01')
    assert res_after.get_json()['product']['stock'] == initial_stock - 2

def test_checkout_insufficient_stock_fails(client):
    """Prueba que no se permita comprar más piezas de las que existen en bodega."""
    order_payload = {
        "customer_name": "Comprador Excesivo",
        "customer_email": "comprador@gmail.com",
        "payment_method": "PAYPAL",
        "items": [
            {"product_id": "W04", "quantity": 999}  # Solo hay 3 en stock
        ]
    }
    res = client.post('/api/orders/checkout', json=order_payload)
    assert res.status_code == 409
    assert res.get_json()['error'] == 'STOCK_INSUFFICIENT'

def test_almacen_workflow_preparation_packaging_delivery(client):
    """Prueba el ciclo logístico completo por el rol ALMACEN: PAGADO -> EN_PREPARACION -> EMPAQUETADO -> EN_TRANSITO -> ENTREGADO."""
    # 1. Crear pedido
    order_payload = {
        "customer_name": "Carlos Monasterios",
        "customer_email": "carlos.m@gmail.com",
        "payment_method": "DEPOSITO",
        "items": [
            {"product_id": "W03", "quantity": 1}
        ]
    }
    res_order = client.post('/api/orders/checkout', json=order_payload)
    order_id = res_order.get_json()['order']['id']

    # 2. Login como Almacén para obtener cookie y CSRF
    login_res = client.post('/api/auth/login', json={
        "email": "almacen@elanwatches.com",
        "password": "AlmacenPass123!"
    })
    assert login_res.status_code == 200
    csrf_token = login_res.get_json()['csrf_token']
    headers = {"X-CSRF-Token": csrf_token}

    # 3. Almacén toma el pedido para preparación
    res_prep = client.patch(f'/api/orders/{order_id}/status', json={"status": "EN_PREPARACION"}, headers=headers)
    assert res_prep.status_code == 200
    assert res_prep.get_json()['order']['status'] == 'EN_PREPARACION'

    # 4. Almacén completa empaque con precinto de seguridad suizo
    res_pack = client.patch(f'/api/orders/{order_id}/status', json={
        "status": "EMPAQUETADO",
        "security_seal": "PREC-CH-2026-99"
    }, headers=headers)
    assert res_pack.status_code == 200
    pack_data = res_pack.get_json()['order']
    assert pack_data['status'] == 'EMPAQUETADO'
    assert pack_data['security_seal'] == 'PREC-CH-2026-99'

    # 5. Despacho a distribución
    res_trans = client.patch(f'/api/orders/{order_id}/status', json={"status": "EN_TRANSITO"}, headers=headers)
    assert res_trans.status_code == 200
    assert res_trans.get_json()['order']['status'] == 'EN_TRANSITO'
    assert 'ELAN-TRK-' in res_trans.get_json()['order']['tracking_number']

    # 6. Finalización y entrega al cliente
    res_deliv = client.patch(f'/api/orders/{order_id}/status', json={"status": "ENTREGADO"}, headers=headers)
    assert res_deliv.status_code == 200
    assert res_deliv.get_json()['order']['status'] == 'ENTREGADO'
    assert res_deliv.get_json()['order']['delivered_at'] is not None

def test_public_tracking_endpoint(client):
    """Prueba que el endpoint público de rastreo devuelva el estado del pedido sin exponer datos sensibles."""
    order_payload = {
        "customer_name": "Cliente Privado",
        "customer_email": "privado@gmail.com",
        "payment_method": "QR",
        "items": [
            {"product_id": "W02", "quantity": 1}
        ]
    }
    res_order = client.post('/api/orders/checkout', json=order_payload)
    order_id = res_order.get_json()['order']['id']

    track_res = client.get(f'/api/orders/tracking/{order_id}')
    assert track_res.status_code == 200
    track_data = track_res.get_json()['order']
    assert track_data['id'] == order_id
    assert track_data['status'] == 'PAGADO'
    assert 'customer_email' not in track_data  # Privacidad
