"""
MariaDB implementation of the storage interface.
Provides persistent storage for the golf league application using MariaDB database.
"""
import json
import mysql.connector
from typing import List, Dict, Optional
from backend.storage.base import StorageInterface


class MariaDBStorage(StorageInterface):
    """MariaDB implementation of the storage interface."""
    
    def __init__(self, host, port, database, user, password):
        """Initialize MariaDB storage with the given connection details."""
        self.config = {
            'host': host,
            'port': port,
            'database': database,
            'user': user,
            'password': password,
            'charset': 'utf8mb4',
            'collation': 'utf8mb4_unicode_ci'
        }
        self._init_database()
    
    def _get_connection(self):
        """Get a database connection."""
        return mysql.connector.connect(**self.config)
    
    def _init_database(self):
        """Initialize database schema."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        # Courses table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS courses (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                holes TEXT NOT NULL
            )
        ''')
        
        # Teams table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS teams (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                day VARCHAR(255) NOT NULL
            )
        ''')
        
        # Players table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS players (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                team_id VARCHAR(255) NOT NULL,
                handicap INTEGER NOT NULL,
                history TEXT,
                FOREIGN KEY (team_id) REFERENCES teams(id)
            )
        ''')
        
        # Matches table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS matches (
                id VARCHAR(255) PRIMARY KEY,
                date VARCHAR(255) NOT NULL,
                day VARCHAR(255) NOT NULL,
                team1_id VARCHAR(255) NOT NULL,
                team2_id VARCHAR(255) NOT NULL,
                completed TINYINT(1) DEFAULT 0,
                winner_id VARCHAR(255),
                score VARCHAR(255),
                scores TEXT,
                FOREIGN KEY (team1_id) REFERENCES teams(id),
                FOREIGN KEY (team2_id) REFERENCES teams(id),
                FOREIGN KEY (winner_id) REFERENCES teams(id)
            )
        ''')
        
        conn.commit()
        cursor.close()
        conn.close()
    
    # Course operations
    def get_courses(self) -> List[Dict]:
        """Get all courses."""
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM courses')
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return [self._row_to_course(row) for row in rows]
    
    def get_course(self, course_id: str) -> Optional[Dict]:
        """Get a specific course by ID."""
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM courses WHERE id = %s', (course_id,))
        row = cursor.fetchone()
        cursor.close()
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
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM teams')
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_team(self, team_id: str) -> Optional[Dict]:
        """Get a specific team by ID."""
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM teams WHERE id = %s', (team_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return dict(row) if row else None
    
    def create_team(self, team_data: Dict) -> Dict:
        """Create a new team."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO teams (id, name, day) VALUES (%s, %s, %s)',
            (team_data['id'], team_data['name'], team_data['day'])
        )
        conn.commit()
        cursor.close()
        conn.close()
        return team_data
    
    def update_team(self, team_id: str, team_data: Dict) -> Dict:
        """Update an existing team."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE teams SET name = %s, day = %s WHERE id = %s',
            (team_data['name'], team_data['day'], team_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {**team_data, 'id': team_id}
    
    def delete_team(self, team_id: str) -> bool:
        """Delete a team."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM teams WHERE id = %s', (team_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        cursor.close()
        conn.close()
        return deleted
    
    # Player operations
    def get_players(self) -> List[Dict]:
        """Get all players."""
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM players')
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return [self._row_to_player(row) for row in rows]
    
    def get_player(self, player_id: str) -> Optional[Dict]:
        """Get a specific player by ID."""
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM players WHERE id = %s', (player_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return self._row_to_player(row) if row else None
    
    def create_player(self, player_data: Dict) -> Dict:
        """Create a new player."""
        conn = self._get_connection()
        cursor = conn.cursor()
        history_json = json.dumps(player_data.get('history', []))
        cursor.execute(
            'INSERT INTO players (id, name, team_id, handicap, history) VALUES (%s, %s, %s, %s, %s)',
            (player_data['id'], player_data['name'], player_data['teamId'], 
             player_data['handicap'], history_json)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return player_data
    
    def update_player(self, player_id: str, player_data: Dict) -> Dict:
        """Update an existing player."""
        conn = self._get_connection()
        cursor = conn.cursor()
        history_json = json.dumps(player_data.get('history', []))
        cursor.execute(
            'UPDATE players SET name = %s, team_id = %s, handicap = %s, history = %s WHERE id = %s',
            (player_data['name'], player_data['teamId'], player_data['handicap'], 
             history_json, player_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {**player_data, 'id': player_id}
    
    def delete_player(self, player_id: str) -> bool:
        """Delete a player."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM players WHERE id = %s', (player_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        cursor.close()
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
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM matches')
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return [self._row_to_match(row) for row in rows]
    
    def get_match(self, match_id: str) -> Optional[Dict]:
        """Get a specific match by ID."""
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM matches WHERE id = %s', (match_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return self._row_to_match(row) if row else None
    
    def create_match(self, match_data: Dict) -> Dict:
        """Create a new match."""
        conn = self._get_connection()
        cursor = conn.cursor()
        scores_json = json.dumps(match_data.get('scores', []))
        cursor.execute(
            '''INSERT INTO matches (id, date, day, team1_id, team2_id, completed, winner_id, score, scores)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)''',
            (match_data['id'], match_data['date'], match_data['day'],
             match_data['team1Id'], match_data['team2Id'],
             1 if match_data.get('completed') else 0,
             match_data.get('winnerId'), match_data.get('score'), scores_json)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return match_data
    
    def update_match(self, match_id: str, match_data: Dict) -> Dict:
        """Update an existing match."""
        conn = self._get_connection()
        cursor = conn.cursor()
        scores_json = json.dumps(match_data.get('scores', []))
        cursor.execute(
            '''UPDATE matches SET date = %s, day = %s, team1_id = %s, team2_id = %s,
               completed = %s, winner_id = %s, score = %s, scores = %s WHERE id = %s''',
            (match_data['date'], match_data['day'], match_data['team1Id'], match_data['team2Id'],
             1 if match_data.get('completed') else 0,
             match_data.get('winnerId'), match_data.get('score'), scores_json, match_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {**match_data, 'id': match_id}
    
    def delete_match(self, match_id: str) -> bool:
        """Delete a match."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM matches WHERE id = %s', (match_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        cursor.close()
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
                    'REPLACE INTO courses (id, name, holes) VALUES (%s, %s, %s)',
                    (course['id'], course['name'], holes_json)
                )
            
            # Insert teams
            for team in data.get('teams', []):
                cursor.execute(
                    'REPLACE INTO teams (id, name, day) VALUES (%s, %s, %s)',
                    (team['id'], team['name'], team['day'])
                )
            
            # Insert players
            for player in data.get('players', []):
                history_json = json.dumps(player.get('history', []))
                cursor.execute(
                    'REPLACE INTO players (id, name, team_id, handicap, history) VALUES (%s, %s, %s, %s, %s)',
                    (player['id'], player['name'], player['teamId'], player['handicap'], history_json)
                )
            
            # Insert matches
            for match in data.get('matches', []):
                scores_json = json.dumps(match.get('scores', []))
                cursor.execute(
                    '''REPLACE INTO matches (id, date, day, team1_id, team2_id, completed, winner_id, score, scores)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)''',
                    (match['id'], match['date'], match['day'], match['team1Id'], match['team2Id'],
                     1 if match.get('completed') else 0, match.get('winnerId'), match.get('score'), scores_json)
                )
            
            conn.commit()
            cursor.close()
            conn.close()
            return True
        except Exception as e:
            print(f"Error initializing data: {e}")
            return False
    
    def is_initialized(self) -> bool:
        """Check if the database has been initialized with data."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM players')
        count = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        return count > 0
