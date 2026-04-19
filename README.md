# Projeto Tarefas

Sistema de gerenciamento de projetos e tarefas com autenticação JWT, composto por uma API REST em .NET 8 e um frontend em Angular 17.

## Tecnologias

**Backend**
- .NET 8 (ASP.NET Core Web API)
- Entity Framework Core 8 + SQLite
- Autenticação JWT (Bearer Token)
- AutoMapper
- BCrypt.Net (hash de senhas)
- Swagger / OpenAPI

**Frontend**
- Angular 17
- RxJS
- Angular Router com guards de autenticação
- Interceptor HTTP para injeção automática do JWT

## Estrutura do Projeto

```
projeto_claude/
├── backend/
│   └── ProjetoTarefas/
│       ├── Controllers/      # AuthController, ProjectsController, TasksController
│       ├── DTOs/             # Objetos de transferência de dados
│       ├── Models/           # User, Project, TaskItem, TaskHistory
│       ├── Data/             # AppDbContext (EF Core)
│       ├── Profiles/         # Mapeamentos AutoMapper
│       └── Migrations/
└── frontend/
    └── src/app/
        ├── components/       # auth, projects, tasks
        ├── services/         # AuthService, ProjectService, TaskService
        ├── guards/           # AuthGuard
        ├── interceptors/     # JwtInterceptor
        └── models/           # Interfaces TypeScript
```

## Funcionalidades

- Cadastro e login de usuários com token JWT (validade de 8 horas)
- CRUD completo de projetos
- CRUD completo de tarefas (título, descrição, status, prioridade, data de vencimento, projeto)
- Histórico de alterações por tarefa — registra campo alterado, valor anterior e novo valor
- Filtro de tarefas por projeto
- Rotas protegidas por guard no frontend

## Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) e npm
- [Angular CLI 17](https://angular.io/cli): `npm install -g @angular/cli`

## Como executar

### Backend

```bash
cd backend/ProjetoTarefas
dotnet run
```

A API sobe em `http://localhost:5000`.  
O banco SQLite (`projetotarefas.db`) é criado automaticamente na primeira execução.  
Documentação Swagger disponível em `http://localhost:5000/swagger`.

### Frontend

```bash
cd frontend
npm install
npm start
```

O app Angular sobe em `http://localhost:4200`.

## Endpoints da API

| Método | Rota                        | Descrição                          | Auth |
|--------|-----------------------------|------------------------------------|------|
| POST   | /api/auth/register          | Cadastro de usuário                | Não  |
| POST   | /api/auth/login             | Login, retorna token JWT           | Não  |
| GET    | /api/projects               | Lista todos os projetos            | Sim  |
| GET    | /api/projects/{id}          | Busca projeto por ID               | Sim  |
| POST   | /api/projects               | Cria projeto                       | Sim  |
| PUT    | /api/projects/{id}          | Atualiza projeto                   | Sim  |
| DELETE | /api/projects/{id}          | Remove projeto                     | Sim  |
| GET    | /api/tasks                  | Lista tarefas (filtro: ?projectId) | Sim  |
| GET    | /api/tasks/{id}             | Busca tarefa por ID                | Sim  |
| GET    | /api/tasks/{id}/history     | Histórico de alterações da tarefa  | Sim  |
| POST   | /api/tasks                  | Cria tarefa                        | Sim  |
| PUT    | /api/tasks/{id}             | Atualiza tarefa                    | Sim  |
| DELETE | /api/tasks/{id}             | Remove tarefa                      | Sim  |

## Modelos

**Tarefa (TaskItem)**
- `Title` (obrigatório, máx. 200 caracteres)
- `Description` (máx. 1000 caracteres)
- `Status`: `Pending` | `InProgress` | `Done`
- `Priority`: `Low` | `Medium` | `High`
- `DueDate` (opcional)
- `ProjectId`

## Configuração

As configurações do backend ficam em `backend/ProjetoTarefas/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=projetotarefas.db"
  },
  "Jwt": {
    "SecretKey": "sua-chave-secreta-com-32-caracteres-ou-mais",
    "Issuer": "ProjetoTarefasAPI",
    "Audience": "ProjetoTarefasClient",
    "ExpirationHours": 8
  }
}
```

> **Atenção:** em produção, substitua o `SecretKey` por uma chave segura e nunca versione segredos reais no repositório.
