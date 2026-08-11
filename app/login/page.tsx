import AuthForm from '@/components/AuthForm';
import DecryptedText from '@/components/DecryptedText';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex font-sans overflow-hidden">
      
      {/* Left Pane - Visual/Brand Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-white/10 bg-zinc-950">
        {/* Animated Mesh/Aurora Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute -top-[20%] -left-[20%] w-[100%] h-[100%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(232,112,42,0.25)_0%,transparent_60%)] blur-[100px]" />
          <div className="absolute top-[40%] -right-[30%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,transparent_60%)] blur-[120px]" />
          <div className="absolute -bottom-[20%] left-[10%] w-[90%] h-[90%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.1)_0%,transparent_60%)] blur-[100px]" />
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
        </div>

        {/* Top Left: Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3 group">
          <svg 
            width="26" 
            height="26" 
            viewBox="0 0 256 256" 
            fill="#ffffff" 
            xmlns="http://www.w3.org/2000/svg"
            className="group-hover:scale-105 transition-transform"
          >
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="text-white text-2xl font-playfair italic pr-2">Orion</span>
        </Link>

        {/* Bottom Left: Brand Messaging */}
        <div className="relative z-10 max-w-md">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
            <span className="text-xs font-mono font-medium tracking-widest uppercase text-white/80">
              <DecryptedText text="v2.0 Beta Live" animateOn="view" speed={100} />
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight font-playfair">
            The future of temporal simulation is here.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Join the most advanced platform for chronological data modeling, forecasting, and anomaly detection.
          </p>
        </div>
      </div>

      {/* Right Pane - Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative p-6 sm:p-12 lg:p-24 bg-black">
        
        {/* Mobile Header (Only visible on small screens) */}
        <Link href="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-3 group">
          <svg 
            width="26" 
            height="26" 
            viewBox="0 0 256 256" 
            fill="#ffffff" 
            xmlns="http://www.w3.org/2000/svg"
            className="group-hover:scale-105 transition-transform"
          >
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="text-white text-2xl font-playfair italic pr-2">Orion</span>
        </Link>

        {/* Back to home link */}
        <Link 
          href="/" 
          className="absolute top-8 right-8 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>

        {/* Form Container */}
        <div className="w-full max-w-sm mx-auto flex flex-col">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Welcome back
            </h2>
            <p className="text-zinc-400">
              Enter your credentials to access your workspace.
            </p>
          </div>

          <AuthForm />

          <p className="mt-10 text-center text-sm text-zinc-500">
            By continuing, you agree to Orion's <br className="hidden sm:block"/>
            <Link href="#" className="text-white hover:underline underline-offset-4">Terms of Service</Link> and <Link href="#" className="text-white hover:underline underline-offset-4">Privacy Policy</Link>.
          </p>
        </div>

      </div>

    </div>
  );
}
