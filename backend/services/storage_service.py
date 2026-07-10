from config import Config


class LocalStorageService:
    def save_upload(self, file, folder, stored_name):
        upload_dir = Config.UPLOAD_DIR / folder
        upload_dir.mkdir(parents=True, exist_ok=True)
        destination = upload_dir / stored_name
        file.save(destination)
        return f"/uploads/{folder}/{stored_name}"


storage_service = LocalStorageService()
