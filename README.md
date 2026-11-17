# WorkoutTracker.AdminClient

Internal admin console for WorkoutTracker — React 19, MUI 7, Vite, TypeScript. Web only, no
mobile build. It talks to the same [WorkoutTracker.Server](https://github.com/jbaca0/WorkoutTracker.Server)
API as the mobile app and sits entirely behind the server's `AdminOnly` policy, so a non-admin
account cannot load anything here even with valid credentials.

## Pages

| Page | What it does |
| --- | --- |
| `LoginPage` | Email/password login against `POST /auth/login` |
| `UsersPage` | List users, create and delete accounts, assign and remove Identity roles |
| `ExerciseInfosPage` | CRUD for the shared exercise catalog the clients read from |
| `LogsPage` | Browse the request and application logs the server writes to the database |
| `HomePage` | Landing page — dashboard not built yet |

## Architecture

The same layering as the other clients, so moving between them costs nothing:

| Layer | Location | Responsibility |
| --- | --- | --- |
| Pages | `src/Pages/<Name>/` | Route components |
| Components | `src/Components/` | `AppLayout` shell and `ProtectedRoute` guard |
| Services | `src/Services/` | API access, each extending `BaseService` |
| Domain | `src/Domain/` | Models with `FromData` / `ToData` conversions |
| DTOs | `src/DataTransferObjects/{Common,Requests,Responses}/` | Wire contracts mirroring the server |
| Hooks | `src/Hooks/` | `useAuth`, `useLocalStorage` |

`BaseService` attaches the access token, and on a `401` refreshes once against `POST /auth/refresh`
and retries. `ProtectedRoute` keeps unauthenticated users on the login page.

## Running locally

```bash
npm install
npm run dev
```

The dev server runs over HTTPS on port 5174. The certificate files are gitignored, so generate
them once with [mkcert](https://github.com/FiloSottile/mkcert):

```bash
mkcert localhost 127.0.0.1 ::1
```

That writes `localhost+2.pem` and `localhost+2-key.pem` into the project root, which is where
`vite.config.ts` expects them.

### Configuration

| Variable | Purpose |
| --- | --- |
| `VITE_SERVER_URL` | API base URL. **Required** — there is no fallback. |

`.env` is tracked and points at the deployed server; `.env.development` points at
`https://localhost:7083`. Machine-local overrides go in `.env.local`, which is gitignored.
Never put a credential in `.env`.

## Deployment

Pushing to `main` builds and deploys to Azure Static Web Apps via
`.github/workflows/azure-static-web-apps-victorious-smoke-09e74db1e.yml`. Pull requests get a
preview environment, torn down when the PR closes.

## Tests

No front-end suite here yet. The admin endpoints this app consumes are covered by xUnit tests in
`WorkoutTracker.Server` (`AdminHandlerTests`, `LogHandlerTests`).
