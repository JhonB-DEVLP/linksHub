# LinkHub - Plataforma de Links Personalizada

LinkHub é uma plataforma open-source para criar e gerenciar páginas de links personalizadas.

## Funcionalidades

- Criação de páginas de links personalizadas
- Personalização completa de aparência
- Estatísticas detalhadas de cliques e visualizações
- Organização de links por categorias
- Perfil público personalizado
- Modo escuro/claro
- Recuperação de senha
- Upload de imagens
- Arrastar e soltar para reordenar links

## Tecnologias

- Next.js 14 (App Router)
- React 18
- PostgreSQL (Neon)
- Autenticação JWT
- Tailwind CSS
- shadcn/ui

## Como executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL ou Neon Database

### Instalação

1. Clone o repositório
\`\`\`bash
git clone https://github.com/seu-usuario/linkhub.git
cd linkhub
\`\`\`

2. Instale as dependências
\`\`\`bash
npm install
\`\`\`

3. Configure as variáveis de ambiente
\`\`\`bash
cp .env.example .env.local
\`\`\`
Edite o arquivo `.env.local` com suas configurações.

4. Execute as migrações do banco de dados
\`\`\`bash
npx prisma migrate dev
\`\`\`

5. Inicie o servidor de desenvolvimento
\`\`\`bash
npm run dev
\`\`\`

6. Acesse `http://localhost:3000`

## Implantação

Para implantar em produção:

1. Configure as variáveis de ambiente em seu provedor de hospedagem
2. Execute o build da aplicação
\`\`\`bash
npm run build
\`\`\`
3. Inicie o servidor de produção
\`\`\`bash
npm start
\`\`\`

## Estrutura do Projeto

- `app/` - Rotas e páginas da aplicação (Next.js App Router)
- `components/` - Componentes React reutilizáveis
- `lib/` - Funções utilitárias e configurações
- `public/` - Arquivos estáticos
- `server/` - Código do servidor (API, controllers, etc.)
- `types/` - Definições de tipos TypeScript
- `hooks/` - React hooks personalizados
- `contexts/` - Contextos React para gerenciamento de estado
- `prisma/` - Schema e migrações do banco de dados

## Funcionalidades Implementadas

- ✅ Autenticação de usuários (registro, login, logout)
- ✅ Recuperação de senha
- ✅ Gerenciamento de links (criar, editar, excluir)
- ✅ Reordenação de links com arrastar e soltar
- ✅ Upload de imagens para avatar
- ✅ Personalização de perfil
- ✅ Estatísticas básicas de visualizações e cliques
- ✅ Página pública de links personalizada

## Próximos Passos

- Autenticação social (Google, GitHub)
- Verificação de email
- Suporte a domínios personalizados
- Estatísticas avançadas
- Temas adicionais
- Integração com outras plataformas

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
