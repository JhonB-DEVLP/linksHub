#!/bin/bash

# Criar diretório do servidor se não existir
mkdir -p server

# Instalar dependências
npm install express cors dotenv cookie-parser jsonwebtoken bcryptjs
npm install -D typescript ts-node nodemon @types/express @types/cors @types/cookie-parser @types/jsonwebtoken @types/bcryptjs @types/node

# Instalar Prisma
npm install @prisma/client
npm install -D prisma

# Inicializar Prisma com PostgreSQL
npx prisma init --datasource-provider postgresql

# Criar estrutura de diretórios
mkdir -p server/controllers
mkdir -p server/middleware
mkdir -p server/routes
mkdir -p server/utils

echo "Configuração inicial concluída!"
echo "Agora você precisa:"
echo "1. Configurar o arquivo .env com suas credenciais do PostgreSQL"
echo "2. Executar 'npx prisma migrate dev' para criar as tabelas no banco de dados"
echo "3. Iniciar o servidor com 'npm run dev'"
