# UFRGS Bridge

The UFRGS Bridge is a proposed software system designed to manage, organize, and simplify extension activities and projects at UFRGS. It aims to provide an engaging environment for undergraduate students, professors, and administrative staff. This initiative addresses a need at UFRGS, where 10% of students' graduation hours must be dedicated to extension projects. However, the current system used by the institution is outdated and lacks user-friendliness and accessibility.

This software was created during the Software Engineering () course at UFRGS taught by Prof. Dr. Lucineia Heloisa Thom.

## Install and run the project

First, you must have Django and NPM already installed, then:

Install dependencies if not up to date
```bash
pip install -r requirements.txt
```

After editing any API files, run the command:
```bash
python manage.py makemigrations
```

Then, to apply the migrations created, do:
```bash
python manage.py migrate
```

Next, run the server:
```bash
python manage.py runserver
```

Now, for the front-end part, run:
```bash
npm install web
npm run dev
```

## How is this project organized
```bash
api
|_ models.py
|_ views.py
ufrgs-bridge
|_ settings.py
web
 |_ components
     |_ Auth.js
     |_ HomePage.js
     |_ ProfilePage.js
```
### `api`

This folder is the core of the API and controls the logic of the back-end.

#### `models.py`
This file defines the database models and the structure of the data that the application will manage. It acts as the foundation for the data layer in the MVT (Model-View-Template) architecture.

#### `views.py`
This file acts as the View in the MVT Architecture. It is responsible for handling the logic behind each web request, interacting with the models, and formatting the data coming from the database to be rendered by the templates.

### `ufrgs-bridge`

This folder contains all the general configurations and settings that affect both the back-end and front-end. It includes settings related to the entire project, such as middleware, installed apps, and other configurations.

### `web`

This folder contains everything needed to display what the user should see, acting as the Template in the MVT architecture.

#### `components`
This subfolder contains React components that structure the front-end views.

##### `Auth.js`
This component manages user authentication, including login and registration forms.

##### `HomePage.js`
This component renders the homepage of the application, displaying relevant information and links based on the user's role and permissions.

##### `ProfilePage.js`
This component displays and allows editing of the user's profile information, such as name, email, and other personal details.
