"""
Flask application entry point for the golf league REST API.
"""

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from backend.api.routes import api, init_routes
from backend.storage import get_storage


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Enable CORS for frontend communication
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize storage
    storage = get_storage()
    init_routes(storage)

    # Register blueprints
    app.register_blueprint(api, url_prefix="/api")

    return app


def main():
    load_dotenv()
    app = create_app()
    print("Starting Golf League API server on http://localhost:5000")
    print("API endpoints available at http://localhost:5000/api/")
    app.run(debug=True, host="0.0.0.0", port=5000)


if __name__ == "__main__":
    main()
