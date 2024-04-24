# UFRGS Bridge

explanation

## Install and run the project

Must have django and npm installed.

After editing api files, run makemigrations to make new migrations

```bash
cd ufrgs_bridge
python manage.py makemigrations
```
then do to apply them:
```bash
python manage.py migreate
```
then run the server:
```bash
python manage.py runserver
```

to start react do (only do npm install if its either: first time running or if dependencies changed)
```bash
npm install
npm run dev
```

## How is this project organized

folders explanation

