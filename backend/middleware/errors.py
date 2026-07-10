from pymysql import IntegrityError

from config import Config


class ApiError(Exception):
    def __init__(self, message, status_code=400, details=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}


def register_error_handlers(app):
    @app.errorhandler(ApiError)
    def handle_api_error(error):
        return {
            "error": {
                "message": error.message,
                "details": error.details,
                "status": error.status_code,
            }
        }, error.status_code

    @app.errorhandler(IntegrityError)
    def handle_integrity_error(error):
        details = {"database": str(error)} if Config.DEBUG or Config.APP_ENV == "development" else {}
        return {
            "error": {
                "message": "The request violates a database constraint.",
                "details": details,
                "status": 409,
            }
        }, 409

    @app.errorhandler(404)
    def handle_not_found(_error):
        return {"error": {"message": "Resource not found.", "status": 404}}, 404

    @app.errorhandler(Exception)
    def handle_unexpected(error):
        app.logger.exception(error)
        return {
            "error": {
                "message": "An unexpected server error occurred.",
                "status": 500,
            }
        }, 500
