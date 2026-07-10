from flask import Flask, send_from_directory
from flask_cors import CORS

from config import Config
from middleware.errors import register_error_handlers
from routes.registry import register_routes


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = Config.SECRET_KEY
    CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}})

    register_routes(app)
    register_error_handlers(app)

    @app.get("/api/health")
    def health():
        return {"status": "ok", "environment": Config.APP_ENV}

    @app.get("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(Config.UPLOAD_DIR, filename)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host=Config.SERVER_HOST, port=Config.SERVER_PORT, debug=Config.APP_ENV == "development")
