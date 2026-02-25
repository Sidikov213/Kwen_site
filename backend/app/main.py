"""FastAPI application entry point."""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import get_db, engine, Base
from .routes import public, admin
from .init_db import init_database

app = FastAPI(
    title="Keny Cafe API",
    description="API for Keny cafe website",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploaded images (menu items, etc.)
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "images")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

app.include_router(public.router)
app.include_router(admin.router)


@app.on_event("startup")
async def startup():
    await init_database()


@app.get("/api/health")
async def health():
    return {"status": "ok"}
