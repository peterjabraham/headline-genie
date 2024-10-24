# Integrating OAuth with Next.js and Firebase

# Be mindful of the setup of the project you're integrating with, the components and versions may be different and we want to avoid anything not working as expected.

## Required Files
1. **API Routes**
   ```
   app/api/auth/[...nextauth]/
   ├── route.ts
   └── auth-options.ts
   ```

2. **Firebase Configuration**
   ```
   lib/
   ├── firebase.ts
   └── firebase-admin.ts
   ```

3. **Components**
   ```
   app/components/
   ├── ClientProvider.tsx
   ├── SignInButton.tsx
   └── LoadingSpinner.tsx
   ```

4. **Pages**
   ```
   app/
   ├── signin/
   │   └── page.tsx
   └── layout.tsx (update existing)
   ```

## Required Dependencies
Add to your `package.json`:

## adding this OAuth setup to an existing project:
json
{
"dependencies": {
"@next-auth/firebase-adapter": "^2.0.1",
"firebase": "^10.7.0",
"firebase-admin": "^11.11.0",
"next-auth": "^4.24.5"
}
}


## Environment Variables
Add to your `.env.local`:

env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="your-id"
GOOGLE_CLIENT_SECRET="your-secret"
NEXT_PUBLIC_FIREBASE_API_KEY="your-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-email"
FIREBASE_PRIVATE_KEY="your-key"


## Required Updates

### 1. Layout Update
Wrap your app with `ClientProvider` in `app/layout.tsx`:

tsx
import ClientProvider from "./components/ClientProvider";
export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html>
<body>
<ClientProvider>
{children}
</ClientProvider>
</body>
</html>
);
}


### 2. Using Authentication in Components

tsx
"use client";
import { useSession } from "next-auth/react";
export default function YourComponent() {
const { data: session } = useSession();
if (session) {
// User is authenticated
return <div>Welcome {session.user?.name}</div>;
}
// User is not authenticated
return <div>Please sign in</div>;
}


### 3. Protected Routes
Create a middleware file for protected routes:


:
typescript:middleware.ts
export { default } from "next-auth/middleware";
export const config = {
matcher: ["/protected/:path"]
};


## Common Issues and Solutions

### 1. Invalid Client Error
**Issue**: "invalid_client" error during sign-in
**Solution**: 
- Verify Google OAuth credentials
- Check authorized redirect URIs
- Ensure credentials match between Google Cloud and .env file

### 2. Firebase Connection Issues
**Issue**: Firebase adapter fails to connect
**Solution**:
- Check FIREBASE_PRIVATE_KEY format (should have \n characters)
- Verify Firebase Admin SDK initialization
- Ensure Firestore is enabled in Firebase Console

### 3. Session Not Persisting
**Issue**: User session not maintained after refresh
**Solution**:
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Ensure ClientProvider is at root level

### 4. CORS Issues
**Issue**: Cross-Origin Resource Sharing errors
**Solution**:
- Add your domain to authorized origins in Google Cloud Console
- Update Firebase security rules
- Check NEXTAUTH_URL matches your domain exactly

### 5. Type Errors
**Issue**: TypeScript errors with session types
**Solution**:

typescript
// Add to your next-auth.d.ts
import "next-auth/jwt";
declare module "next-auth/jwt" {
interface JWT {
// Add custom fields
}
}
declare module "next-auth" {
interface Session {
// Add custom fields
}
}


### 6. Production Deployment
**Issue**: Works locally but fails in production
**Solution**:
- Update environment variables in production
- Add production URLs to Google OAuth console
- Configure Firebase security rules for production

### 7. Next.js 13+ App Router Issues
**Issue**: Components using useSession fail to render
**Solution**:
- Mark components using auth hooks as "use client"
- Ensure proper provider wrapping in layout
- Use proper loading states with Suspense

## Best Practices
1. Always use environment variables
2. Implement proper error handling
3. Add loading states for authentication
4. Use TypeScript for better type safety
5. Implement proper security measures
6. Test authentication flow thoroughly

## Testing Checklist
- [ ] Sign in flow works
- [ ] Sign out flow works
- [ ] Protected routes are secure
- [ ] Session persistence works
- [ ] Error handling works
- [ ] Loading states show correctly

## This guide should help developers integrate the OAuth functionality into their existing Next.js projects while avoiding common pitfalls.