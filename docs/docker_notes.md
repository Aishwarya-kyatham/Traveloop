# Docker Cheat Sheet for Traveloop

This document contains essential Docker Compose commands for managing, building, and troubleshooting the Traveloop application.

## 🚀 Starting and Stopping

**Start all services**
```bash
docker-compose up
```
*(Runs in the foreground. Press `Ctrl+C` to stop)*

**Start all services in detached mode (background)**
```bash
docker-compose up -d
```

**Stop all services**
```bash
docker-compose down
```
*(Stops and removes containers, networks, and images created by `up`)*

**Stop all services and remove volumes (Wipes Database)**
```bash
docker-compose down -v
```

---

## 🛠 Building and Rebuilding

**Build and start all services**
```bash
docker-compose up --build
```
*(Use this when you've added new dependencies like npm packages or python requirements)*

**Build and start ONLY the backend**
```bash
docker-compose up --build backend
```
*(Starts the backend and any services it depends on, like the db)*

**Build and start ONLY the frontend**
```bash
docker-compose up --build frontend
```

**Rebuild a specific service without affecting others (in background)**
```bash
docker-compose up -d --build --force-recreate backend
```

---

## 📋 Viewing Logs

**View logs for all services**
```bash
docker-compose logs -f
```
*(`-f` follows the log output live)*

**View logs for ONLY the backend**
```bash
docker-compose logs -f backend
```

**View logs for ONLY the frontend**
```bash
docker-compose logs -f frontend
```

**View logs for ONLY the database**
```bash
docker-compose logs -f db
```

---

## 💻 Interacting with Containers

**Open a shell inside the backend container**
```bash
docker-compose exec backend sh
```
*(Useful for running Django management commands manually like `python manage.py shell`)*

**Open a shell inside the frontend container**
```bash
docker-compose exec frontend sh
```

**Open a shell/psql inside the database container**
```bash
docker-compose exec db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}
```

---

## 🧹 Cleanup and System Pruning

**Remove all unused containers, networks, images (both dangling and unreferenced)**
```bash
docker system prune -a
```

**Remove all unused volumes**
```bash
docker volume prune
```
