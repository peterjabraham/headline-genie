import ClientProvider from "./components/ClientProvider";
import Navbar from "./components/Navbar";
import { Suspense } from "react";
import './globals.css';  // Add this import

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientProvider>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }>
            <Navbar />
            {children}
          </Suspense>
        </ClientProvider>
      </body>
    </html>
  );
}
