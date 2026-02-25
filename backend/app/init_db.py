"""Database initialization and seed data."""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from .database import engine, Base, AsyncSessionLocal, get_sync_engine
from .models import Category, MenuItem, AdminUser, Banner
from .auth import get_password_hash


async def init_database():
    """Create tables and seed initial data."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Check if already seeded
        from sqlalchemy import select
        result = await db.execute(select(Category).limit(1))
        if result.scalar_one_or_none():
            return

        # Seed categories
        categories_data = [
            {"name": "Кофе", "slug": "coffee", "description": "Свежеобжаренный кофе", "sort_order": 1},
            {"name": "Завтраки", "slug": "breakfast", "description": "Завтраки до 14:00", "sort_order": 2},
            {"name": "Основные блюда", "slug": "main", "description": "Основные блюда", "sort_order": 3},
            {"name": "Горячие напитки", "slug": "hot-drinks", "description": "Чай, какао, шоколад", "sort_order": 4},
        ]
        category_objs = {}
        for c in categories_data:
            cat = Category(**c)
            db.add(cat)
            await db.flush()
            category_objs[c["slug"]] = cat.id

        # Seed menu items (based on Keny cafe menu from Yandex)
        menu_data = [
            ("coffee", "Американо", "Классический эспрессо с водой", 250),
            ("coffee", "Капучино", "Эспрессо с молочной пенкой", 350),
            ("coffee", "Латте", "Нежный кофе с молоком", 380),
            ("coffee", "Флэт уайт", "Двойной эспрессо с микропенкой", 400),
            ("coffee", "Фильтр-кофе", "Альтернативная заварка", 350),
            ("breakfast", "Завтрак с авокадо", "Тост, авокадо, яйцо пашот, микрозелень", 690),
            ("breakfast", "Датский завтрак с лососем", "Сёмга, сливочный сыр, бублик, зелень", 790),
            ("breakfast", "Омлет с креветками", "Нежный омлет с тигровыми креветками", 890),
            ("breakfast", "Драники", "Картофельные оладьи со сметаной", 450),
            ("main", "Шницель куриный", "Хрустящий шницель с гарниром", 590),
            ("main", "Сэндвич с тунцом", "Тунец, авокадо, руккола", 550),
            ("main", "Трюфельная гречка", "Гречка с трюфельным маслом и пармезаном", 630),
            ("hot-drinks", "Матча-латте", "Японский зелёный чай с молоком", 500),
            ("hot-drinks", "Горячий шоколад", "Настоящий бельгийский шоколад", 450),
            ("hot-drinks", "Какао", "Домашнее какао с зефиром", 400),
        ]
        for slug, name, desc, price in menu_data:
            item = MenuItem(
                category_id=category_objs[slug],
                name=name,
                description=desc,
                price=price,
                is_available=True,
            )
            db.add(item)

        # Default admin (username: admin, password: admin123)
        admin = AdminUser(
            username="admin",
            hashed_password=get_password_hash("admin123"),
        )
        db.add(admin)

        # Sample banner
        banner = Banner(
            title="Акция на роллы",
            discount_text="50%",
            description="Скидка на все роллы до конца недели",
            is_active=True,
            sort_order=0,
        )
        db.add(banner)

        await db.commit()
