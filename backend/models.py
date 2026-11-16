import sqlite3

class UserModel:
    """Modelo de operaciones para la entidad de Usuarios en SQLite."""

    @staticmethod
    def to_dict(row, include_hash=False):
        """Convierte una fila sqlite3.Row a diccionario, excluyendo por defecto el hash."""
        if row is None:
            return None
        
        user_dict = {
            "id": row["id"],
            "full_name": row["full_name"],
            "email": row["email"],
            "role": row["role"],
            "status": row["status"],
            "created_at": str(row["created_at"]) if row["created_at"] else None
        }
        if include_hash:
            user_dict["password_hash"] = row["password_hash"]
        return user_dict

    @staticmethod
    def find_by_id(db, user_id, include_hash=False):
        """Busca un usuario por su ID primario mediante consulta parametrizada."""
        cursor = db.execute(
            "SELECT id, full_name, email, password_hash, role, status, created_at FROM users WHERE id = ?",
            (user_id,)
        )
        row = cursor.fetchone()
        return UserModel.to_dict(row, include_hash=include_hash)

    @staticmethod
    def find_by_email(db, email, include_hash=False):
        """Busca un usuario por su correo electrónico único."""
        cursor = db.execute(
            "SELECT id, full_name, email, password_hash, role, status, created_at FROM users WHERE LOWER(email) = LOWER(?)",
            (email.strip(),)
        )
        row = cursor.fetchone()
        return UserModel.to_dict(row, include_hash=include_hash)

    @staticmethod
    def get_all(db):
        """Obtiene todos los usuarios ordenados por ID descendente. Sin hashes."""
        cursor = db.execute(
            "SELECT id, full_name, email, role, status, created_at FROM users ORDER BY id DESC"
        )
        rows = cursor.fetchall()
        return [UserModel.to_dict(row) for row in rows]

    @staticmethod
    def count_active_admins(db):
        """Cuenta el número de administradores activos en el sistema."""
        cursor = db.execute(
            "SELECT COUNT(*) as count FROM users WHERE role = 'ADMINISTRADOR' AND status = 'ACTIVO'"
        )
        row = cursor.fetchone()
        return row["count"] if row else 0

    @staticmethod
    def create(db, full_name, email, password_hash, role="CLIENTE", status="ACTIVO"):
        """Crea un nuevo usuario en la base de datos."""
        cursor = db.execute(
            """
            INSERT INTO users (full_name, email, password_hash, role, status)
            VALUES (?, LOWER(?), ?, ?, ?)
            """,
            (full_name.strip(), email.strip(), password_hash, role, status)
        )
        db.commit()
        return UserModel.find_by_id(db, cursor.lastrowid)

    @staticmethod
    def update(db, user_id, full_name, email, role, status):
        """Actualiza la información básica de un usuario."""
        db.execute(
            """
            UPDATE users
            SET full_name = ?, email = LOWER(?), role = ?, status = ?
            WHERE id = ?
            """,
            (full_name.strip(), email.strip(), role, status, user_id)
        )
        db.commit()
        return UserModel.find_by_id(db, user_id)

    @staticmethod
    def set_status(db, user_id, status):
        """Actualiza el estado (ACTIVO / INACTIVO) de un usuario para borrado lógico o reactivación."""
        db.execute(
            "UPDATE users SET status = ? WHERE id = ?",
            (status, user_id)
        )
        db.commit()
        return UserModel.find_by_id(db, user_id)


class ProductModel:
    """Modelo para la entidad de Productos (Relojes de Alta Gama) y Control de Stock."""

    @staticmethod
    def to_dict(row):
        if row is None:
            return None
        return {
            "id": row["id"],
            "name": row["name"],
            "reference": row["reference"],
            "collection": row["collection"],
            "price": float(row["price"]),
            "stock": int(row["stock"]),
            "image": row["image"],
            "description": row["description"],
            "movement": row["movement"],
            "case_material": row["case_material"],
            "dial": row["dial"],
            "strap": row["strap"],
            "created_at": str(row["created_at"]) if row["created_at"] else None
        }

    @staticmethod
    def get_all(db):
        cursor = db.execute("SELECT * FROM products ORDER BY price DESC")
        return [ProductModel.to_dict(r) for r in cursor.fetchall()]

    @staticmethod
    def find_by_id(db, product_id):
        cursor = db.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        return ProductModel.to_dict(cursor.fetchone())

    @staticmethod
    def update_stock(db, product_id, new_stock):
        if new_stock < 0:
            raise ValueError("El stock no puede ser negativo.")
        db.execute("UPDATE products SET stock = ? WHERE id = ?", (new_stock, product_id))
        db.commit()
        return ProductModel.find_by_id(db, product_id)

    @staticmethod
    def decrement_stock(db, product_id, quantity):
        """Decrementa de forma atómica el stock disponible si existe suficiente existencia."""
        cursor = db.execute("SELECT stock FROM products WHERE id = ?", (product_id,))
        row = cursor.fetchone()
        if not row:
            raise ValueError(f"Producto {product_id} no encontrado.")
        current_stock = row["stock"]
        if current_stock < quantity:
            raise ValueError(f"Stock insuficiente para {product_id}. Disponible: {current_stock}, Solicitado: {quantity}")
        
        db.execute("UPDATE products SET stock = stock - ? WHERE id = ?", (quantity, product_id))
        return current_stock - quantity


