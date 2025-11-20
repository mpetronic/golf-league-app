"""Storage package initialization."""
from .base import StorageInterface
from .sqlite_storage import SQLiteStorage

__all__ = ['StorageInterface', 'SQLiteStorage']
