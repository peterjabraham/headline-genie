"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function SignInButton() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <button
      className="flex items-center justify-center w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
      onClick={handleSignIn}
      disabled={loading}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          <span className="ml-2">Signing in...</span>
        </>
      ) : (
        <>
          <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
          Sign in with Google
        </>
      )}
    </button>
  );
}