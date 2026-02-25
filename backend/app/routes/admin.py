"""Admin API routes (auth required)."""
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..auth import verify_password, create_access_token, get_current_admin
from ..schemas import (
    CategoryCreate, CategoryUpdate, CategoryResponse,
    MenuItemCreate, MenuItemUpdate, MenuItemResponse,
    BannerCreate, BannerUpdate, BannerResponse,
    AdminLogin, Token
)
from ..crud import (
    get_categories, get_category_by_id, create_category, update_category, delete_category,
    get_menu_items, get_menu_item_by_id, create_menu_item, update_menu_item, delete_menu_item,
    get_banners, get_banner_by_id, create_banner, update_banner, delete_banner,
    get_admin_by_username,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])

UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "images")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@router.post("/login", response_model=Token)
async def admin_login(data: AdminLogin, db: AsyncSession = Depends(get_db)):
    admin = await get_admin_by_username(db, data.username)
    if not admin or not verify_password(data.password, admin.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_access_token({"sub": admin.username}), "token_type": "bearer"}


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    _: str = Depends(get_current_admin)
):
    """Upload image for menu item. Returns URL path like /uploads/filename."""
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Allowed: jpg, jpeg, png, webp")
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOADS_DIR, filename)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(status_code=400, detail="File too large")
    with open(filepath, "wb") as f:
        f.write(content)
    return {"url": f"/uploads/{filename}"}


@router.get("/categories", response_model=list[CategoryResponse])
async def admin_list_categories(
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    return await get_categories(db)


@router.post("/categories", response_model=CategoryResponse)
async def admin_create_category(
    data: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    return await create_category(db, data)


@router.put("/categories/{category_id}", response_model=CategoryResponse)
async def admin_update_category(
    category_id: int,
    data: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    cat = await get_category_by_id(db, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return await update_category(db, category_id, data)


@router.delete("/categories/{category_id}")
async def admin_delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    cat = await get_category_by_id(db, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    await delete_category(db, category_id)
    return {"ok": True}


@router.get("/menu/items", response_model=list[MenuItemResponse])
async def admin_list_items(
    category_id: int | None = None,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    return await get_menu_items(db, category_id, available_only=False)


@router.post("/menu/items", response_model=MenuItemResponse)
async def admin_create_item(
    data: MenuItemCreate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    return await create_menu_item(db, data)


@router.put("/menu/items/{item_id}", response_model=MenuItemResponse)
async def admin_update_item(
    item_id: int,
    data: MenuItemUpdate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    item = await get_menu_item_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return await update_menu_item(db, item_id, data)


@router.delete("/menu/items/{item_id}")
async def admin_delete_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    item = await get_menu_item_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    await delete_menu_item(db, item_id)
    return {"ok": True}


@router.get("/banners", response_model=list[BannerResponse])
async def admin_list_banners(
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    return await get_banners(db, active_only=False)


@router.post("/banners", response_model=BannerResponse)
async def admin_create_banner(
    data: BannerCreate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    return await create_banner(db, data)


@router.put("/banners/{banner_id}", response_model=BannerResponse)
async def admin_update_banner(
    banner_id: int,
    data: BannerUpdate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    banner = await get_banner_by_id(db, banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    return await update_banner(db, banner_id, data)


@router.delete("/banners/{banner_id}")
async def admin_delete_banner(
    banner_id: int,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    banner = await get_banner_by_id(db, banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    await delete_banner(db, banner_id)
    return {"ok": True}
