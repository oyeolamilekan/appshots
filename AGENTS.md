# Amaris - Frontend Application Guide

## Project Overview

**Amaris** is a modern React-based web application with JWT-based authentication and a clean, component-driven architecture.

## Tech Stack

- **Frontend**: React 19, TanStack Router, TailwindCSS 4, shadcn/ui
- **Forms**: TanStack Form with Zod validation
- **State Management**: TanStack Query
- **Authentication**: JWT tokens

## Project Structure

```
amaris/
├── frontend/                   # React application
│   ├── src/
│   │   ├── routes/            # TanStack Router pages
│   │   │   ├── index.tsx      # Home page
│   │   │   ├── login.tsx      # Auth page
│   │   │   └── dashboard.tsx  # Protected dashboard
│   │   ├── components/        # React components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── header.tsx
│   │   │   ├── sign-in-form.tsx
│   │   │   ├── sign-up-form.tsx
│   │   │   └── user-menu.tsx
│   │   ├── lib/
│   │   │   ├── api-client.ts  # Axios/Fetch API client
│   │   │   ├── auth.ts        # Auth utilities
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   │   └── use-auth.ts    # Auth hook
│   │   ├── App.tsx            # App root with router
│   │   └── index.css          # Global styles
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Architecture Components

### Frontend Application

**Technology**: React 19 + TanStack Router + TailwindCSS 4

**Key Files**:
- `App.tsx`: Main app with TanStack Router configuration
- `routes/index.tsx`: Landing page
- `routes/login.tsx`: Authentication page (switches between sign-in/sign-up)
- `routes/dashboard.tsx`: Protected route showing user info
- `lib/api-client.ts`: Axios instance with JWT token handling
- `lib/auth.ts`: Auth utilities (getToken, setToken, removeToken)
- `hooks/use-auth.ts`: Custom hook for authentication state

**Features**:
- Dark mode support via `next-themes`
- Toast notifications with Sonner
- Form handling with TanStack Form + Zod validation
- Protected routes with JWT verification
- Axios interceptors for token attachment and refresh

**Environment Variables**:
```env
VITE_API_URL=http://localhost:3000
```

## Common Tasks

### Adding a New UI Component

```bash
cd frontend
# Use shadcn/ui CLI to add components
bunx shadcn@latest add [component-name]
```

### Adding New Frontend Routes

1. Create route file in `frontend/src/routes/`
2. Configure in TanStack Router
3. Add to navigation in header
4. Implement API calls with `api-client.ts`

## Data Flow

### Authentication Flow

1. **Sign Up**:
   ```
   User fills form → TanStack Form validates → POST /api/v1/auth/signup
   → Token stored in localStorage → Redirect to dashboard
   ```

2. **Sign In**:
   ```
   User fills form → TanStack Form validates → POST /api/v1/auth/signin
   → Token stored in localStorage → Redirect to dashboard
   ```

3. **Authenticated Requests**:
   ```
   API request → Axios interceptor adds Authorization header
   → Request processed with JWT validation
   ```

4. **Session Check**:
   ```
   useAuth() hook → GET /api/v1/auth/me (with JWT in header)
   → If valid: show content → If invalid: redirect to /login
   ```

## Development Workflow

### Setup Frontend

1. **Install dependencies**:
   ```bash
   cd frontend
   bun install
   ```

2. **Configure environment**:
   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. **Start development server**:
   ```bash
   bun run dev
   ```

### Testing

```bash
# Frontend
bun test            # Run frontend tests
```

## Key Design Patterns

### 1. Component-Driven Architecture
- Reusable UI components with shadcn/ui
- Composition over inheritance
- Props validation with TypeScript

### 2. Protected Routes
- TanStack Router route guards
- JWT validation before rendering
- Automatic redirect to login

### 3. API Client Pattern
- Centralized Axios instance
- Request/response interceptors
- Automatic token management
- Error handling middleware

### 4. Form Management
- TanStack Form for state management
- Zod for schema validation
- Type-safe form handling

## Security Considerations

1. **Authentication**:
   - JWT tokens with expiration (24 hours default)
   - Secure token storage (httpOnly cookies recommended for production)
   - Automatic token refresh

2. **Environment Variables**:
   - Never commit `.env` files
   - Different configurations for dev/staging/production

3. **XSS Protection**:
   - React's built-in XSS protection
   - Sanitize user inputs
   - Validate all form data

## Extension Points

### Adding New API Calls

1. **Define API function in `api-client.ts`**:
   ```typescript
   export const getPosts = async () => {
     const response = await apiClient.get('/api/v1/posts');
     return response.data;
   };
   ```

2. **Use with TanStack Query**:
   ```typescript
   const { data, isLoading } = useQuery({
     queryKey: ['posts'],
     queryFn: getPosts
   });
   ```

### Creating Custom Hooks

```typescript
// hooks/use-posts.ts
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/posts');
      return response.data;
    }
  });
};
```

## Troubleshooting

### CORS Issues
- Verify API URL in `.env` matches API origin
- Clear browser cache and cookies
- Check browser console for specific CORS errors

### JWT Authentication
- Check token expiration (default 24 hours)
- Ensure Authorization header format: `Bearer <token>`
- Inspect token payload with jwt.io
- Verify token is stored in localStorage

### API Connection
- Verify `VITE_API_URL` is correct
- Check network tab for failed requests
- Ensure API is running and accessible

## Agent Guidelines

When working on this codebase:

1. **Follow React best practices**: Use functional components and hooks
2. **Type safety**: Use TypeScript for all components and utilities
3. **Component structure**: Keep components small and focused
4. **State management**: Use TanStack Query for server state, useState for local state
5. **Form handling**: Use TanStack Form with Zod validation
6. **Styling**: Use Tailwind utility classes, avoid custom CSS when possible
7. **Accessibility**: Ensure all interactive elements are keyboard accessible
8. **Error handling**: Always handle loading and error states in components
9. **Testing**: Write tests for critical user flows
10. **Code organization**: Group related files together
11. **API integration**: Use the centralized API client
12. **Security**: Never store sensitive data in localStorage (except JWT tokens)
13. **Performance**: Lazy load routes and heavy components
14. **Documentation**: Document complex logic and props interfaces

## Resources

- [React Documentation](https://react.dev)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Form](https://tanstack.com/form)
- [TailwindCSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Zod](https://zod.dev)
- [JWT.io](https://jwt.io)

---

**Last Updated**: January 2025  
**Version**: 3.1.0  
**Maintainer**: Amaris Team
