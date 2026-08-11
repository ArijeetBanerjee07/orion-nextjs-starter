"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" fill="currentColor"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const loginWithProvider = async (provider: string) => {
    setIsLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(null); // Reset if it failed
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-4 w-full">
        <button
          disabled={isLoading !== null}
          onClick={() => loginWithProvider("google")}
          className="w-full h-12 bg-zinc-900 border border-white/10 hover:border-white/20 hover:bg-zinc-800 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading === "google" ? <Loader2 className="w-5 h-5 animate-spin" /> : <div className="group-hover:scale-110 transition-transform"><GoogleIcon /></div>}
          Continue with Google
        </button>

        <button
          disabled={isLoading !== null}
          onClick={() => loginWithProvider("github")}
          className="w-full h-12 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading === "github" ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : <div className="group-hover:scale-110 transition-transform"><GithubIcon /></div>}
          Continue with GitHub
        </button>
      </div>

      <div className="flex items-center gap-4 py-4">
        <div className="flex-1 h-[1px] bg-white/10"></div>
        <span className="text-xs uppercase font-semibold tracking-widest text-zinc-500">
          Or Continue With
        </span>
        <div className="flex-1 h-[1px] bg-white/10"></div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-400">
            Email Address
          </label>
          <input
            disabled
            type="email"
            placeholder="name@example.com"
            className="w-full h-12 bg-zinc-900/50 border border-white/10 rounded-lg px-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <button
          disabled
          className="w-full h-12 bg-zinc-900 border border-white/10 text-zinc-500 font-medium rounded-lg flex items-center justify-center cursor-not-allowed"
        >
          Magic Link Login (Coming soon)
        </button>
      </div>
    </div>
  );
}
