"""SQLAlchemy models."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from .database import Base


class Category(Base):
    """Menu category (e.g. Coffee, Breakfast, Main dishes)."""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("MenuItem", back_populates="category", cascade="all, delete-orphan")


class MenuItem(Base):
    """Menu item (dish or drink)."""
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String(500), nullable=True)
    is_available = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="items")


class Reservation(Base):
    """Table reservation."""
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(200), nullable=True)
    date = Column(String(10), nullable=False)  # YYYY-MM-DD
    time = Column(String(5), nullable=False)  # HH:MM
    guests = Column(Integer, default=2)
    comment = Column(Text, nullable=True)
    status = Column(String(20), default="pending")  # pending, confirmed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)


class ContactMessage(Base):
    """Contact form submission."""
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(200), nullable=False)
    phone = Column(String(20), nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Banner(Base):
    """Promotional banner (e.g. 50% off rolls)."""
    __tablename__ = "banners"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    discount_text = Column(String(100), nullable=True)  # e.g. "50%"
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    link = Column(String(500), nullable=True)  # optional link when clicked
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class AdminUser(Base):
    """Admin user for backend."""
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
