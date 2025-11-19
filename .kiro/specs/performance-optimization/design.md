# Design Document

## Overview

This design addresses two primary issues:
1. **Turbopack lockfile warning** - Caused by a yarn.lock file in node_modules/uri-js that conflicts with the root package-lock.json
2. **Slow routing performance** - Caused by redundant authentication checks in the layout component and lack of proper caching

The solution involves configuring turbopack to handle multiple lockfiles, removing redundant authentication checks from layouts, and implementing proper caching strategies.

## Architecture

### Current Issues

1. **Lockfile Conflict**: The turbopack warning occurs because:
   - Root uses npm (package-lock.json)
   - A dependency (uri-js) has its own yarn.lock in node_modules
   - Turbopack detects both and warns about potential inconsistencies

2. **Authentication Performance**: The slow routing is caused by:
   - Every route navigation triggers `getAuth()` and `getSession()` in the root layout
   - Database connection is established on every navigation
   - No caching of authentication state
   - Middleware already checks for session cookie, making layout checks redundant

### Proposed Solution

The solution uses a multi-pronged approach:

1. **Fix Turbopack Warning**:
   - Configure turbopack.root in next.config.ts to specify the workspace root
   - This tells turbopack to only consider the root lockfile

2. **Optimize Authentication Flow**:
   - Remove redundant authentication checks from the root layout
   - Rely on middleware for route protection (already implemented)
   - Pass user data through a more efficient mechanism
   - Implement proper caching for auth instance

3. **Performance Optimizations**:
   - Add dynamic rendering configuration where appropriate
   - Optimize font loading strategy
   - Implement proper error boundaries

## Components and Interfaces

### 1. Next.js Configuration (next.config.ts)

```typescript
interface NextConfig {
  turbopack?: {
    root?: string;
  };
  eslint: {
    ignoreDuringBuilds: boolean;
  };
  typescript: {
    ignoreBuildErrors: boolean;
  };
}
```

**Changes**:
- Add `turbopack.root` configuration to specify workspace root
- This resolves the multiple lockfile warning

### 2. Root Layout (app/(root)/layout.tsx)

**Current Flow**:
```
Request → Layout → getAuth() → DB Connection → getSession() → Render
```

**Optimized Flow**:
```
Request → Middleware (checks cookie) → Layout → Render with cached user
```

**Changes**:
- Remove `getAuth()` and `getSession()` calls from layout
- Use a server action or API route to fetch user data only when needed
- Implement proper loading states
- Add error boundaries

### 3. Authentication Module (lib/better-auth/auth.ts)

**Current Issues**:
- Creates new auth instance on every call if authInstance is null
- Database connection happens on every auth check

**Optimizations**:
- Ensure singleton pattern is properly implemented
- Add connection pooling awareness
- Implement proper error handling

### 4. Middleware (app/middleware/index.ts)

**Current State**: Already efficiently checks session cookie

**Enhancement**: Add proper redirect logic for authenticated users trying to access auth pages

## Data Models

No new data models required. Existing models remain unchanged:

- User session data (from better-auth)
- User profile data (id, name, email)

## Error Handling

### Turbopack Configuration Errors

```typescript
// If turbopack.root is misconfigured
Error: "Invalid turbopack root path"
Solution: Ensure path points to workspace root
```

### Authentication Errors

```typescript
// If session cannot be retrieved
Error: "Session not found"
Action: Middleware redirects to /sign-in
```

### Database Connection Errors

```typescript
// If MongoDB connection fails
Error: "MongoDB connection not found"
Action: Return error boundary with retry option
```

## Testing Strategy

### 1. Turbopack Configuration Testing

**Manual Testing**:
- Start dev server with `npm run dev`
- Verify no lockfile warnings appear
- Check that hot reload works correctly

**Validation**:
```bash
# Should show no turbopack warnings
npm run dev 2>&1 | grep -i "lockfile"
```

### 2. Route Navigation Performance Testing

**Manual Testing**:
- Navigate between different routes
- Measure time using browser DevTools Performance tab
- Target: < 500ms for cached routes

**Metrics to Track**:
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Layout shift during navigation

### 3. Authentication Flow Testing

**Test Cases**:
1. Unauthenticated user accessing protected route → Redirect to /sign-in
2. Authenticated user navigating between protected routes → Fast navigation
3. Authenticated user accessing auth pages → Redirect to dashboard
4. Session expiry during navigation → Graceful redirect

### 4. Regression Testing

**Verify**:
- Authentication still works correctly
- Protected routes remain protected
- User data displays correctly in Header
- No broken functionality after optimization

## Performance Targets

### Before Optimization
- Route navigation: 2-5 seconds
- Multiple database connections per navigation
- Turbopack warnings on every dev server start

### After Optimization
- Route navigation: < 500ms for cached routes
- Single database connection (pooled)
- No turbopack warnings
- Improved developer experience

## Implementation Considerations

### 1. Backward Compatibility
- Ensure existing authentication flow continues to work
- No breaking changes to user experience
- Maintain security posture

### 2. Caching Strategy
- Use Next.js built-in caching mechanisms
- Implement proper cache invalidation
- Consider using React Server Components caching

### 3. Monitoring
- Add performance monitoring for route transitions
- Track authentication check duration
- Monitor database connection pool usage

### 4. Rollback Plan
- Keep backup of original files
- Test thoroughly in development
- Deploy incrementally if possible
