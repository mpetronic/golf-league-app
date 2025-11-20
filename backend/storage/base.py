"""
Abstract base class defining the storage interface for the golf league application.
This allows for different storage backends (SQLite, PostgreSQL, etc.) to be used interchangeably.
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Optional


class StorageInterface(ABC):
    """Abstract interface for data storage operations."""
    
    # Course operations
    @abstractmethod
    def get_courses(self) -> List[Dict]:
        """Get all courses."""
        pass
    
    @abstractmethod
    def get_course(self, course_id: str) -> Optional[Dict]:
        """Get a specific course by ID."""
        pass
    
    # Team operations
    @abstractmethod
    def get_teams(self) -> List[Dict]:
        """Get all teams."""
        pass
    
    @abstractmethod
    def get_team(self, team_id: str) -> Optional[Dict]:
        """Get a specific team by ID."""
        pass
    
    @abstractmethod
    def create_team(self, team_data: Dict) -> Dict:
        """Create a new team."""
        pass
    
    @abstractmethod
    def update_team(self, team_id: str, team_data: Dict) -> Dict:
        """Update an existing team."""
        pass
    
    @abstractmethod
    def delete_team(self, team_id: str) -> bool:
        """Delete a team."""
        pass
    
    # Player operations
    @abstractmethod
    def get_players(self) -> List[Dict]:
        """Get all players."""
        pass
    
    @abstractmethod
    def get_player(self, player_id: str) -> Optional[Dict]:
        """Get a specific player by ID."""
        pass
    
    @abstractmethod
    def create_player(self, player_data: Dict) -> Dict:
        """Create a new player."""
        pass
    
    @abstractmethod
    def update_player(self, player_id: str, player_data: Dict) -> Dict:
        """Update an existing player."""
        pass
    
    @abstractmethod
    def delete_player(self, player_id: str) -> bool:
        """Delete a player."""
        pass
    
    # Match operations
    @abstractmethod
    def get_matches(self) -> List[Dict]:
        """Get all matches."""
        pass
    
    @abstractmethod
    def get_match(self, match_id: str) -> Optional[Dict]:
        """Get a specific match by ID."""
        pass
    
    @abstractmethod
    def create_match(self, match_data: Dict) -> Dict:
        """Create a new match."""
        pass
    
    @abstractmethod
    def update_match(self, match_id: str, match_data: Dict) -> Dict:
        """Update an existing match."""
        pass
    
    @abstractmethod
    def delete_match(self, match_id: str) -> bool:
        """Delete a match."""
        pass
    
    # Initialization
    @abstractmethod
    def initialize_data(self, data: Dict) -> bool:
        """Initialize the database with seed data."""
        pass
    
    @abstractmethod
    def is_initialized(self) -> bool:
        """Check if the database has been initialized with data."""
        pass
