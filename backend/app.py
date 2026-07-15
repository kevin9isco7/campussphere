from flask import Flask, send_from_directory
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

from config import Config
from database.connection import ping_database
from middleware.errors import register_error_handlers
from routes.registry import register_routes


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = Config.SECRET_KEY
    app.config["SESSION_COOKIE_SECURE"] = Config.SESSION_COOKIE_SECURE
    app.config["SESSION_COOKIE_SAMESITE"] = Config.SESSION_COOKIE_SAMESITE
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)
    CORS(
        app,
        resources={r"/api/*": {"origins": Config.CORS_ORIGINS}},
        supports_credentials=Config.CORS_SUPPORTS_CREDENTIALS,
    )

    register_routes(app)
    register_error_handlers(app)

    @app.get("/")
    def root():
        return {"status": "healthy", "service": "CampusSphere API", "health": "/api/health"}

    @app.get("/api/health")
    def health():
        return {"status": "healthy", "service": "CampusSphere API"}

    @app.get("/api/health/database")
    def database_health():
        try:
            if ping_database():
                return {"status": "healthy", "database": "connected"}
        except Exception as error:
            app.logger.warning("Database health check failed: %s", error.__class__.__name__)
        return {"status": "unhealthy", "database": "unavailable"}, 503

    @app.get("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(Config.UPLOAD_DIR, filename)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host=Config.SERVER_HOST, port=Config.SERVER_PORT, debug=Config.DEBUG or Config.APP_ENV == "development")
