"""
Módulo de Rutas de Comercio Electrónico, Pagos y Logística de Élan Watches.
Cubre:
1. Control de Stock y Existencias de Productos (/api/products).
2. Procesamiento de Pagos con QR, Depósito Bancario y PayPal (/api/orders/checkout).
3. Preparación, Empaque y Trazabilidad por Almacén (/api/orders/<id>/status).
4. Control de Despacho y Entrega Finalizada.
"""

import uuid
from flask import Blueprint, request, jsonify, session
from database import get_db
from models import ProductModel, OrderModel
from decorators import login_required, roles_required, csrf_protect

store_bp = Blueprint("store", __name__, url_prefix="/api")


# ==========================================
# 1. CONTROL DE PRODUCTOS Y STOCK
# ==========================================

@store_bp.route("/products", methods=["GET"])
def get_products():
    """Retorna el catálogo completo con el stock disponible actualizado en tiempo real."""
    db = get_db()
    products = ProductModel.get_all(db)
    return jsonify({
        "products": products,
        "total": len(products)
    }), 200


@store_bp.route("/products/<product_id>", methods=["GET"])
def get_product(product_id):
    """Retorna el detalle técnico y existencias de un producto específico."""
    db = get_db()
    product = ProductModel.find_by_id(db, product_id)
    if not product:
        return jsonify({"error": "NOT_FOUND", "message": f"Producto '{product_id}' no encontrado."}), 404
    return jsonify({"product": product}), 200


@store_bp.route("/products/<product_id>/stock", methods=["PATCH"])
@login_required
@roles_required("ALMACEN", "ADMINISTRADOR")
@csrf_protect
def update_product_stock(product_id):
    """Permite al operador de Almacén o Administrador ajustar o reabastecer el stock."""
    db = get_db()
    data = request.get_json() or {}
    new_stock = data.get("stock")

    if new_stock is None or not isinstance(new_stock, int) or new_stock < 0:
        return jsonify({"error": "BAD_REQUEST", "message": "El stock debe ser un entero mayor o igual a 0."}), 400

    try:
        updated = ProductModel.update_stock(db, product_id, new_stock)
        return jsonify({
            "message": f"Stock de {updated['name']} actualizado exitosamente a {new_stock} unidades.",
            "product": updated
        }), 200
    except Exception as e:
        return jsonify({"error": "SERVER_ERROR", "message": str(e)}), 500


# ==========================================
# 2. CHECKOUT Y PASARELAS DE PAGO (QR, DEPÓSITO, PAYPAL)
# ==========================================

