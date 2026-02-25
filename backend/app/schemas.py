"""Pydantic schemas for API."""
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str | None = None
    sort_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    sort_order: int | None = None


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MenuItemBase(BaseModel):
    name: str
    description: str | None = None
    price: float
    image_url: str | None = None
    is_available: bool = True
    sort_order: int = 0


class MenuItemCreate(MenuItemBase):
    category_id: int


class MenuItemUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    image_url: str | None = None
    is_available: bool | None = None
    sort_order: int | None = None
    category_id: int | None = None


class MenuItemResponse(MenuItemBase):
    id: int
    category_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MenuItemWithCategory(MenuItemResponse):
    category: CategoryResponse | None = None


class ReservationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=20)
    email: str | None = None
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    time: str = Field(..., pattern=r"^\d{2}:\d{2}$")
    guests: int = Field(default=2, ge=1, le=20)
    comment: str | None = None


class ReservationResponse(BaseModel):
    id: int
    name: str
    date: str
    time: str
    guests: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str | None = None
    message: str = Field(..., min_length=10, max_length=2000)


class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminLogin(BaseModel):
    username: str
    password: str


class BannerBase(BaseModel):
    title: str
    discount_text: str | None = None
    description: str | None = None
    image_url: str | None = None
    link: str | None = None
    is_active: bool = True
    sort_order: int = 0


class BannerCreate(BannerBase):
    pass


class BannerUpdate(BaseModel):
    title: str | None = None
    discount_text: str | None = None
    description: str | None = None
    image_url: str | None = None
    link: str | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class BannerResponse(BannerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
