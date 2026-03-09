# 🎙️ Podcast Script Assistant — MVP

Full-stack app: Django + DRF + PostgreSQL backend, React SPA frontend, Groq AI integration.

---

## 📁 Project Structure

```
podcast_assistant/
├── backend/
│   ├── core/               # Django project config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── scripts_app/        # Main app
│   │   ├── models.py       # User, PodcastScript, AIHistory
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   └── ai_service.py   # Groq integration
│   ├── manage.py
│   ├── requirements.txt
│   └── .env                # ← your secrets
└── frontend/
    ├── src/
    │   ├── pages/          # All page components
    │   ├── components/     # Navbar
    │   ├── context/        # AuthContext (JWT)
    │   ├── api.js          # Axios instance
    │   └── App.jsx         # Router setup
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Setup Instructions

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Make sure PostgreSQL is running and podcast_db exists:
# psql -U postgres -c "CREATE DATABASE podcast_db;"

# Run migrations
python manage.py makemigrations scripts_app
python manage.py migrate

# Create an admin user (important!)
python manage.py shell
>>> from scripts_app.models import User
>>> u = User.objects.create_superuser('admin', 'admin@test.com', 'admin123')
>>> u.role = 'admin'
>>> u.save()
>>> exit()

# Start the server
python manage.py runserver
# Backend runs on: http://localhost:8000
```

### 2. Frontend

```bash
cd frontend

npm install
npm run dev
# Frontend runs on: http://localhost:5173
```

---

## 🔗 API Endpoints

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| POST   | /api/auth/register/             | Register new user        |
| POST   | /api/auth/login/                | Login, get JWT tokens    |
| POST   | /api/auth/refresh/              | Refresh access token     |
| GET    | /api/auth/me/                   | Get current user info    |
| GET    | /api/scripts/                   | List scripts             |
| POST   | /api/scripts/                   | Create script            |
| GET    | /api/scripts/:id/               | Get script detail        |
| PUT    | /api/scripts/:id/               | Update script            |
| DELETE | /api/scripts/:id/               | Delete script            |
| POST   | /api/ai/generate/               | Generate with Groq AI    |
| GET    | /api/ai/history/                | Get AI history (last 10) |
| GET    | /api/admin/users/               | List all users (admin)   |
| PATCH  | /api/admin/users/:id/block/     | Block/unblock user       |

---

## 🗺️ Frontend Pages

| Route          | Page            | Access     |
|----------------|-----------------|------------|
| /              | Home            | Public     |
| /login         | Login           | Public     |
| /register      | Register        | Public     |
| /dashboard     | Dashboard       | Auth       |
| /items         | Script List     | Auth       |
| /items/new     | Create Script   | Auth       |
| /items/:id/edit| Edit Script     | Auth/Owner |
| /ai            | AI Generator    | Auth       |
| /admin         | Admin Panel     | Admin only |

---

## 🤖 AI Model
- Provider: **Groq**
- Model: **llama-3.1-8b-instant** (from your .env LLM_MODEL)
- History: last 10 saved per user, shown on /ai page
