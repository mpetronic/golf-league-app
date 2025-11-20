# Golf League App

This application is designed to manage a golf league, including tracking scores, handicaps, players,
teams, and standings for players and teams and managing courses.

## Development

The application is a single page application that runs in the browser. The backend is a local
SQLite3 database behind a Python REST API that runs in a separate process. Both must be running for
the application to function.

1. In one terminal, setup the backend Python REST server by creating a virtual environment and
   installing dependencies in editable mode.

        cd backend
        /usr/bin/python3 -m venv .venv
        source .venv/bin/activate
        pip install -e .[dev]

1. Start up the REST debug server.

        python app.py

1. In a different terminal, setup npm from the project root folder and start the development server.

        npm install
        npm run dev

## Running the App

This assumes you have already done the steps under Development first.

1. In one terminal:

        cd backend && source .venv/bin/activate && python app.py

1. In a second terminal:

        npm run dev

## Building the App

    npm run build

## Deploying the App

    npm run deploy

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
