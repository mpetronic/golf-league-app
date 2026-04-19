"""Storage package initialization."""

from .base import StorageInterface
from .sqlite_storage import SQLiteStorage as Storage

__all__ = ["StorageInterface", "Storage"]
