# OAuth Setup Guide with Next.js, NextAuth, and Firebase

## Tech Stack
- Next.js 13.5.7 (App Router)
- NextAuth.js 4.24.5
- Firebase 10.7.0
- Firebase Admin 11.11.0
- TypeScript 5.6.3

## Prerequisites
1. Node.js installed
2. Google Cloud account
3. Firebase account
4. Git installed


## Initial Setup

### 1. Create Next.js Project


bash
npx create-next-app@latest your-project-name
cd your-project-name

### 2. Install Dependencies
bash
npm install next-auth@4.24.5 @next-auth/firebase-adapter@2.0.1 firebase@10.7.0 firebase-admin@11.11.0


## Google Cloud Setup

### 1. Create New Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "New Project"
3. Enter project name and create

### 2. Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name
   - User support email
   - Developer contact information
4. Add scopes:
   - .../auth/userinfo.email
   - .../auth/userinfo.profile
   - openid
5. Add test users (your email)

### 3. Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   ```
   http://localhost:3000
   ```
5. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Save your Client ID and Client Secret

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project (link to your Google Cloud project)
3. Enable Authentication with Google provider

### 2. Get Firebase Admin Credentials
1. Go to Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file securely

## Project Configuration

### 1. Environment Variables
Create `.env.local`:

env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
Firebase Admin
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-client-email"
FIREBASE_PRIVATE_KEY="your-private-key"


### 2. NextAuth Configuration
Create required files:
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/auth/[...nextauth]/auth-options.ts`
- `lib/firebase-admin.ts`
- `lib/firebase.ts`

## Security Considerations

### 1. Git Security
Add to `.gitignore`:

.env.local
.env
/firebase-adminsdk.json
/service-account.json


### 2. Environment Variables
- Never commit sensitive credentials
- Use different credentials for development and production
- Rotate secrets periodically

## Production Deployment

### 1. Update OAuth Settings
1. Add production URLs to Google Cloud OAuth credentials
2. Update Firebase configuration
3. Set up production environment variables

### 2. Firebase Security Rules
1. Configure Firestore security rules
2. Set up proper authentication rules

## Testing

1. Run development server:

bash
npm run dev

2. Visit `http://localhost:3000`
3. Test authentication flow
4. Verify user data in Firebase

## Troubleshooting

Common issues:
1. Invalid OAuth credentials
   - Verify Client ID and Secret
   - Check redirect URIs
2. Firebase connection issues
   - Verify private key format
   - Check project configuration
3. NextAuth errors
   - Verify environment variables
   - Check adapter configuration

## Resources
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Cloud OAuth Guide](https://cloud.google.com/docs/authentication)


This guide provides a comprehensive overview of setting up OAuth with Next.js, NextAuth, and Firebase. You can customize it further based on your specific needs or add more detailed sections as required.
