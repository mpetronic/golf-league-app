# Golf League Backend API

REST API backend for the golf league application, providing persistent storage using SQLite.

## Features

- **Abstract Storage Interface**: Easily swap storage backends (SQLite, PostgreSQL, etc.)
- **SQLite Implementation**: Lightweight, file-based database
- **RESTful API**: Standard HTTP methods for CRUD operations
- **CORS Enabled**: Supports cross-origin requests from frontend
- **Auto-initialization**: Automatically populates database with seed data if empty

## Installation

1. Create virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate
pip install -e .
```

Or for development:
```bash
pip install -e ".[dev]"
```

## Running the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get specific course

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get specific team
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get specific player
- `POST /api/players` - Create player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get specific match
- `POST /api/matches` - Create match
- `PUT /api/matches/:id` - Update match
- `DELETE /api/matches/:id` - Delete match

### Initialization
- `GET /api/status` - Check if database is initialized
- `POST /api/initialize` - Initialize database with seed data

## Database

The SQLite database is stored at `backend/database/golf_league.db` and is created automatically on first run.

## Architecture

```
backend/
├── app.py                 # Flask application entry point
├── api/
│   ├── routes.py          # REST API endpoints
│   └── __init__.py
├── storage/
│   ├── base.py            # Abstract storage interface
│   ├── sqlite_storage.py  # SQLite implementation
│   └── __init__.py
├── database/
│   └── golf_league.db     # SQLite database (created at runtime)
└── pyproject.toml         # Python dependencies
```

## Development

Run with debug mode (auto-reload on code changes):
```bash
python app.py
```

The server runs in debug mode by default when started directly.
