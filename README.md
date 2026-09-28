# Vidora

Plataforma Full Stack para descoberta, pesquisa e gerenciamento de vídeos, construída com arquitetura de microsserviços.

O Vidora permite:

- autenticação de usuários (registro, login e rotas protegidas)
- pesquisa e listagem de vídeos via integração com a API do YouTube
- gerenciamento de favoritos por usuário autenticado

## Arquitetura

```
Frontend (Vite + TypeScript)
    ↓ HTTP/REST (JSON)
API Gateway (:3000)
    ↓ HTTP/REST (JSON)
Auth Service (:3001) · Video Service (:3002) · Favorites Service (:3003)
    ↓
PostgreSQL (vidora_auth :5432, vidora_favoritos :5433)
```

- **Frontend:** aplicação TypeScript sem framework, empacotada com Vite. Fala apenas com o gateway (`http://localhost:3000`). Em desenvolvimento, o `vite.config.ts` faz proxy de `/auth`, `/videos` e `/favoritos` para o gateway.
- **API Gateway (`backend/api-gateway`):** ponto único de entrada HTTP. Encaminha requisições para os serviços internos através de proxies (`AuthProxy`, `VideosProxy`, `FavoritosProxy`) usando um `HttpClient` próprio com timeout. Expõe `GET /health`, `GET /api-docs.json` e Swagger UI em `http://localhost:3000/api-docs`. Valida o token Bearer repassando ao Auth Service.
- **Auth Service (`backend/auth-service`, :3001):** registro, login e consulta de usuário. Persiste em `vidora_auth`, tabela `usuarios`.
- **Video Service (`backend/video-service`, :3002):** consulta a YouTube Data API v3 (`/search` e `/videos`) e normaliza a resposta para o formato da aplicação. Não possui banco próprio.
- **Favorites Service (`backend/favorites-service`, :3003):** adiciona, remove, lista e verifica favoritos por usuário. Persiste em `vidora_favoritos`, tabela `favoritos` com restrição `UNIQUE(usuario_id, video_id)`.

Cada serviço tem middleware próprio de erro e de CORS, validação nos controllers e `try-catch` nas operações assíncronas.

## Tecnologias

- **TypeScript (strict)** em frontend e em todos os serviços backend
- **Express 5** nos 4 serviços backend
- **PostgreSQL 15** via Docker Compose (2 bancos isolados por serviço)
- **Docker / Docker Compose** para o ambiente de dados
- **Jest + ts-jest** para testes (unitários e de integração)
- **REST + JSON** na comunicação entre frontend, gateway e microsserviços
- **YouTube Data API v3** no Video Service
- Bibliotecas de apoio efetivamente usadas: `pg` (driver PostgreSQL), `cors` (nos serviços que atendem o browser), `swagger-ui-express` (documentação do gateway), `dotenv` (variáveis de ambiente), `vite` (frontend)

## Padrões existentes no código

- **Repository:** `UsuarioRepository` e `FavoritosRepository` concentram o SQL (`pg`) e o acesso ao PostgreSQL.
- **Service:** `AuthService`, `YouTubeService` e `FavoritosService` concentram as regras de negócio (ex.: e-mail duplicado, senha inválida, favorito duplicado, tratamento de erros 400/403 do YouTube).
- **Controller:** camada HTTP fina que valida a entrada e chama o Service correspondente.
- **Factory:** `HttpClient` é instanciado com baseURL e timeout específicos por consumidor (gateway → serviços internos, Video Service → `https://www.googleapis.com/youtube/v3`, frontend → gateway).
- **Adapter:** `YouTubeAdapter` traduz `search`/`videos` da API do YouTube para o formato interno (`id`, `titulo`, `descricao`, `canal`, `thumbnail`, `publicadoEm`, paginação).

## Decisões técnicas e trade-offs

### Microsserviços com gateway

4 processos separados: `api-gateway`, `auth-service`, `video-service`, `favorites-service`, comunicando-se por HTTP/REST com JSON e timeout configurado.

- **Positivo:** cada serviço tem responsabilidade clara, pode ser evoluído e escalado de forma independente; falha isolada é mais fácil de localizar por serviço.
- **Negativo:** comunicação entre serviços é mais lenta que chamada local; depuração distribuída é mais difícil; se um serviço interno cai, as rotas do gateway que dependem dele são afetadas.

### Express em vez de um framework opinativo

Escolha por controle explícito da montagem (middlewares, rotas, erros) e por ser suficiente para o escopo atual.

- **Positivo:** leve, direto e com total liberdade de organização.
- **Negativo:** mais montagem manual (CORS, erros, validação, docs) em cada serviço.

### TypeScript strict em tudo

- **Positivo:** erros de tipo detectados antes da execução; contratos entre camadas mais explícitos.
- **Negativo:** exige mais disciplina de tipagem, inclusive nos testes.

### PostgreSQL com um banco por serviço com estado

- `vidora_auth` (porta 5432): usuários e senhas.
- `vidora_favoritos` (porta 5433): vídeos favoritados.
- Video Service é stateless e não usa banco.

Decisão documentada como técnica: isolamento de dados por serviço, ao custo de operar dois bancos.

### JWT e hash implementados manualmente

Autenticação via token Bearer no cabeçalho `Authorization`. O JWT é montado manualmente com HMAC-SHA256 e Base64Url; a senha usa SHA-256 com salt aleatório de 16 bytes (formato `salt:hash`).

