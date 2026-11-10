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
    """Siembra los 4 usuarios del subsistema si la base de datos se crea por primera vez."""
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
    ]

    for full_name, email, pwd_hash, role, status in initial_users:
        db.execute(
            """
            INSERT INTO users (full_name, email, password_hash, role, status)
            VALUES (?, LOWER(?), ?, ?, ?)
            """,
            (full_name, email, pwd_hash, role, status)
        )
    db.commit()
    print("[ÉLAN] Base de datos inicializada y sembrada con 4 usuarios de prueba.")

def init_db(app):
    """Inicializa la estructura de la base de datos si no existe.
    No sobrescribe ni borra los datos existentes.
    """
    with app.app_context():
        db = get_db()
        schema_sql = """
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
        """
        db.executescript(schema_sql)
        db.commit()

        # Si la base de datos está vacía y no es entorno de pruebas automatizadas
        if not app.config.get("TESTING"):
            cursor = db.execute("SELECT COUNT(*) as total FROM users")
            if cursor.fetchone()["total"] == 0:
                seed_initial_users(db)

def get_standalone_db(db_path):
    """Retorna una conexión directa a SQLite para scripts CLI (como init_admin.py)."""
    os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn
