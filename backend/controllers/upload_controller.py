from uuid import uuid4

from flask import Blueprint, g, request
from werkzeug.utils import secure_filename

from middleware.auth import require_auth
from middleware.errors import ApiError
from services.storage_service import storage_service

upload_bp = Blueprint("uploads", __name__, url_prefix="/api/uploads")

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "svg", "ico", "pdf", "mp4", "webm", "mov"}
VIDEO_EXTENSIONS = {"mp4", "webm", "mov"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024
MAX_VIDEO_UPLOAD_BYTES = 50 * 1024 * 1024


def _require_settings_permission():
    if "settings.manage" not in g.permissions and "system.manage" not in g.permissions:
        raise ApiError("You do not have permission to upload branding assets.", 403)


def _extension(filename):
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""


@upload_bp.post("/branding")
@require_auth()
def upload_branding_asset():
    _require_settings_permission()
    file = request.files.get("file")
    asset_type = secure_filename((request.form.get("asset_type") or "branding").lower()) or "branding"
    if not file or not file.filename:
        raise ApiError("A file is required.", 422)

    filename = secure_filename(file.filename)
    ext = _extension(filename)
    if ext not in ALLOWED_EXTENSIONS:
        raise ApiError("Unsupported file type.", 422, {"file": "Use PNG, JPG, WEBP, SVG, ICO, or PDF."})

    stream = file.stream
    stream.seek(0, 2)
    size = stream.tell()
    stream.seek(0)
    max_size = MAX_VIDEO_UPLOAD_BYTES if ext in VIDEO_EXTENSIONS else MAX_UPLOAD_BYTES
    if size > max_size:
        limit_mb = max_size // (1024 * 1024)
        raise ApiError("File is too large.", 422, {"file": f"Maximum upload size is {limit_mb} MB."})

    stored_name = f"{asset_type}-{uuid4().hex}.{ext}"
    public_path = storage_service.save_upload(file, "branding", stored_name)
    public_url = f"{request.host_url.rstrip('/')}{public_path}"
    return {
        "message": "File uploaded.",
        "file": {
            "name": filename,
            "stored_name": stored_name,
            "asset_type": asset_type,
            "size": size,
            "path": public_path,
            "url": public_url,
        },
    }, 201
