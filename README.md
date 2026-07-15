# CampusSphere Enterprise School Management System

CampusSphere is an enterprise school management system built with HTML, CSS, vanilla JavaScript, Python REST APIs, MySQL, and Apache/XAMPP. The project remains fully local-first while being prepared for GitHub, Vercel, Render, managed MySQL, and Cloudinary.

## Project Structure

```text
frontend/
  assets/
    css/
    js/
    images/
    icons/
  pages/
  index.html
backend/
  app.py
  api/
  auth/
  config/
  controllers/
  database/
  middleware/
  models/
  routes/
  services/
  uploads/
  utils/
  requirements.txt
  .env.example
database/
  school_management.sql
README.md
.gitignore
```

## Local Requirements

- XAMPP with Apache and MySQL
- Python 3.11 or newer
- phpMyAdmin or MySQL CLI
- Git

## Database Import

1. Start MySQL in XAMPP.
2. Open phpMyAdmin.
3. Create or select the `school_management` database.
4. Import `database/school_management.sql`.

The SQL file includes the current schema, foreign keys, indexes, permissions, portal users, settings, and operational module tables used by the UI.

## Backend Setup

From the `backend` folder:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python app.py
```

Default local API:

```text
http://127.0.0.1:5000/api
```

Edit `backend/.env` for local credentials:

```text
APP_ENV=development
SECRET_KEY=replace-with-a-long-random-secret
DATABASE_HOST=127.0.0.1
DATABASE_NAME=school_management
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_PORT=3306
```

## Frontend Setup With XAMPP

Copy or serve the `frontend` folder through Apache/XAMPP, or run a simple local static server during development:

```powershell
python -m http.server 8000 -d frontend
```

Default local frontend:

```text
http://127.0.0.1:8000/
```

Frontend runtime settings live in:

```text
frontend/assets/js/config.js
```

The frontend does not store database passwords, secret keys, JWT secrets, OpenAI keys, or Cloudinary secrets.

## Default Portal Logins

Seeded portal accounts use:

```text
Password: Campus@2026
```

Examples:

```text
secondary.admin@campus.local
secondary.teacher@campus.local
secondary.student@campus.local
university.admin@campus.local
university.lecturer@campus.local
university.registrar@campus.local
```

Change seeded passwords before production use.

## GitHub Preparation

The repository is safe to publish after you create a real private `.env` locally. `.gitignore` excludes:

- `.env` and `.env.*`
- `backend/uploads/`
- Python caches
- virtual environments
- `node_modules/`
- editor and OS files

Do not commit real API keys, database passwords, JWT secrets, uploaded files, or Cloudinary secrets.

## Render Backend Preparation

Use `backend` as the Render service root.

Recommended start command:

```text
gunicorn wsgi:app
```

`gunicorn` is included in `backend/requirements.txt` for Render deployment. Local Windows/XAMPP development can continue using `python app.py`.

Configure Render environment variables:

```text
APP_ENV=production
SECRET_KEY=<secure-secret>
DATABASE_URL=<managed-mysql-service-uri>
DATABASE_SSL_MODE=REQUIRED
CORS_ORIGINS=<vercel-frontend-url>
OPENAI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

For Aiven MySQL, use the full Service URI as `DATABASE_URL`. Do not put the full URI in `DATABASE_HOST`; if separate fields are used instead, set `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, and `DATABASE_SSL_MODE=REQUIRED`.

## Vercel Frontend Preparation

Deploy the `frontend` folder as the Vercel project root.

For local XAMPP, `frontend/assets/js/config.js` targets:

```text
http://127.0.0.1:5000/api
```

For production, point `CONFIG.API_URL` or a Vercel rewrite to the Render API URL. Keep keys and passwords on the backend only.

## Uploads And Cloudinary

Local uploads are stored in:

```text
backend/uploads/
```

That folder is ignored by Git. Later, the upload service can be replaced with Cloudinary using the existing environment variables without exposing Cloudinary secrets to the frontend.

## Security Notes

- Backend reads secrets from environment variables.
- Frontend contains no passwords or secret keys.
- Passwords are hashed with PBKDF2-SHA256.
- API requests use signed bearer tokens.
- Role permissions are enforced by backend middleware.
- MySQL remains the database engine.
