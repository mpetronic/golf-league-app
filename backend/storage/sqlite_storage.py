"""
SQLite implementation of the storage interface.
Provides persistent storage for the golf league application using SQLite database.
"""
import sqlite3
import json
from typing import List, Dict, Optional
from pathlib import Path
from .base import StorageInterface


class SQLiteStorage(StorageInterface):
    """SQLite implementation of the storage interface."""
    
    def __init__(self, db_path: str = "backend/database/golf_league.db"):
        """Initialize SQLite storage with the given database path."""
        self.db_path = db_path
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        self._init_database()
    
    def _get_connection(self):
        """Get a database connection."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def _init_database(self):
        """Initialize database schema."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        # Courses table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS courses (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                holes TEXT NOT NULL
            )
        ''')
        
        # Teams table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS teams (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                day TEXT NOT NULL
            )
        ''')
        
        # Players table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS players (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                team_id TEXT NOT NULL,
                handicap INTEGER NOT NULL,
                history TEXT,
                FOREIGN KEY (team_id) REFERENCES teams(id)
            )
        ''')
        
        # Matches table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS matches (
                id TEXT PRIMARY KEY,
                date TEXT NOT NULL,
                day TEXT NOT NULL,
                team1_id TEXT NOT NULL,
                team2_id TEXT NOT NULL,
                completed INTEGER DEFAULT 0,
                winner_id TEXT,
                score TEXT,
                scores TEXT,
                FOREIGN KEY (team1_id) REFERENCES teams(id),
                FOREIGN KEY (team2_id) REFERENCES teams(id),
                FOREIGN KEY (winner_id) REFERENCES teams(id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    # Course operations
    def get_courses(self) -> List[Dict]:
        """Get all courses."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM courses')
        rows = cursor.fetchall()
        conn.close()
        
        return [self._row_to_course(row) for row in rows]
    
    def get_course(self, course_id: str) -> Optional[Dict]:
        """Get a specific course by ID."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM courses WHERE id = ?', (course_id,))
        row = cursor.fetchone()
        conn.close()
        
        return self._row_to_course(row) if row else None
    
    def _row_to_course(self, row) -> Dict:
        """Convert database row to course dictionary."""
        return {
            'id': row['id'],
            'name': row['name'],
            'holes': json.loads(row['holes'])
        }
    
    # Team operations
    def get_teams(self) -> List[Dict]:
        """Get all teams."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM teams')
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_team(self, team_id: str) -> Optional[Dict]:
        """Get a specific team by ID."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM teams WHERE id = ?', (team_id,))
        row = cursor.fetchone()
        conn.close()
        
        return dict(row) if row else None
    
    def create_team(self, team_data: Dict) -> Dict:
        """Create a new team."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO teams (id, name, day) VALUES (?, ?, ?)',
            (team_data['id'], team_data['name'], team_data['day'])
        )
        conn.commit()
        conn.close()
        return team_data
    
    def update_team(self, team_id: str, team_data: Dict) -> Dict:
        """Update an existing team."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE teams SET name = ?, day = ? WHERE id = ?',
            (team_data['name'], team_data['day'], team_id)
        )
        conn.commit()
        conn.close()
        return {**team_data, 'id': team_id}
    
    def delete_team(self, team_id: str) -> bool:
        """Delete a team."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM teams WHERE id = ?', (team_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return deleted
    
    # Player operations
    def get_players(self) -> List[Dict]:
        """Get all players."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM players')
        rows = cursor.fetchall()
        conn.close()
        
        return [self._row_to_player(row) for row in rows]
    
    def get_player(self, player_id: str) -> Optional[Dict]:
        """Get a specific player by ID."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM players WHERE id = ?', (player_id,))
        row = cursor.fetchone()
        conn.close()
        
        return self._row_to_player(row) if row else None
    
    def create_player(self, player_data: Dict) -> Dict:
        """Create a new player."""
        conn = self._get_connection()
        cursor = conn.cursor()
        history_json = json.dumps(player_data.get('history', []))
        cursor.execute(
            'INSERT INTO players (id, name, team_id, handicap, history) VALUES (?, ?, ?, ?, ?)',
            (player_data['id'], player_data['name'], player_data['teamId'], 
             player_data['handicap'], history_json)
        )
        conn.commit()
        conn.close()
        return player_data
    
    def update_player(self, player_id: str, player_data: Dict) -> Dict:
        """Update an existing player."""
        conn = self._get_connection()
        cursor = conn.cursor()
        history_json = json.dumps(player_data.get('history', []))
        cursor.execute(
            'UPDATE players SET name = ?, team_id = ?, handicap = ?, history = ? WHERE id = ?',
            (player_data['name'], player_data['teamId'], player_data['handicap'], 
             history_json, player_id)
        )
        conn.commit()
        conn.close()
        return {**player_data, 'id': player_id}
    
    def delete_player(self, player_id: str) -> bool:
        """Delete a player."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM players WHERE id = ?', (player_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return deleted
    
    def _row_to_player(self, row) -> Dict:
        """Convert database row to player dictionary."""
        return {
            'id': row['id'],
            'name': row['name'],
            'teamId': row['team_id'],
            'handicap': row['handicap'],
            'history': json.loads(row['history']) if row['history'] else []
        }
    
    # Match operations
    def get_matches(self) -> List[Dict]:
        """Get all matches."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM matches')
        rows = cursor.fetchall()
        conn.close()
        
        return [self._row_to_match(row) for row in rows]
    
    def get_match(self, match_id: str) -> Optional[Dict]:
        """Get a specific match by ID."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM matches WHERE id = ?', (match_id,))
        row = cursor.fetchone()
        conn.close()
        
        return self._row_to_match(row) if row else None
    
    def create_match(self, match_data: Dict) -> Dict:
        """Create a new match."""
        conn = self._get_connection()
        cursor = conn.cursor()
        scores_json = json.dumps(match_data.get('scores', []))
        cursor.execute(
            '''INSERT INTO matches (id, date, day, team1_id, team2_id, completed, winner_id, score, scores)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (match_data['id'], match_data['date'], match_data['day'],
             match_data['team1Id'], match_data['team2Id'],
             1 if match_data.get('completed') else 0,
             match_data.get('winnerId'), match_data.get('score'), scores_json)
        )
        conn.commit()
        conn.close()
        return match_data
    
    def update_match(self, match_id: str, match_data: Dict) -> Dict:
        """Update an existing match."""
        conn = self._get_connection()
        cursor = conn.cursor()
        scores_json = json.dumps(match_data.get('scores', []))
        cursor.execute(
            '''UPDATE matches SET date = ?, day = ?, team1_id = ?, team2_id = ?,
               completed = ?, winner_id = ?, score = ?, scores = ? WHERE id = ?''',
            (match_data['date'], match_data['day'], match_data['team1Id'], match_data['team2Id'],
             1 if match_data.get('completed') else 0,
             match_data.get('winnerId'), match_data.get('score'), scores_json, match_id)
        )
        conn.commit()
        conn.close()
        return {**match_data, 'id': match_id}
    
    def delete_match(self, match_id: str) -> bool:
        """Delete a match."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM matches WHERE id = ?', (match_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return deleted
    
    def _row_to_match(self, row) -> Dict:
        """Convert database row to match dictionary."""
        match_dict = {
            'id': row['id'],
            'date': row['date'],
            'day': row['day'],
            'team1Id': row['team1_id'],
            'team2Id': row['team2_id'],
            'completed': bool(row['completed']),
            'scores': json.loads(row['scores']) if row['scores'] else []
        }
        if row['winner_id']:
            match_dict['winnerId'] = row['winner_id']
        if row['score']:
            match_dict['score'] = row['score']
        return match_dict
    
    # Initialization
    def initialize_data(self, data: Dict) -> bool:
        """Initialize the database with seed data."""
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            
            # Insert courses
            for course in data.get('courses', []):
                holes_json = json.dumps(course['holes'])
                cursor.execute(
                    'INSERT OR REPLACE INTO courses (id, name, holes) VALUES (?, ?, ?)',
                    (course['id'], course['name'], holes_json)
                )
            
            # Insert teams
            for team in data.get('teams', []):
                cursor.execute(
                    'INSERT OR REPLACE INTO teams (id, name, day) VALUES (?, ?, ?)',
                    (team['id'], team['name'], team['day'])
                )
            
            # Insert players
            for player in data.get('players', []):
                history_json = json.dumps(player.get('history', []))
                cursor.execute(
                    'INSERT OR REPLACE INTO players (id, name, team_id, handicap, history) VALUES (?, ?, ?, ?, ?)',
                    (player['id'], player['name'], player['teamId'], player['handicap'], history_json)
                )
            
            # Insert matches
            for match in data.get('matches', []):
                scores_json = json.dumps(match.get('scores', []))
                cursor.execute(
                    '''INSERT OR REPLACE INTO matches (id, date, day, team1_id, team2_id, completed, winner_id, score, scores)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                    (match['id'], match['date'], match['day'], match['team1Id'], match['team2Id'],
                     1 if match.get('completed') else 0, match.get('winnerId'), match.get('score'), scores_json)
                )
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error initializing data: {e}")
            return False
    
    def is_initialized(self) -> bool:
        """Check if the database has been initialized with data."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) as count FROM players')
        count = cursor.fetchone()['count']
        conn.close()
        return count > 0