@store_bp.route("/orders/checkout", methods=["POST"])
def create_order():
    """
    Procesa la compra del cliente:
    - Valida disponibilidad de stock para cada reloj.
    - Reduce de forma atómica el stock disponible en SQLite.
    - Registra el método de pago (QR, DEPOSITO, PAYPAL).
    - Crea la orden en estado 'PAGADO' lista para preparación en almacén.
    """
    db = get_db()
    data = request.get_json() or {}

    customer_name = (data.get("customer_name") or "").strip()
    customer_email = (data.get("customer_email") or "").strip().lower()
    payment_method = (data.get("payment_method") or "").upper().strip()
    payment_reference = (data.get("payment_reference") or "").strip()
    items = data.get("items") or []

    if not customer_name:
        return jsonify({"error": "BAD_REQUEST", "message": "El nombre del cliente es obligatorio."}), 400
    if not customer_email or "@" not in customer_email:
        return jsonify({"error": "BAD_REQUEST", "message": "Correo electrónico del cliente no válido."}), 400
    if payment_method not in ("QR", "DEPOSITO", "PAYPAL"):
        return jsonify({"error": "BAD_REQUEST", "message": "Método de pago no permitido. Use 'QR', 'DEPOSITO' o 'PAYPAL'."}), 400
    if not items or not isinstance(items, list):
        return jsonify({"error": "BAD_REQUEST", "message": "La orden debe contener al menos un producto."}), 400

    # Validar formato de items y calcular total
    total_amount = 0.0
    validated_items = []
    for it in items:
        prod_id = it.get("product_id") or it.get("id")
        qty = int(it.get("quantity") or it.get("qty") or 1)
        if qty <= 0:
            return jsonify({"error": "BAD_REQUEST", "message": "La cantidad debe ser mayor a 0."}), 400

        product = ProductModel.find_by_id(db, prod_id)
        if not product:
            return jsonify({"error": "NOT_FOUND", "message": f"El producto {prod_id} no existe en catálogo."}), 404

        if product["stock"] < qty:
            return jsonify({
                "error": "STOCK_INSUFFICIENT",
                "message": f"Stock insuficiente para '{product['name']}'. Disponible: {product['stock']}, Solicitado: {qty}."
            }), 409

        subtotal = product["price"] * qty
        total_amount += subtotal
        validated_items.append({
            "product_id": product["id"],
            "product_name": product["name"],
            "unit_price": product["price"],
            "quantity": qty,
            "subtotal": subtotal
        })

    # Generar ID de pedido único
    order_id = "ELAN-" + str(uuid.uuid4().hex[:6]).upper()

    # Si no se pasó referencia de pago, generar una representativa
    if not payment_reference:
        if payment_method == "QR":
            payment_reference = f"QR-BNB-{uuid.uuid4().hex[:8].upper()}"
        elif payment_method == "PAYPAL":
            payment_reference = f"PAYID-{uuid.uuid4().hex[:12].upper()}"
        else:
            payment_reference = f"DEP-BO-{uuid.uuid4().hex[:8].upper()}"

    try:
        new_order = OrderModel.create(
            db=db,
            order_id=order_id,
            customer_name=customer_name,
            customer_email=customer_email,
            total_amount=total_amount,
            payment_method=payment_method,
            payment_reference=payment_reference,
            items=validated_items
        )

        return jsonify({
            "message": "¡Pago confirmado con éxito! Pedido registrado y asignado a almacén.",
            "order": new_order
        }), 201

    except ValueError as val_err:
        return jsonify({"error": "STOCK_ERROR", "message": str(val_err)}), 409
    except Exception as e:
        return jsonify({"error": "CHECKOUT_FAILED", "message": str(e)}), 500


# ==========================================
# 3. GESTIÓN DE PEDIDOS Y LOGÍSTICA (ALMACÉN Y CLIENTE)
# ==========================================

@store_bp.route("/orders", methods=["GET"])
@login_required
def get_orders():
    """
    Retorna pedidos:
    - Si es ADMINISTRADOR o ALMACEN: retorna todos los pedidos para preparación.
    - Si es CLIENTE: retorna únicamente sus propios pedidos.
    """
    db = get_db()
    role = session.get("user_role")
    user_email = session.get("user_email")
    status_filter = request.args.get("status")

    if role in ("ADMINISTRADOR", "ALMACEN"):
        orders = OrderModel.get_all(db, status=status_filter)
    else:
        orders = OrderModel.find_by_customer_email(db, user_email or "")

    return jsonify({
        "orders": orders,
        "count": len(orders)
    }), 200


@store_bp.route("/orders/<order_id>", methods=["GET"])
@login_required
def get_order_detail(order_id):
    """Consulta detallada de un pedido con su lista de piezas."""
    db = get_db()
    order = OrderModel.find_by_id(db, order_id)
    if not order:
        return jsonify({"error": "NOT_FOUND", "message": "Pedido no encontrado."}), 404
    return jsonify({"order": order}), 200


@store_bp.route("/orders/tracking/<order_id>", methods=["GET"])
def track_order_public(order_id):
    """Consulta pública de rastreo de pedido para clientes mediante su código de orden."""
    db = get_db()
    order = OrderModel.find_by_id(db, order_id.strip().upper())
    if not order:
        return jsonify({"error": "NOT_FOUND", "message": f"No se encontró ningún pedido con código '{order_id}'."}), 404

    # Retornar datos de seguimiento sin exponer información sensible
    return jsonify({
        "order": {
            "id": order["id"],
            "status": order["status"],
            "payment_method": order["payment_method"],
            "total_amount": order["total_amount"],
            "security_seal": order["security_seal"],
            "tracking_number": order["tracking_number"],
            "prepared_by": order["prepared_by"],
            "created_at": order["created_at"],
            "delivered_at": order["delivered_at"],
            "items_count": len(order.get("items", []))
        }
    }), 200