Trata-se de uma decisão de estudo para explicitar o mecanismo. **Em produção, prefira `bcrypt`/`argon2` para senhas e `jsonwebtoken` (ou equivalente mantido) para JWT**, com rotação de segredo, expiração curta e validação completa.

### HTTP/REST direto entre serviços

Sem fila ou service mesh: `fetch` com `AbortController` e timeout (5s no gateway, 5s no YouTube, 10s no frontend).

- **Positivo:** simples de implementar e depurar.
- **Negativo:** acoplamento temporal entre gateway e serviços internos.

### Dependências além do núcleo

- `pg`: sem driver não há conexão com o PostgreSQL.
- `cors`: frontend (`:5173`) e backend (`:3000`-`:3003`) rodam em origens diferentes.
- `swagger-ui-express`: documentação interativa em `http://localhost:3000/api-docs`.

## Pré-requisitos

- Node 20+ e yarn ou npm
- Docker e Docker Compose (recomendado para os bancos)
- Uma chave da YouTube Data API v3

## Configuração de ambiente

Cada serviço possui um `.env.example` com valores fictícios. Copie para `.env` e preencha:

```bash
cp backend/auth-service/.env.example backend/auth-service/.env
cp backend/video-service/.env.example backend/video-service/.env
cp backend/favorites-service/.env.example backend/favorites-service/.env
cp backend/api-gateway/.env.example backend/api-gateway/.env
cp frontend/.env.example frontend/.env
```

Variáveis:

| Serviço | Arquivo | Variáveis |
|---|---|---|
| auth-service | `backend/auth-service/.env` | `PORT=3001`, `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vidora_auth`, `JWT_SECRET=seu_jwt_secret_aqui`, `JWT_EXPIRES_IN=3600` |
| video-service | `backend/video-service/.env` | `PORT=3002`, `YOUTUBE_API_KEY=your_youtube_api_key` |
| favorites-service | `backend/favorites-service/.env` | `PORT=3003`, `DATABASE_URL=postgresql://postgres:postgres@localhost:5433/vidora_favoritos` |
| api-gateway | `backend/api-gateway/.env` | `PORT=3000`, `AUTH_SERVICE_URL=http://localhost:3001`, `VIDEOS_SERVICE_URL=http://localhost:3002`, `FAVORITOS_SERVICE_URL=http://localhost:3003` |
| frontend | `frontend/.env` | `VITE_API_URL=http://localhost:3000` (opcional; vazia usa proxy do Vite em dev) |

Gere um segredo local para desenvolvimento com:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

Nunca versione arquivos `.env` com valores reais (o `.gitignore` já ignora `**/.env`).

## Executando

### 1. Bancos de dados (Docker, recomendado)

```bash
cd backend/
docker-compose up -d
```

Cria `postgres-vidora-auth` (`vidora_auth`, 5432) e `postgres-vidora-favoritos` (`vidora_favoritos`, 5433) na network `vidora-network`, com persistência em volumes Docker.

Alternativa local: PostgreSQL 15+, criar manualmente `vidora_auth` e `vidora_favoritos` e ajustar portas/credenciais nos `.env`.

### 2. Backend (4 terminais, ou o gerenciador de processos de sua preferência)

```bash
# terminal 1
cd backend/auth-service && yarn install && yarn dev
# terminal 2
cd backend/video-service && yarn install && yarn dev
# terminal 3
cd backend/favorites-service && yarn install && yarn dev
# terminal 4
cd backend/api-gateway && yarn install && yarn dev
```

Build de produção por serviço: `yarn build && yarn start`.

### 3. Frontend

```bash
cd frontend
yarn install
yarn dev
```

Acesse `http://localhost:5173`. Com `VITE_API_URL` definido, o frontend chama o gateway diretamente; sem ele, usa caminhos relativos atendidos pelo proxy do Vite em desenvolvimento. Em ambos os casos o gateway precisa estar no ar em `http://localhost:3000` — verifique que nenhum outro processo (ex.: outro `dev server`) esteja ocupando a porta 3000.

Documentação da API: `http://localhost:3000/api-docs` (`GET /api-docs.json` expõe o spec OpenAPI).

## Testes

Cada pacote possui Jest configurado (`jest.config.ts` + scripts `test`, `test:watch`; o gateway possui também `test:ci` com coverage):

```bash
# frontend
cd frontend && yarn test

# backend (um por serviço)
cd backend/auth-service && yarn test
cd backend/video-service && yarn test
cd backend/favorites-service && yarn test
cd backend/api-gateway && yarn test
```

Estrutura existente:

```
tests/
├── unit/         # classes/funções isoladas (ex.: AuthService com mocks, proxies do gateway)
└── integration/  # serviços trabalhando juntos
frontend/src/__tests__/  # store de autenticação e validação de formulários
```

## Endpoints principais (via gateway :3000)

- `POST /auth/registrar` — `{ email, senha }`
- `POST /auth/entrar` — `{ email, senha }` → `{ token, usuario }`
- `GET /auth/usuario` — Bearer token
- `GET /videos/buscar?q=...&pageToken=...`
- `POST /videos/ids` — `{ ids: string[] }`
- `GET /favoritos` — Bearer token
- `POST /favoritos` — Bearer token, `{ videoId }`
- `DELETE /favoritos/:videoId` — Bearer token
- `GET /favoritos/:videoId/verificar` — Bearer token

O detalhamento interativo está no Swagger (`/api-docs`).
