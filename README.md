# Kwen — Сайт кафе

Современный сайт для кафе Kwen в Махачкале (проспект Казбекова, 102).

## Стек

- **Backend:** Python, FastAPI, SQLite, SQLAlchemy
- **Frontend:** React, TypeScript, Vite, Framer Motion, React Router
- **База данных:** SQLite

## Структура

```
kwen/
├── backend/          # FastAPI приложение
│   ├── app/
│   ├── images/       # Загружаемые изображения (для меню)
│   └── keny.db       # SQLite (создаётся при запуске)
├── frontend/         # React приложение
│   ├── public/
│   │   └── images/   # Статические изображения (hero, интерьер)
│   └── src/
├── images/           # Фотографии кафе (hero.jpg, interior.jpg и т.д.)
```

## Запуск

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python run.py
```

API: http://localhost:8000  
Документация: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Сайт: http://localhost:5173

### 3. Изображения

Поместите в `frontend/public/images/`:
- `kwen.png` — логотип (главная страница и хедер)
- `hero.jpg` — фоновое изображение на главной
- `interior.jpg`, `coffee.jpg`, `food.jpg` — галерея на главной

Если папка `images` пуста, галерея не отобразится (элементы скрываются при ошибке загрузки).

## Админ-панель

- Логин: `admin`
- Пароль: `admin123`

API для админа: `POST /api/admin/login` с `Authorization: Bearer <token>`

## Сборка для продакшена

```bash
# Frontend
cd frontend && npm run build

# Backend: uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Статические файлы frontend можно раздавать через Nginx или FastAPI.

## Публикация в GitHub

```bash
# Инициализация репозитория
git init

# Добавить все файлы (venv, node_modules, *.db игнорируются через .gitignore)
git add .
git commit -m "Initial commit: Kwen cafe website"

# Подключить удалённый репозиторий и отправить
git remote add origin https://github.com/YOUR_USERNAME/kwen.git
git branch -M main
git push -u origin main
```

При первом `git push` может потребоваться авторизация (токен или SSH).
