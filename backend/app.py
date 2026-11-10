
import os
import re

from flask import Flask, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash

from config import Config
from database import close_db, init_db, get_db
from auth_routes import auth_bp
from user_routes import users_bp


def create_app(test_config=None):
    """Fábrica de la aplicación Flask para Élan Watches - Seguridad."""

    app = Flask(__name__)

    # Cargar configuración
    app.config.from_object(Config)

    if test_config:
        app.config.update(test_config)

    # Configurar CORS para permitir el acceso desde el frontend
    allowed_origins = [
        app.config["FRONTEND_URL"],
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    unique_origins = list(dict.fromkeys(
        origin.rstrip("/") for origin in allowed_origins if origin and isinstance(origin, str)
    ))
    # Permitir cualquier subdominio en Render para sincronía automática de nombres
    unique_origins.append(re.compile(r"^https://.*\.onrender\.com$"))

    CORS(
        app,
        resources={r"/api/*": {"origins": unique_origins}},
        supports_credentials=True,
        expose_headers=["X-CSRF-Token"],
    )

    # Cerrar conexiones de base de datos al finalizar cada solicitud
    app.teardown_appcontext(close_db)

    # Crear las tablas si todavía no existen
    init_db(app)

    # Crear administrador inicial si se configuraron las variables
    admin_name = os.environ.get("INIT_ADMIN_NAME", "").strip()
    admin_email = os.environ.get("INIT_ADMIN_EMAIL", "").strip().lower()
    admin_password = os.environ.get("INIT_ADMIN_PASSWORD", "")

    if admin_name and admin_email and admin_password:

        if len(admin_password) < 12:
            raise ValueError(
                "La contraseña del administrador debe tener "
                "al menos 12 caracteres."
            )

        with app.app_context():
            db = get_db()

            existing_admin = db.execute(
                """
                SELECT id
                FROM users
                WHERE LOWER(email) = LOWER(?)
                """,
                (admin_email,),
            ).fetchone()

            if existing_admin is None:
                password_hash = generate_password_hash(admin_password)

                db.execute(
                    """
                    INSERT INTO users
                    (full_name, email, password_hash, role, status)
                    VALUES (?, ?, ?, 'ADMINISTRADOR', 'ACTIVO')
                    """,
                    (admin_name, admin_email, password_hash),
                )

                db.commit()

                print(
                    "[ÉLAN] Administrador inicial creado correctamente."
                )
            else:
                print(
                    "[ÉLAN] El administrador inicial ya existe."
                )

    # Registrar rutas de autenticación y usuarios
    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)

    # Ruta para comprobar que el backend funciona
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "Élan Watches - Subsistema Seguridad",
            "version": "1.0.0",
        }), 200

    # Manejo de errores
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "error": "Recurso no encontrado"
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            "error": "Error interno del servidor"
        }), 500

    return app


# Crear la aplicación
app = create_app()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False,
    )
