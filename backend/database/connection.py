from contextlib import contextmanager
import tempfile
from pathlib import Path

import pymysql
from pymysql.cursors import DictCursor

from config import Config

_CA_FILE = None


def _ca_path():
    global _CA_FILE
    ca_value = (Config.DATABASE_SSL_CA or "").strip()
    if not ca_value:
        return ""
    if "BEGIN CERTIFICATE" not in ca_value:
        return ca_value
    if not _CA_FILE:
        path = Path(tempfile.gettempdir()) / "campussphere_mysql_ca.pem"
        path.write_text(ca_value, encoding="utf-8")
        _CA_FILE = str(path)
    return _CA_FILE


def _ssl_options():
    mode = (Config.DATABASE_SSL_MODE or "").strip().lower()
    if mode in {"", "disabled", "disable", "false", "0"}:
        return None
    if mode in {"verify-ca", "verify_ca", "verify-full", "verify_identity"}:
        options = {"check_hostname": mode in {"verify-full", "verify_identity"}}
        ca_path = _ca_path()
        if ca_path:
            options["ca"] = ca_path
        return options
    options = {"check_hostname": False}
    ca_path = _ca_path()
    if ca_path:
        options["ca"] = ca_path
    return options


def database_diagnostics(error=None):
    host = Config.DB_HOST or ""
    host_type = "local" if host in {"127.0.0.1", "localhost", ""} else "remote"
    return {
        "configured": bool(Config.DB_HOST and Config.DB_NAME and Config.DB_USER),
        "config_source": "database_url" if getattr(Config, "USE_DATABASE_URL", False) else "individual_env_vars",
        "host_type": host_type,
        "port": Config.DB_PORT,
        "database_name_set": bool(Config.DB_NAME),
        "user_set": bool(Config.DB_USER),
        "password_set": bool(Config.DB_PASSWORD),
        "ssl_mode": Config.DATABASE_SSL_MODE or "disabled",
        "ssl_ca_set": bool(Config.DATABASE_SSL_CA),
        "error_type": error.__class__.__name__ if error else None,
    }


def get_connection():
    options = {
        "host": Config.DB_HOST,
        "port": Config.DB_PORT,
        "user": Config.DB_USER,
        "password": Config.DB_PASSWORD,
        "database": Config.DB_NAME,
        "charset": "utf8mb4",
        "cursorclass": DictCursor,
        "autocommit": False,
        "connect_timeout": Config.DATABASE_CONNECT_TIMEOUT,
        "read_timeout": Config.DATABASE_CONNECT_TIMEOUT,
        "write_timeout": Config.DATABASE_CONNECT_TIMEOUT,
    }
    ssl_options = _ssl_options()
    if ssl_options:
        options["ssl"] = ssl_options
    return pymysql.connect(**options)


def ping_database():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1 AS ok")
            return cursor.fetchone()["ok"] == 1
    finally:
        connection.close()


@contextmanager
def db_cursor(commit=False):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            yield cursor
        if commit:
            connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()
