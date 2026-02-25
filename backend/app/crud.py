"""CRUD operations."""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy import update, delete

from .models import Category, MenuItem, Reservation, ContactMessage, AdminUser, Banner
from .schemas import CategoryCreate, CategoryUpdate, MenuItemCreate, MenuItemUpdate, ReservationCreate, ContactCreate, BannerCreate, BannerUpdate


async def get_categories(db: AsyncSession):
    result = await db.execute(
        select(Category).order_by(Category.sort_order, Category.name)
    )
    return result.scalars().all()


async def get_category_by_id(db: AsyncSession, category_id: int):
    result = await db.execute(select(Category).where(Category.id == category_id))
    return result.scalar_one_or_none()


async def create_category(db: AsyncSession, data: CategoryCreate):
    category = Category(**data.model_dump())
    db.add(category)
    await db.flush()
    await db.refresh(category)
    return category


async def update_category(db: AsyncSession, category_id: int, data: CategoryUpdate):
    stmt = update(Category).where(Category.id == category_id).values(**data.model_dump(exclude_unset=True))
    await db.execute(stmt)
    return await get_category_by_id(db, category_id)


async def delete_category(db: AsyncSession, category_id: int):
    await db.execute(delete(Category).where(Category.id == category_id))


async def get_menu_items(db: AsyncSession, category_id: int | None = None, available_only: bool = True):
    q = select(MenuItem)
    if available_only:
        q = q.where(MenuItem.is_available == True)
    if category_id:
        q = q.where(MenuItem.category_id == category_id)
    q = q.order_by(MenuItem.sort_order, MenuItem.name)
    result = await db.execute(q)
    return result.scalars().all()


async def get_menu_item_by_id(db: AsyncSession, item_id: int):
    result = await db.execute(select(MenuItem).where(MenuItem.id == item_id))
    return result.scalar_one_or_none()


async def create_menu_item(db: AsyncSession, data: MenuItemCreate):
    item = MenuItem(**data.model_dump())
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return item


async def update_menu_item(db: AsyncSession, item_id: int, data: MenuItemUpdate):
    stmt = update(MenuItem).where(MenuItem.id == item_id).values(**data.model_dump(exclude_unset=True))
    await db.execute(stmt)
    return await get_menu_item_by_id(db, item_id)


async def delete_menu_item(db: AsyncSession, item_id: int):
    await db.execute(delete(MenuItem).where(MenuItem.id == item_id))


async def create_reservation(db: AsyncSession, data: ReservationCreate):
    reservation = Reservation(**data.model_dump())
    db.add(reservation)
    await db.flush()
    await db.refresh(reservation)
    return reservation


async def get_reservations(db: AsyncSession, limit: int = 100):
    """Get all reservations for admin, newest first."""
    result = await db.execute(
        select(Reservation).order_by(Reservation.created_at.desc()).limit(limit)
    )
    return result.scalars().all()


async def create_contact(db: AsyncSession, data: ContactCreate):
    msg = ContactMessage(**data.model_dump())
    db.add(msg)
    await db.flush()
    await db.refresh(msg)
    return msg


async def get_admin_by_username(db: AsyncSession, username: str):
    result = await db.execute(select(AdminUser).where(AdminUser.username == username))
    return result.scalar_one_or_none()


async def get_banners(db: AsyncSession, active_only: bool = True):
    q = select(Banner).order_by(Banner.sort_order, Banner.id)
    if active_only:
        q = q.where(Banner.is_active == True)
    result = await db.execute(q)
    return result.scalars().all()


async def get_banner_by_id(db: AsyncSession, banner_id: int):
    result = await db.execute(select(Banner).where(Banner.id == banner_id))
    return result.scalar_one_or_none()


async def create_banner(db: AsyncSession, data: BannerCreate):
    banner = Banner(**data.model_dump())
    db.add(banner)
    await db.flush()
    await db.refresh(banner)
    return banner


async def update_banner(db: AsyncSession, banner_id: int, data: BannerUpdate):
    stmt = update(Banner).where(Banner.id == banner_id).values(**data.model_dump(exclude_unset=True))
    await db.execute(stmt)
    return await get_banner_by_id(db, banner_id)


async def delete_banner(db: AsyncSession, banner_id: int):
    await db.execute(delete(Banner).where(Banner.id == banner_id))
