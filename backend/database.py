import sqlite3
import os
from flask import g, current_app

def get_db():
    """Obtiene o crea una conexión SQLite para el contexto de la petición actual."""
    if 'db' not in g:
        db_path = current_app.config['DATABASE_PATH']
        # Asegurar que el directorio de la base de datos exista
        os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
        
        g.db = sqlite3.connect(db_path)
        g.db.row_factory = sqlite3.Row
        # Habilitar claves foráneas
        g.db.execute("PRAGMA foreign_keys = ON;")
    return g.db

def close_db(e=None):
    """Cierra la conexión a la base de datos al finalizar la petición."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

def seed_initial_users(db):
    """Siembra los usuarios del subsistema si la base de datos se crea por primera vez."""
    from werkzeug.security import generate_password_hash

    initial_users = [
        (
            "Administrador Principal",
            "admin@elanwatches.com",
            generate_password_hash("AdminPass2026!"),
            "ADMINISTRADOR",
            "ACTIVO"
        ),
        (
            "Gerard Perregaux - Master Almacen",
            "gerard@elanwatches.com",
            generate_password_hash("AlmacenPass2026!"),
            "ALMACEN",
            "INACTIVO"
        ),
        (
            "Administrador Steffany",
            "tif.prom.2019@gmail.com",
            generate_password_hash("AdminPass2026!"),
            "ADMINISTRADOR",
            "ACTIVO"
        ),
        (
            "Juan Perez",
            "juanperes@gmail.com",
            generate_password_hash("12345678"),
            "CLIENTE",
            "ACTIVO"
        ),
        (
            "Operador Almacén Activo",
            "almacen@elanwatches.com",
            generate_password_hash("AlmacenPass2026!"),
            "ALMACEN",
            "ACTIVO"
        ),
    ]

    for full_name, email, pwd_hash, role, status in initial_users:
        db.execute(
            """
            INSERT OR IGNORE INTO users (full_name, email, password_hash, role, status)
            VALUES (?, LOWER(?), ?, ?, ?)
            """,
            (full_name, email, pwd_hash, role, status)
        )
    db.commit()
    print("[ÉLAN] Base de datos inicializada y sembrada con usuarios de prueba.")

def seed_initial_products(db):
    """Siembra el catálogo de relojes de alta gama y existencias en inventario."""
    watches = [
        (
            "W01",
            "Élan Royal Noir",
            "REF. ERN-2026-X",
            "EDICIONES ESPECIALES",
            7450.0,
            7,
            "/images/elan-royal-noir.jpg",
            "Pieza insignia con caja de titanio DLC y calibre manufactura de alta frecuencia.",
            "Calibre Automático Élan 8100 (28,800 alt/h)",
            "Titanio Grado 5 con acabado DLC Negro Mate (41 mm)",
            "Esfera esqueleto con puentes angulados y rodiados a mano",
            "Caucho vulcanizado premium con hebilla desplegable en titanio"
        ),
        (
            "W02",
            "Heritage Chronometer",
            "REF. EHC-1936-COSC",
            "CLÁSICOS & TRADICIÓN",
            5200.0,
            12,
            "/images/heritage-chronometer.jpg",
            "Inspirado en los cronómetros suizos de navegación histórica. Certificado COSC.",
            "Calibre Manual Élan Heritage 1936 (Certificado Oficial COSC)",
            "Acero Inoxidable 316L pulido a espejo (39 mm)",
            "Esmalte Grand Feu marfil con números Breguet aplicados en oro",
            "Cuero genuino de aligátor marrón cosido a mano con puntada artesanal"
        ),
        (
            "W03",
            "Vanguard Diver 300",
            "REF. EVD-300M-D",
            "DEPORTIVOS & DIVER",
            4850.0,
            9,
            "/images/vanguard-diver-300.jpg",
            "Instrumento profesional con hermeticidad de 300 metros y válvula de escape de helio.",
            "Calibre Automático Antimagnético Élan Diver 300",
            "Acero 904L ultra-resistente a corrosión marina (42 mm)",
            "Negro abisal con índices tridimensionales Super-LumiNova Grado X1",
            "Brazalete de acero con extensión de buceo micro-ajustable"
        ),
        (
            "W04",
            "Master Tourbillon Nocturne",
            "REF. EMT-72H-OR",
            "EDICIONES ESPECIALES",
            13900.0,
            3,
            "/images/master-tourbillon-nocturne.jpg",
            "La máxima cumbre de la alta relojería artesanal: jaula de tourbillon ultraligera.",
            "Tourbillon Volante de 60 segundos Élan Tourbillon T-01 (72h reserva)",
            "Oro Blanco macizo de 18 quilates con fondo zafiro (41 mm)",
            "Guilloché realizado artesanalmente con apertura calada a las 6h",
            "Piel de caimán negro de escama cuadrada con cierre desplegable en oro 18K"
        ),
        (
            "W05",
            "Grand Astral Chrono",
            "REF. EAC-775-FLY",
            "DEPORTIVOS & DIVER",
            6100.0,
            14,
            "/images/grand-astral-chrono.jpg",
            "Cronógrafo de alta precisión con función de retorno al vuelo inmediato (Flyback).",
            "Calibre Automático Cronógrafo Flyback con rueda de pilares",
            "Acero 316L con bisel en taquímetro cerámico azul (42 mm)",
            "Azul petróleo con rayos de sol y subesferas plateadas azuleadas",
            "Correa de caucho náutico azul con pespuntes en contraste"
        ),
        (
            "W06",
            "Élan Imperial Aureum",
            "REF. EIA-440-GOLD",
            "CLÁSICOS & TRADICIÓN",
            11500.0,
            5,
            "/images/elan-imperial-aureum.jpg",
            "Símbolo indiscutible de distinción y elegancia perpetua forjado en oro noble suizo.",
            "Calibre Automático Ultra-Slim Élan 440 (espesor de 3.2 mm)",
            "Oro Amarillo macizo de 18 quilates (40 mm)",
            "Marfil guilloché rayos de sol con manecillas de hoja doradas",
            "Brazalete eslabonado en oro 18 quilates con cierre invisible"
        ),
    ]

    for w in watches:
        db.execute(
            """
            INSERT OR REPLACE INTO products (
                id, name, reference, collection, price, stock,
                image, description, movement, case_material, dial, strap
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            w
        )
    db.commit()
    print("[ÉLAN] Catálogo de productos y existencias inicializado.")

