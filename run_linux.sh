#!/bin/bash
# UFRGS Bridge

# Função para verificar se a porta está em uso e matar o processo
function kill_process_on_port() {
    PORT=$1
    PID=$(lsof -t -i:$PORT)
    if [ ! -z "$PID" ]; then
        echo "Parando processo na porta $PORT (PID $PID)..."
        kill -9 $PID
    else
        echo "Nenhum processo rodando na porta $PORT."
    fi
}

# Porta padrão para o servidor Django
DJANGO_PORT=8000

# Porta padrão para o servidor React
REACT_PORT=3000

# Parar processos rodando nas portas do Django e React
kill_process_on_port $DJANGO_PORT
kill_process_on_port $REACT_PORT

# Cria novas migrações
python manage.py makemigrations

# Aplica as migrações
python manage.py migrate

# Inicia o servidor Django em segundo plano na porta escolhida e redireciona a saída para um log
nohup python manage.py runserver $DJANGO_PORT > log_django_server.log 2>&1 &


# Instala dependências do npm (se necessário)
npm install --prefix web

# Inicia o React em segundo plano na porta escolhida e redireciona a saída para um log
nohup npm run dev --prefix web > log_react_server.log 2>&1 &

echo "Servidor Django rodando na porta $DJANGO_PORT"
echo "Servidor React rodando na porta $REACT_PORT"
