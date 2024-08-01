import os
os.system("python .\manage.py makemigrations")
os.system("python .\manage.py migrate")
os.system("python .\manage.py runserver")

os.system("cd web")
os.system("npm run dev")