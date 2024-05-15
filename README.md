[*en*](#Tasks)

# Application de gestions de tâches

https://github.com/appliquant/tp3-dev-web/assets/29934021/6ad2226d-f58c-461f-83b9-d7e5506e975d

## Installation

### API (backend)

1. Aller dans le dossier api `cd api`
2. Installer les dépendances `npm install`
3. Modifier les valeurs dans `api/.env`
   1. Changer `PORT` pour le port de l'API (ex: PORT=3000)
   2. Changer `DATA_BASE` pour le lien de la base de donnéee. Par exemple : `DB_URL=mongodb://localhost:27017/taches`
4. Lancer l'API `npm start`

### Frontend

1. Aller dans le dossier taches-app `cd public/taches-app`
2. Installer les dépendances `npm install`
3. Pour lancer l'application localement, changer les valeurs dans `public/taches-app/.env`
   1. Changer `VITE_API_URL` pour le lien de l'API. Par exemple, `VITE_API_URL=http://localhost:3000`
4. Lancer l'application `npm run dev`

# Fonctionnalités

1. Tableaux

   - Créer/supprimer des tableaux

2. Listes
   - Créer des listes
   - Modifier le nom des listes
   - Filtrer les cartes selon la date limite (en retard, limite aujourd'hui, pas en retard)
   - Supprimer des listes

3. Cartes
   - Créer des cartes
   - Mettre une description
   - Mettre une date limite
   - Bouger les cartes vers différentes listes
   - Supprimer des cartes

# Technologies

Technologies utilisées : Html, Css, Javacscript, Typescript, Nodejs, Express.js, Vuejs, Pinia (state management), Vue router

# Tasks
Task Management Application

## Installation

### API (backend)

1. Go to the api folder `cd api`
2. Install dependencies `npm install`
3. Modify values in `api/.env`
   1. Change `PORT` to the API port (e.g., PORT=3000)
   2. Change `DATA_BASE` to the database URL. For example: `DB_URL=mongodb://localhost:27017/taches`
4. Start the API `npm start`

### Frontend

1. Go to the taches-app folder `cd public/taches-app`
2. Install dependencies `npm install`
3. To run the application locally, change the values in `public/taches-app/.env`
   1. Change `VITE_API_URL` to the API URL. For example, `VITE_API_URL=http://localhost:3000`
4. Start the application `npm run dev`

## Features

1. Boards
   - Create/delete boards

2. Lists
   - Create lists
   - Edit list names
   - Filter cards by due date (overdue, due today, not overdue)
   - Delete lists

3. Cards
   - Create cards
   - Add descriptions
   - Set due dates
   - Move cards to different lists
   - Delete cards

## Technologies

Technologies used: HTML, CSS, JavaScript, TypeScript, Node.js, Express.js, Vue.js, Pinia (state management), Vue Router

