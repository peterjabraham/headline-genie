"use client";

import { useSession } from "next-auth/react";
import SignInButton from './components/SignInButton';
import AdMaker from '@/src/app/AdMaker';  // Use @ alias for better imports

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdMaker />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <p className="text-lg text-gray-600">Welcome to</p>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">Headline Genie</h1>
          <p className="mt-4 text-lg text-gray-600">"Your Ad Copy wish is my command"</p>
        </div>
        <SignInButton />
      </div>
    </main>
  );
}
