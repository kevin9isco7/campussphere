import base64
import functools
import hashlib
import hmac
import json
import time

from flask import request, g

from config import Config
from database.connection import db_cursor
from middleware.errors import ApiError


def _b64(data):
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _unb64(data):
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode((data + padding).encode("ascii"))


def hash_password(password, salt=None):
    salt = salt or hashlib.sha256(str(time.time()).encode()).hexdigest()[:32]
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120000)
    return f"pbkdf2_sha256${salt}${digest.hex()}"


def verify_password(password, password_hash):
    try:
        algorithm, salt, expected = password_hash.split("$", 2)
    except ValueError:
        return False
    if algorithm != "pbkdf2_sha256":
        return False
    actual = hash_password(password, salt).split("$", 2)[2]
    return hmac.compare_digest(actual, expected)


def create_token(user):
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": user["id"],
        "role": user["role_key"],
        "institution": user.get("institution_type"),
        "portal": user.get("portal_key"),
        "name": user["full_name"],
        "exp": int(time.time()) + Config.TOKEN_TTL_SECONDS,
    }
    unsigned = f"{_b64(json.dumps(header, separators=(',', ':')).encode())}.{_b64(json.dumps(payload, separators=(',', ':')).encode())}"
    signature = hmac.new(Config.SECRET_KEY.encode("utf-8"), unsigned.encode("ascii"), hashlib.sha256).digest()
    return f"{unsigned}.{_b64(signature)}"


def decode_token(token):
    try:
        header, payload, signature = token.split(".")
        unsigned = f"{header}.{payload}"
        expected = _b64(hmac.new(Config.SECRET_KEY.encode("utf-8"), unsigned.encode("ascii"), hashlib.sha256).digest())
        if not hmac.compare_digest(signature, expected):
            raise ApiError("Invalid authentication token.", 401)
        claims = json.loads(_unb64(payload))
        if claims.get("exp", 0) < int(time.time()):
            raise ApiError("Authentication token has expired.", 401)
        return claims
    except ApiError:
        raise
    except Exception as exc:
        raise ApiError("Invalid authentication token.", 401) from exc


def get_permissions(role_key):
    sql = """
        SELECT p.permission_key
        FROM permissions p
        JOIN role_permissions rp ON rp.permission_id = p.id
        JOIN roles r ON r.id = rp.role_id
        WHERE r.role_key = %s
    """
    with db_cursor() as cursor:
        cursor.execute(sql, (role_key,))
        return {row["permission_key"] for row in cursor.fetchall()}


def require_auth(permission=None):
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                raise ApiError("Authentication required.", 401)
            claims = decode_token(auth_header.replace("Bearer ", "", 1))
            g.current_user = claims
            g.permissions = get_permissions(claims["role"])
            if permission and permission not in g.permissions and "system.manage" not in g.permissions:
                raise ApiError("You do not have permission to perform this action.", 403)
            return fn(*args, **kwargs)

        return wrapper

    return decorator
