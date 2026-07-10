from contextlib import contextmanager

import pymysql
from pymysql.cursors import DictCursor

from config import Config


def _ssl_options():
    mode = (Config.DATABASE_SSL_MODE or "").strip().lower()
    if mode in {"", "disabled", "disable", "false", "0"}:
        return None
    if mode in {"verify-ca", "verify_ca", "verify-full", "verify_identity"}:
        options = {"check_hostname": mode in {"verify-full", "verify_identity"}}
        if Config.DATABASE_SSL_CA:
            options["ca"] = Config.DATABASE_SSL_CA
        return options
    return {"check_hostname": False}


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
