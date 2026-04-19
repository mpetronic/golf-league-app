# Golf League App

This application is designed to manage a golf league, including tracking scores, handicaps, players,
teams, and standings for players and teams and managing courses.

# Prerequisites

The Python REST API uses Flask and Flask-CORS. It is run in a virtual environment.
The front end uses React and Vite. UV is used for Python package management. Hatch is used for the
Python packaging and deployment.  

1. Install uv and hatch globally using pipx:
```
sudo apt install pipx
pipx install uv
pipx install hatch
```

2. Create a virtual environment for the backend:
```
cd backend
uv venv
```

# Development Setup

The application is a single page application that runs in the browser. The backend is a local
SQLite3 database behind a Python REST API that runs in a separate process. Both must be running for
the application to function.

1. In one terminal, setup the backend Python REST server by creating a virtual environment and
   installing dependencies in editable mode.
    ```
    cd backend
    source .venv/bin/activate
    uv pip install -e .[dev]
    ```

2. In a different terminal, setup npm from the project root folder and start the web application development server.
    ```
    npm install
    ```

# Running the App

This assumes you have already done the steps under Development Setup first.

1. In one terminal, start the backend REST API server.
    ```
    cd backend && source .venv/bin/activate && serve
    ```

2. In another terminal, start the frontend application development server.
    ```
    npm run dev
    ```

3. Open http://localhost:5173 in your browser.


# Building the App

```
npm run build
```

# Deploying the App

```
npm run deploy
```

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
