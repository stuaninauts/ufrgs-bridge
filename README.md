# UFRGS Bridge

to see users access: http://localhost:8000/admin and login with user: pessoal | password: pessoal

## Install and run the project

todo: 
run_windows.bat
run_linux.sh

Must have django and npm installed.

Install dependencies
```bash
pip install -r requirements.txt
```

After editing api files, run makemigrations to make new migrations

```bash
python manage.py makemigrations
```
then do to apply them:
```bash
python manage.py migrate
```
then run the server:
```bash
python manage.py runserver
```

to start react do (only do npm install if its either: first time running or if dependencies changed)
```bash
npm install web
npm run dev
```

## How is this project organized

folders explanation

