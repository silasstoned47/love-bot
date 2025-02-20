# LoveBot

Um bot do Facebook Messenger para gerenciamento de leads e automação de mensagens.

## Tecnologias

- Node.js 20
- TypeScript
- Redis
- MySQL
- Docker
- PM2

## Configuração do Ambiente

### Pré-requisitos

- Docker
- Docker Compose

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
BASE_URL=https://seu-dominio.com

# Facebook Integration
FACEBOOK_PAGE_ID=seu_page_id
FACEBOOK_ACCESS_TOKEN=seu_access_token
FACEBOOK_VERIFICATION_TOKEN=seu_verification_token

# Redis Connection
REDIS_HOST=seu_redis_host
REDIS_PORT=seu_redis_port
REDIS_PASSWORD=sua_senha_redis

# MySQL Connection
MYSQL_HOST=seu_mysql_host
MYSQL_PORT=seu_mysql_port
MYSQL_USER=seu_usuario
MYSQL_PASSWORD=sua_senha
MYSQL_DATABASE=seu_banco
```

## Executando com Docker

1. Construa a imagem:
```bash
docker-compose build
```

2. Inicie os containers:
```bash
docker-compose up
```

Para rodar em background:
```bash
docker-compose up -d
```

3. Para parar os containers:
```bash
docker-compose down
```

## Desenvolvimento Local

1. Instale as dependências:
```bash
npm install
```

2. Build do projeto:
```bash
npm run build
```

3. Inicie o servidor:
```bash
npm start
```

## Estrutura do Projeto

- `src/` - Código fonte
  - `config/` - Configurações
  - `lib/` - Bibliotecas e utilitários
  - `services/` - Serviços da aplicação
  - `templates/` - Templates de mensagens
  - `workers/` - Workers para processamento assíncrono

## Licença

MIT