def seed_initial_orders(db):
    """Siembra pedidos iniciales de demostración en diferentes estados de preparación y entrega."""
    sample_orders = [
        (
            "ELAN-849201",
            "Juan Perez",
            "juanperes@gmail.com",
            4850.0,
            "QR",
            "QR-BNB-849201938",
            "PAGADO",
            None,
            None,
            None,
            None
        ),
        (
            "ELAN-310928",
            "Valerie Dubois",
            "valerie.dubois@geneve-watches.ch",
            5200.0,
            "PAYPAL",
            "PAYID-M8X92K109283",
            "EN_PREPARACION",
            None,
            None,
            "Operador Almacén",
            None
        ),
        (
            "ELAN-772109",
            "Steffany Chumacero",
            "tif.prom.2019@gmail.com",
            7450.0,
            "DEPOSITO",
            "DEP-BNB-772109",
            "EMPAQUETADO",
            "PREC-2026-CH911",
            "ELAN-TRK-772109-BO",
            "Operador Almacén",
            None
        ),
        (
            "ELAN-551902",
            "Carlos Mendoza",
            "cmendoza@gmail.com",
            6100.0,
            "PAYPAL",
            "PAYID-A11902K3312",
            "ENTREGADO",
            "PREC-2026-CH704",
            "ELAN-TRK-551902-BO",
            "Operador Almacén",
            "2026-11-15 16:40:00"
        ),
    ]

    for ord_data in sample_orders:
        db.execute(
            """
            INSERT OR IGNORE INTO orders (
                id, customer_name, customer_email, total_amount, payment_method,
                payment_reference, status, security_seal, tracking_number,
                prepared_by, delivered_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            ord_data
        )

    # Insertar items de ejemplo para los pedidos
    order_items = [
        ("ELAN-849201", "W03", "Vanguard Diver 300", 4850.0, 1, 4850.0),
        ("ELAN-310928", "W02", "Heritage Chronometer", 5200.0, 1, 5200.0),
        ("ELAN-772109", "W01", "Élan Royal Noir", 7450.0, 1, 7450.0),
        ("ELAN-551902", "W05", "Grand Astral Chrono", 6100.0, 1, 6100.0),
    ]

    for itm in order_items:
        db.execute(
            """
            INSERT OR IGNORE INTO order_items (
                order_id, product_id, product_name, unit_price, quantity, subtotal
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            itm
        )

    db.commit()
    print("[ÉLAN] Pedidos iniciales de demostración sembrados exitosamente.")

def init_db(app):
    """Inicializa la estructura de la base de datos si no existe.
    No sobrescribe ni borra los datos existentes.
    """
    with app.app_context():
        db = get_db()
        schema_sql = """
        -- 1. Tabla de Usuarios del Subsistema de Seguridad
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE COLLATE NOCASE,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('ADMINISTRADOR', 'ALMACEN', 'CLIENTE')),
            status TEXT NOT NULL DEFAULT 'ACTIVO' CHECK(status IN ('ACTIVO', 'INACTIVO')),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

        -- 2. Tabla de Catálogo de Productos y Existencias (Control de Stock)
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            reference TEXT NOT NULL,
            collection TEXT NOT NULL,
            price REAL NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
            image TEXT NOT NULL,
            description TEXT NOT NULL,
            movement TEXT,
            case_material TEXT,
            dial TEXT,
            strap TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection);

        -- 3. Tabla de Pedidos y Trazabilidad de Preparación y Entrega
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            total_amount REAL NOT NULL,
            payment_method TEXT NOT NULL CHECK(payment_method IN ('QR', 'DEPOSITO', 'PAYPAL')),
            payment_reference TEXT,
            status TEXT NOT NULL DEFAULT 'PAGADO' CHECK(status IN ('PAGADO', 'EN_PREPARACION', 'EMPAQUETADO', 'EN_TRANSITO', 'ENTREGADO')),
            security_seal TEXT,
            tracking_number TEXT,
            prepared_by TEXT,
            delivered_at TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
        CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_email);

        -- 4. Tabla de Detalle de Items por Pedido
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            product_id TEXT NOT NULL REFERENCES products(id),
            product_name TEXT NOT NULL,
            unit_price REAL NOT NULL,
            quantity INTEGER NOT NULL CHECK(quantity > 0),
            subtotal REAL NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
        """
        db.executescript(schema_sql)
        db.commit()

        # Si no es entorno de pruebas automatizadas, asegurar semillas
        if not app.config.get("TESTING"):
            # Usuarios
            cursor = db.execute("SELECT COUNT(*) as total FROM users")
            if cursor.fetchone()["total"] == 0:
                seed_initial_users(db)
            else:
                # Asegurar que el usuario activo de almacén exista
                from werkzeug.security import generate_password_hash
                db.execute(
                    """
                    INSERT OR IGNORE INTO users (full_name, email, password_hash, role, status)
                    VALUES ('Operador Almacén', 'almacen@elanwatches.com', ?, 'ALMACEN', 'ACTIVO')
                    """,
                    (generate_password_hash("AlmacenPass2026!"),)
                )
                db.commit()

            # Productos (Control de Stock e Imágenes)
            seed_initial_products(db)

            # Pedidos (Trazabilidad y Preparación)
            order_count = db.execute("SELECT COUNT(*) as total FROM orders").fetchone()["total"]
            if order_count == 0:
                seed_initial_orders(db)

def get_standalone_db(db_path):
    """Retorna una conexión directa a SQLite para scripts CLI (como init_admin.py)."""
    os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn
