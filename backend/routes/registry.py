from controllers.auth_controller import auth_bp
from controllers.applicant_controller import applicant_bp
from controllers.dashboard_controller import dashboard_bp
from controllers.module_controller import module_bp
from controllers.report_controller import report_bp
from controllers.upload_controller import upload_bp


def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(applicant_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(module_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(upload_bp)
