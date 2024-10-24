"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            Welcome to My App
          </h1>
          {session ? (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <img 
                src={session.user?.image || '/default-avatar.png'} 
                alt="Profile" 
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <p className="text-xl text-gray-700 mb-2">
                Welcome back, {session.user?.name}!
              </p>
              <p className="text-gray-500 mb-6">
                {session.user?.email}
              </p>
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xl text-gray-700 mb-6">
                Please sign in to access your account
              </p>
              <Link href="/signin">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
