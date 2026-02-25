"""Public API routes (no auth required)."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..schemas import CategoryResponse, MenuItemResponse, ReservationCreate, ReservationResponse, ContactCreate, ContactResponse, BannerResponse
from ..crud import get_categories, get_menu_items, create_reservation, create_contact, get_banners

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/menu/categories", response_model=list[CategoryResponse])
async def list_categories(db: AsyncSession = Depends(get_db)):
    return await get_categories(db)


@router.get("/menu/items", response_model=list[MenuItemResponse])
async def list_menu_items(category_id: int | None = None, db: AsyncSession = Depends(get_db)):
    return await get_menu_items(db, category_id)


@router.post("/reservations", response_model=ReservationResponse)
async def make_reservation(data: ReservationCreate, db: AsyncSession = Depends(get_db)):
    return await create_reservation(db, data)


@router.post("/contact", response_model=ContactResponse)
async def send_contact(data: ContactCreate, db: AsyncSession = Depends(get_db)):
    return await create_contact(db, data)


@router.get("/banners", response_model=list[BannerResponse])
async def list_banners(db: AsyncSession = Depends(get_db)):
    return await get_banners(db, active_only=True)