@store_bp.route("/orders/<order_id>/status", methods=["PATCH"])
@login_required
@roles_required("ALMACEN", "ADMINISTRADOR")
@csrf_protect
def update_order_status(order_id):
    """
    Control de preparación, empaque y entrega por roles autorizados:
    - ALMACEN:
        PAGADO ➔ EN_PREPARACION (inicia revisión física en bóveda)
        EN_PREPARACION ➔ EMPAQUETADO (coloca estuche de lujo y precinto suizo)
    - ALMACEN / DISTRIBUCIÓN:
        EMPAQUETADO ➔ EN_TRANSITO (asigna número de guía de custodia)
        EN_TRANSITO ➔ ENTREGADO (cliente recibe y finaliza el proceso)
    """
    db = get_db()
    data = request.get_json() or {}
    new_status = (data.get("status") or "").upper().strip()
    security_seal = data.get("security_seal")
    tracking_number = data.get("tracking_number")

    operator_name = session.get("user_name") or session.get("user_email") or "Operador Almacén"

    order = OrderModel.find_by_id(db, order_id)
    if not order:
        return jsonify({"error": "NOT_FOUND", "message": f"Pedido '{order_id}' no encontrado."}), 404

    # Autogenerar precinto de seguridad si pasa a EMPAQUETADO
    if new_status == "EMPAQUETADO" and not security_seal:
        security_seal = f"PREC-2026-CH{uuid.uuid4().hex[:6].upper()}"

    # Autogenerar número de rastreo si pasa a EN_TRANSITO
    if new_status == "EN_TRANSITO" and not tracking_number:
        tracking_number = f"ELAN-TRK-{uuid.uuid4().hex[:8].upper()}-BO"

    try:
        updated_order = OrderModel.update_status(
            db=db,
            order_id=order_id,
            new_status=new_status,
            operator_name=operator_name,
            security_seal=security_seal,
            tracking_number=tracking_number
        )

        return jsonify({
            "message": f"Pedido {order_id} actualizado a estado '{new_status}' exitosamente.",
            "order": updated_order
        }), 200

    except ValueError as val_err:
        return jsonify({"error": "INVALID_STATUS", "message": str(val_err)}), 400
    except Exception as e:
        return jsonify({"error": "UPDATE_FAILED", "message": str(e)}), 500


# ==========================================
# 4. SIMULACIÓN Y ENDPOINTS DE PAYPAL API REST
# ==========================================

@store_bp.route("/payments/paypal/create-order", methods=["POST"])
def paypal_create_order():
    """
    Endpoint compatible con PayPal REST API v2 /v2/checkout/orders:
    Genera un orderId de PayPal para el flujo de pago con SDK o ventana modal.
    """
    data = request.get_json() or {}
    amount = data.get("amount") or 0.0

    paypal_order_id = f"PAYID-{uuid.uuid4().hex[:16].upper()}"

    return jsonify({
        "id": paypal_order_id,
        "status": "CREATED",
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "reference_id": f"ELAN-REF-{uuid.uuid4().hex[:6].upper()}",
                "amount": {
                    "currency_code": "USD",
                    "value": str(amount)
                },
                "payee": {
                    "email_address": "payments@elanwatches.com",
                    "merchant_id": "ELAN_SWISS_LUXURY_MERCHANT"
                }
            }
        ]
    }), 200


@store_bp.route("/payments/paypal/capture-order", methods=["POST"])
def paypal_capture_order():
    """
    Endpoint compatible con PayPal REST API v2 /v2/checkout/orders/{id}/capture:
    Confirma la captura exitosa del pago a través de PayPal.
    """
    data = request.get_json() or {}
    order_id = data.get("order_id") or f"PAYID-{uuid.uuid4().hex[:12].upper()}"

    return jsonify({
        "id": order_id,
        "status": "COMPLETED",
        "payer": {
            "name": {"given_name": "Comprador", "surname": "Élan VIP"},
            "email_address": "comprador.paypal@elanwatches.com"
        },
        "purchase_units": [
            {
                "payments": {
                    "captures": [
                        {
                            "id": f"CAP-{uuid.uuid4().hex[:12].upper()}",
                            "status": "COMPLETED",
                            "seller_protection": {"status": "ELIGIBLE"}
                        }
                    ]
                }
            }
        ]
    }), 200
