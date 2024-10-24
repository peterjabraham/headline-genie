# Headline Genie

Headline Genie is a Next.js application that generates ad headlines using OpenAI's API. It allows users to save and view liked headlines, both individually and across all users.

## Features

- **Ad Generation**: Generate ad headlines based on user input and CSV uploads.
- **User Authentication**: Secure login with Google using NextAuth.js.
- **Liked Headlines**: Save and view liked headlines, both personal and global.
- **Responsive Design**: Built with Tailwind CSS for a responsive and modern UI.

## Setup

### Prerequisites

- Node.js v18.17.0 or higher
- npm v9.6.7 or higher
- Firebase account with Firestore enabled
- Google Cloud account for OAuth credentials

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/headline-genie.git
   cd headline-genie
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-generated-secret"
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-domain"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-bucket"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
   FIREBASE_PROJECT_ID="your-project-id"
   FIREBASE_CLIENT_EMAIL="your-client-email"
   FIREBASE_PRIVATE_KEY="your-private-key"
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Deployment

### Replit

1. Set up your `.replit` file:

   ```text
   run = "npm run build && npm run start"
   ```

2. Use Replit's secrets management to securely store environment variables.

3. Monitor your deployment using Replit's built-in tools.

### Production Notes

- **Environment Variables**: Ensure all sensitive information is stored securely and not hardcoded.
- **Performance**: Consider using a CDN for static assets and enabling caching for improved performance.
- **Security**: Regularly update dependencies and review security settings in Firebase and Google Cloud.
- **Monitoring**: Set up monitoring and logging to track app performance and errors.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
