"""Storage package initialization."""
import os
from .base import StorageInterface
from .sqlite_storage import SQLiteStorage
from .mariadb_storage import MariaDBStorage

def get_storage() -> StorageInterface:
    """Factory function to get the configured storage instance."""
    storage_type = os.getenv('STORAGE_TYPE', 'sqlite').lower()
    
    if storage_type == 'mariadb':
        return MariaDBStorage(
            host=os.getenv('MARIADB_HOST', 'localhost'),
            port=int(os.getenv('MARIADB_PORT', '3306')),
            database=os.getenv('MARIADB_DATABASE', 'golf_league'),
            user=os.getenv('MARIADB_USER', 'admin'),
            password=os.getenv('MARIADB_PASSWORD', 'admin')
        )
    else:
        # Default to SQLite
        db_path = os.getenv('DATABASE_PATH', './database/golf_league.db')
        return SQLiteStorage(db_path)

__all__ = ["StorageInterface", "SQLiteStorage", "MariaDBStorage", "get_storage"]
