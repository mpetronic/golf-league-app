"""
REST API routes for the golf league application.
Provides endpoints for CRUD operations on courses, teams, players, and matches.
"""
from flask import Blueprint, jsonify, request
from storage import StorageInterface

api = Blueprint('api', __name__)
storage = None  # Will be injected by app.py


def init_routes(storage_instance: StorageInterface):
    """Initialize routes with storage instance."""
    global storage
    storage = storage_instance


# Course endpoints
@api.route('/courses', methods=['GET'])
def get_courses():
    """Get all courses."""
    courses = storage.get_courses()
    return jsonify(courses)


@api.route('/courses/<course_id>', methods=['GET'])
def get_course(course_id):
    """Get a specific course."""
    course = storage.get_course(course_id)
    if course:
        return jsonify(course)
    return jsonify({'error': 'Course not found'}), 404


# Team endpoints
@api.route('/teams', methods=['GET'])
def get_teams():
    """Get all teams."""
    teams = storage.get_teams()
    return jsonify(teams)


@api.route('/teams/<team_id>', methods=['GET'])
def get_team(team_id):
    """Get a specific team."""
    team = storage.get_team(team_id)
    if team:
        return jsonify(team)
    return jsonify({'error': 'Team not found'}), 404


@api.route('/teams', methods=['POST'])
def create_team():
    """Create a new team."""
    team_data = request.json
    team = storage.create_team(team_data)
    return jsonify(team), 201


@api.route('/teams/<team_id>', methods=['PUT'])
def update_team(team_id):
    """Update a team."""
    team_data = request.json
    team = storage.update_team(team_id, team_data)
    return jsonify(team)


@api.route('/teams/<team_id>', methods=['DELETE'])
def delete_team(team_id):
    """Delete a team."""
    success = storage.delete_team(team_id)
    if success:
        return jsonify({'message': 'Team deleted'}), 200
    return jsonify({'error': 'Team not found'}), 404


# Player endpoints
@api.route('/players', methods=['GET'])
def get_players():
    """Get all players."""
    players = storage.get_players()
    return jsonify(players)


@api.route('/players/<player_id>', methods=['GET'])
def get_player(player_id):
    """Get a specific player."""
    player = storage.get_player(player_id)
    if player:
        return jsonify(player)
    return jsonify({'error': 'Player not found'}), 404


@api.route('/players', methods=['POST'])
def create_player():
    """Create a new player."""
    player_data = request.json
    player = storage.create_player(player_data)
    return jsonify(player), 201


@api.route('/players/<player_id>', methods=['PUT'])
def update_player(player_id):
    """Update a player."""
    player_data = request.json
    player = storage.update_player(player_id, player_data)
    return jsonify(player)


@api.route('/players/<player_id>', methods=['DELETE'])
def delete_player(player_id):
    """Delete a player."""
    success = storage.delete_player(player_id)
    if success:
        return jsonify({'message': 'Player deleted'}), 200
    return jsonify({'error': 'Player not found'}), 404


# Match endpoints
@api.route('/matches', methods=['GET'])
def get_matches():
    """Get all matches."""
    matches = storage.get_matches()
    return jsonify(matches)


@api.route('/matches/<match_id>', methods=['GET'])
def get_match(match_id):
    """Get a specific match."""
    match = storage.get_match(match_id)
    if match:
        return jsonify(match)
    return jsonify({'error': 'Match not found'}), 404


@api.route('/matches', methods=['POST'])
def create_match():
    """Create a new match."""
    match_data = request.json
    match = storage.create_match(match_data)
    return jsonify(match), 201


@api.route('/matches/<match_id>', methods=['PUT'])
def update_match(match_id):
    """Update a match."""
    match_data = request.json
    match = storage.update_match(match_id, match_data)
    return jsonify(match)


@api.route('/matches/<match_id>', methods=['DELETE'])
def delete_match(match_id):
    """Delete a match."""
    success = storage.delete_match(match_id)
    if success:
        return jsonify({'message': 'Match deleted'}), 200
    return jsonify({'error': 'Match not found'}), 404


# Initialization endpoints
@api.route('/initialize', methods=['POST'])
def initialize_data():
    """Initialize database with seed data."""
    data = request.json
    success = storage.initialize_data(data)
    if success:
        return jsonify({'message': 'Database initialized successfully'}), 200
    return jsonify({'error': 'Failed to initialize database'}), 500


@api.route('/status', methods=['GET'])
def get_status():
    """Check if database is initialized."""
    initialized = storage.is_initialized()
    return jsonify({'initialized': initialized})
