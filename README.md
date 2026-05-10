# Traveloop - Full-Stack Starter Template

A production-ready starter template for building modern full-stack web applications with Django and React.

## 🚀 Tech Stack

- **Backend**: Django 4.2 + Django REST Framework
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Database**: PostgreSQL 15
- **Containerization**: Docker + Docker Compose

## 🛠 Setup Instructions

### Prerequisites
- Docker and Docker Compose installed on your machine.

### Getting Started
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Traveloop
   ```

2. **Run the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the services**:
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:8000/api/health/](http://localhost:8000/api/health/)
   - **Admin Interface**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

## 📂 Project Structure

```text
root/
├── backend/            # Django Application
│   ├── apps/           # Custom Django Apps (users, trips)
│   ├── config/         # Project Configuration (settings, urls)
│   ├── Dockerfile      # Backend Container Config
│   └── requirements.txt# Python Dependencies
├── frontend/           # React Application
│   ├── src/            # React Components & Logic
│   ├── Dockerfile      # Frontend Container Config
│   └── vite.config.js  # Vite Configuration
├── docker-compose.yml  # Orchestration Config
└── .env                # Environment Variables
```

## 👥 Team Collaboration

- **Consistent Environments**: Docker ensures every developer runs the exact same stack.
- **Live Reloading**: Both backend and frontend support hot-reloading via Docker volumes.
- **Scalability**: The folder structure separates concerns and uses a dedicated `apps/` directory for Django modules.

## 📜 Commands

- **Stop Services**: `docker-compose down`
- **Rebuild Containers**: `docker-compose build`
- **Check Logs**: `docker-compose logs -f`
- **Database Migrations**:
  ```bash
  docker-compose exec backend python manage.py makemigrations
  docker-compose exec backend python manage.py migrate
  ```
- **Create Superuser**:
  ```bash
  docker-compose exec backend python manage.py createsuperuser
  ```