class OrderModel:
    """Modelo para Gestión de Pedidos, Métodos de Pago y Trazabilidad de Preparación y Entrega."""

    @staticmethod
    def to_dict(row, items=None):
        if row is None:
            return None
        order_dict = {
            "id": row["id"],
            "customer_name": row["customer_name"],
            "customer_email": row["customer_email"],
            "total_amount": float(row["total_amount"]),
            "payment_method": row["payment_method"],
            "payment_reference": row["payment_reference"],
            "status": row["status"],
            "security_seal": row["security_seal"],
            "tracking_number": row["tracking_number"],
            "prepared_by": row["prepared_by"],
            "delivered_at": str(row["delivered_at"]) if row["delivered_at"] else None,
            "created_at": str(row["created_at"]) if row["created_at"] else None,
            "updated_at": str(row["updated_at"]) if row["updated_at"] else None,
            "items": items or []
        }
        return order_dict

    @staticmethod
    def get_items(db, order_id):
        cursor = db.execute(
            "SELECT id, order_id, product_id, product_name, unit_price, quantity, subtotal FROM order_items WHERE order_id = ?",
            (order_id,)
        )
        return [dict(r) for r in cursor.fetchall()]

    @staticmethod
    def get_all(db, status=None):
        if status:
            cursor = db.execute("SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC", (status,))
        else:
            cursor = db.execute("SELECT * FROM orders ORDER BY created_at DESC")
        orders = []
        for r in cursor.fetchall():
            items = OrderModel.get_items(db, r["id"])
            orders.append(OrderModel.to_dict(r, items))
        return orders

    @staticmethod
    def find_by_id(db, order_id):
        cursor = db.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        row = cursor.fetchone()
        if not row:
            return None
        items = OrderModel.get_items(db, order_id)
        return OrderModel.to_dict(row, items)

    @staticmethod
    def find_by_customer_email(db, email):
        cursor = db.execute("SELECT * FROM orders WHERE LOWER(customer_email) = LOWER(?) ORDER BY created_at DESC", (email.strip(),))
        orders = []
        for r in cursor.fetchall():
            items = OrderModel.get_items(db, r["id"])
            orders.append(OrderModel.to_dict(r, items))
        return orders

    @staticmethod
    def create(db, order_id, customer_name, customer_email, total_amount, payment_method, payment_reference, items):
        """Crea un pedido con sus items y decrementa el stock de cada producto en una sola transacción."""
        # 1. Verificar y descontar stock para cada producto
        for item in items:
            product_id = item["product_id"]
            quantity = int(item["quantity"])
            ProductModel.decrement_stock(db, product_id, quantity)

        # 2. Insertar pedido maestro
        db.execute(
            """
            INSERT INTO orders (
                id, customer_name, customer_email, total_amount,
                payment_method, payment_reference, status
            ) VALUES (?, ?, ?, ?, ?, ?, 'PAGADO')
            """,
            (order_id, customer_name.strip(), customer_email.strip(), float(total_amount), payment_method, payment_reference)
        )

        # 3. Insertar items del pedido
        for item in items:
            db.execute(
                """
                INSERT INTO order_items (
                    order_id, product_id, product_name, unit_price, quantity, subtotal
                ) VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    order_id,
                    item["product_id"],
                    item["product_name"],
                    float(item["unit_price"]),
                    int(item["quantity"]),
                    float(item["unit_price"]) * int(item["quantity"])
                )
            )

        db.commit()
        return OrderModel.find_by_id(db, order_id)

    @staticmethod
    def update_status(db, order_id, new_status, operator_name=None, security_seal=None, tracking_number=None):
        """Actualiza el estado de preparación, empaque o entrega del pedido."""
        valid_statuses = ('PAGADO', 'EN_PREPARACION', 'EMPAQUETADO', 'EN_TRANSITO', 'ENTREGADO')
        if new_status not in valid_statuses:
            raise ValueError(f"Estado inválido: {new_status}")

        order = OrderModel.find_by_id(db, order_id)
        if not order:
            return None

        # Preparar campos dinámicos
        updates = ["status = ?", "updated_at = CURRENT_TIMESTAMP"]
        params = [new_status]

        if operator_name:
            updates.append("prepared_by = ?")
            params.append(operator_name)
        if security_seal:
            updates.append("security_seal = ?")
            params.append(security_seal)
        if tracking_number:
            updates.append("tracking_number = ?")
            params.append(tracking_number)
        if new_status == 'ENTREGADO':
            updates.append("delivered_at = CURRENT_TIMESTAMP")

        params.append(order_id)
        query = f"UPDATE orders SET {', '.join(updates)} WHERE id = ?"
        db.execute(query, tuple(params))
        db.commit()
        return OrderModel.find_by_id(db, order_id)

