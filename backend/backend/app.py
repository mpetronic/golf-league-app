"""
Flask application entry point for the golf league REST API.
"""

import os
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from backend.api.routes import api, init_routes
from backend.storage import Storage


def create_app(dbpath: str):
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Enable CORS for frontend communication
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize storage
    storage = Storage(dbpath)
    init_routes(storage)

    # Register blueprints
    app.register_blueprint(api, url_prefix="/api")

    return app


def main():
    load_dotenv()
    dbpath = os.getenv("DATABASE_PATH")
    if not dbpath:
        raise RuntimeError("DATABASE_PATH environment variable is not set")
    if not os.path.exists(dbpath):
        raise RuntimeError(f"Database file does not exist at {dbpath}")
    app = create_app(dbpath)
    print("Starting Golf League API server on http://localhost:5000")
    print("API endpoints available at http://localhost:5000/api/")
    app.run(debug=True, host="0.0.0.0", port=5000)


if __name__ == "__main__":
    main()