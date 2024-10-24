"use client";

import { useSession } from "next-auth/react";
import SignOutButton from "./SignOutButton";

export default function Navbar() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <div className="text-left">
              <h1 className="text-2xl font-bold text-blue-600">Headline Genie</h1>
              <p className="text-sm text-gray-600">"Your Ad Copy wish is my command"</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {session.user?.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
