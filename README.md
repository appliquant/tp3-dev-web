# Application de gestions de tâches

Api : https://tp3-dev-web.onrender.com/api-docs/

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
