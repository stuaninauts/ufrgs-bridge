# UFRGS Bridge

to see users access: http://localhost:8000/admin and login with user: pessoal | password: pessoal

## Install and run the project

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

###### ###### ###### #####
## Roadmap Casos de Uso ##
###### ###### ###### #####

### Prioridade Alta

- UC1 Logar na Plataforma
    - [X] Backend
    - [X] Frontend
- UC2 Cadastrar na Plataforma
    - [X] Backend
    - [X] Frontend
- UC3 Validar Conta
    - [X] Backend
    - [X] Frontend
- UC4 Criar Projeto de Extensão
    - [X] Backend
    - [ ] Frontend (stuani & afonso)
- UC7 Criar Formulário de Inscrição para o Projeto de Extensão
    - [x] Backend (bea)
    - [ ] Frontend
- UC8 Candidatar-se ao Projeto
    - [x] Backend (bea)
    - [ ] Frontend
- UC9 Avaliar Inscrição do Candidato
    - [ ] Backend (bea)
    - [ ] Frontend
- UC14 Listar Projetos de Extensão
    - [X] Backend
    - [ ] Frontend (stuani & afonso)

### Prioridade Média-Alta

- UC13 Acessar Perfil
    - [ ] Backend
    - [ ] Frontend
- UC15 Pesquisar Projetos de Extensão
    - [ ] Backend
    - [ ] Frontend
- UC18 Editar Informações do Projeto de Extensão
    - [ ] Backend
    - [ ] Frontend

### Prioridade Média-Baixa

- UC10 Adicionar Atividade do Projeto de Extensão
    - [ ] Backend
    - [ ] Frontend
- UC11 Propor Registro de Atividade do Projeto de Extensão
    - [ ] Backend
    - [ ] Frontend
- UC12 Avaliar Proposta de Atividade Realizada
    - [ ] Backend
    - [ ] Frontend
- UC16 Trocar Disponibilidade para Inscrição no Projeto de Extensão
    - [ ] Backend
    - [ ] Frontend
- UC17 Trocar Disponibilidade de Realização de Atividades no Projeto
    - [ ] Backend
    - [ ] Frontend

### Prioridade Baixa

- UC5 Sugerir Ideia de Projeto de Extensão
    - [ ] Backend
    - [ ] Frontend
- UC6 Avaliar Ideia de Projeto de Extensão
    - [ ] Backend
    - [ ] Frontend
