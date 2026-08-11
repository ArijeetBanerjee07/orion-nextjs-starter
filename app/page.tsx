'use client';

import Image from 'next/image';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TargetCursor from '@/components/TargetCursor';
import DecryptedText from '@/components/DecryptedText';
import DarkVeil from '@/components/DarkVeil';
import FuzzyText from '@/components/FuzzyText';
import { Layers, Zap, Shield, ChevronRight, Globe, MessageSquare, Mail, Lock, Activity } from 'lucide-react';
import LogoLoop from '@/components/LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

export default function Home() {
   return (
      <main className="w-full bg-black text-white relative font-sans overflow-x-hidden">
         <TargetCursor
            spinDuration={2}
            hideDefaultCursor={true}
            parallaxOn={true}
            cursorColorOnTarget="#e8702a"
         />
         <Header />

         {/* 1. PRIMARY HERO */}
         <Hero />

         {/* TECHNOLOGY PARTNERS LOOP */}
         <section className="w-full py-10 bg-black border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-8">
               <div className="text-center mb-8">
                  <p className="font-mono text-sm tracking-widest text-[#e8702a] uppercase">Trusted by forward-thinking teams using</p>
               </div>
               <div style={{ height: '60px', position: 'relative', overflow: 'hidden' }}>
                  <LogoLoop
                     logos={techLogos}
                     speed={40}
                     direction="left"
                     logoHeight={40}
                     gap={60}
                     hoverSpeed={0}
                     scaleOnHover
                     fadeOut
                     fadeOutColor="#000000"
                     ariaLabel="Technology partners"
                     className="text-white/50 hover:text-white transition-colors"
                  />
               </div>
            </div>
         </section>

         {/* 2. FEATURES SECTION */}
         <section id="features" className="w-full py-32 px-8 bg-black border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto">
               <div className="mb-20 text-center md:text-left">
                  <h3 className="text-[#e8702a] font-mono text-sm tracking-widest mb-4 uppercase hero-anim hero-fade">
                     <DecryptedText text="[ Capabilities ]" animateOn="view" />
                  </h3>
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                     <span className="block hero-anim hero-reveal" style={{ animationDelay: '0.1s' }}>
                        <DecryptedText text="ENGINEERED FOR " animateOn="view" />
                     </span>
                     <span className="block -mt-1 hero-anim hero-reveal" style={{ animationDelay: '0.3s' }}>
                        <DecryptedText className="text-gray-500 italic font-playfair font-light" text="extreme" animateOn="view" initialDelay={300} />
                        <DecryptedText text=" VELOCITY." animateOn="view" initialDelay={440} />
                     </span>
                  </h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
                  {[
                     {
                        icon: <Layers className="w-8 h-8 text-[#e8702a] mb-6 group-hover:scale-110 transition-transform duration-500" />,
                        title: "Natural Language to Code",
                        desc: "Write what you want to build in plain English. Orion translates your intent into production-ready syntax instantly, bypassing traditional development bottlenecks.",
                        className: "md:col-span-2 md:row-span-1"
                     },
                     {
                        icon: <Zap className="w-8 h-8 text-[#e8702a] mb-6 group-hover:scale-110 transition-transform duration-500" />,
                        title: "Autonomous Deployment",
                        desc: "From initial prompt to a fully deployed SaaS application in seconds. We handle the entire CI/CD pipeline.",
                        className: "md:col-span-1 md:row-span-2"
                     },
                     {
                        icon: <Shield className="w-8 h-8 text-[#e8702a] mb-6 group-hover:scale-110 transition-transform duration-500" />,
                        title: "Full Architecture",
                        desc: "Generates frontend, backend, databases, and APIs seamlessly. Your complete infrastructure, securely built and scaled.",
                        className: "md:col-span-1 md:row-span-1"
                     },
                     {
                        icon: <Activity className="w-8 h-8 text-[#e8702a] mb-6 group-hover:scale-110 transition-transform duration-500" />,
                        title: "AI Auto-Healing",
                        desc: "Intelligently detects anomalies and automatically resolves runtime errors before they impact your users.",
                        className: "md:col-span-1 md:row-span-1"
                     },
                     {
                        icon: <Lock className="w-8 h-8 text-[#e8702a] mb-6 group-hover:scale-110 transition-transform duration-500" />,
                        title: "Zero-Trust Security",
                        desc: "Enterprise-grade security built directly into the generated architecture. Every endpoint, database, and API is secured by default.",
                        className: "md:col-span-3 md:row-span-1"
                     }
                  ].map((feature, idx) => (
                     <div key={idx} className={`relative overflow-hidden p-10 rounded-3xl bg-[#050505] border border-white/5 hover:border-[#e8702a]/30 transition-all duration-500 group cursor-target hero-anim hero-fade ${feature.className}`} style={{ animationDelay: `${0.4 + idx * 0.15}s` }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#e8702a]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#e8702a]/20 blur-[80px] rounded-full group-hover:bg-[#e8702a]/40 transition-colors duration-700 pointer-events-none" />
                        <div className="relative z-10 h-full flex flex-col">
                           {feature.icon}
                           <div className="mb-4 mt-auto -ml-[55px]">
                              <FuzzyText enableScrollFuzz baseIntensity={0} hoverIntensity={0.8} fontSize={24} fontWeight="bold">
                                 {feature.title}
                              </FuzzyText>
                           </div>
                           <p className="text-gray-400 leading-relaxed font-mono text-sm md:text-base max-w-md">{feature.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* 3. TESTIMONIALS SECTION */}
         <section id="testimonials" className="w-full py-32 px-8 bg-black relative z-10 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(232,112,42,0.08)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(232,112,42,0.04)_0%,transparent_50%)] pointer-events-none translate-x-1/3 -translate-y-1/3" />

            <div className="max-w-7xl mx-auto relative z-10">
               <div className="flex flex-col items-center justify-center mb-20 text-center">
                  <h3 className="text-[#e8702a] font-mono text-sm tracking-widest uppercase mb-4">
                     <FuzzyText enableScrollFuzz baseIntensity={0} hoverIntensity={0.5} fontSize={14} color="#e8702a">
                        [ Evidence ]
                     </FuzzyText>
                  </h3>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                     Trusted by Visionaries
                  </h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto relative">
                  {/* Decorative connecting line (desktop only) */}
                  <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#e8702a]/20 to-transparent pointer-events-none" />
                  
                  {/* Card 1 */}
                  <div className="relative p-12 rounded-3xl bg-[#080808]/80 border border-white/5 backdrop-blur-xl hover:border-[#e8702a]/40 transition-colors duration-500 group shadow-[0_0_40px_rgba(0,0,0,0.5)] cursor-target">
                     <div className="absolute top-8 left-8 text-[#e8702a]/10 font-serif text-8xl leading-none pointer-events-none">"</div>
                     <div className="relative z-10">
                        <p className="text-xl md:text-2xl text-gray-300 italic mb-10 font-light leading-relaxed">&ldquo;Orion built our entire SaaS MVP from a single prompt in 45 seconds. What used to take our engineering team three months is now instantaneous.&rdquo;</p>
                        <div className="flex items-center gap-5">
                           <div className="relative">
                              <div className="absolute inset-0 rounded-full bg-[#e8702a] blur-[10px] opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                              <img src="/testimonial1.jpg" alt="Sarah Jenkins" className="relative w-14 h-14 rounded-full object-cover border-2 border-white/10 group-hover:border-[#e8702a]/50 transition-colors duration-500" />
                           </div>
                           <div>
                              <div className="font-bold text-white text-lg tracking-tight">Sarah Jenkins</div>
                              <div className="text-sm font-mono text-[#e8702a]/80 uppercase tracking-wider mt-1">CTO, NeuralCorp</div>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Card 2 */}
                  <div className="relative p-12 rounded-3xl bg-[#080808]/80 border border-white/5 backdrop-blur-xl hover:border-[#e8702a]/40 transition-colors duration-500 group shadow-[0_0_40px_rgba(0,0,0,0.5)] translate-y-0 md:translate-y-16 cursor-target">
                     <div className="absolute top-8 left-8 text-[#e8702a]/10 font-serif text-8xl leading-none pointer-events-none">"</div>
                     <div className="relative z-10">
                        <p className="text-xl md:text-2xl text-gray-300 italic mb-10 font-light leading-relaxed">&ldquo;The architectural decisions the agent made were flawless. We went from ideation to a fully deployed application with zero technical debt.&rdquo;</p>
                        <div className="flex items-center gap-5">
                           <div className="relative">
                              <div className="absolute inset-0 rounded-full bg-[#e8702a] blur-[10px] opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                              <img src="/testimonial2.jpg" alt="Marcus Chen" className="relative w-14 h-14 rounded-full object-cover border-2 border-white/10 group-hover:border-[#e8702a]/50 transition-colors duration-500" />
                           </div>
                           <div>
                              <div className="font-bold text-white text-lg tracking-tight">Marcus Chen</div>
                              <div className="text-sm font-mono text-[#e8702a]/80 uppercase tracking-wider mt-1">Lead Engineer, Vertex</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 4. ABOUT US SECTION */}
         <section id="about" className="w-full py-32 px-8 bg-black relative z-10">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
            
            <div className="max-w-5xl mx-auto">
               <div className="relative p-1 px-4 md:px-12 py-16 md:py-24 rounded-[3rem] overflow-hidden group">
                  {/* Glass background layers */}
                  <div className="absolute inset-0 bg-[#050505] rounded-[3rem]"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[3rem]"></div>
                  <div className="absolute inset-0 border border-white/10 rounded-[3rem] group-hover:border-[#e8702a]/30 transition-colors duration-1000"></div>
                  
                  {/* Subtle glowing animated orbs */}
                  <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#e8702a]/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#e8702a]/20 transition-colors duration-1000"></div>
                  <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#e8702a]/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#e8702a]/20 transition-colors duration-1000"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                     <h3 className="text-[#e8702a] font-mono text-sm tracking-widest mb-6 uppercase hero-anim hero-fade px-4 py-1.5 rounded-full border border-[#e8702a]/30 bg-[#e8702a]/10">
                        <DecryptedText text="[ Our Vision ]" animateOn="view" />
                     </h3>
                     
                     <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
                        <span className="block font-playfair italic font-normal text-gray-300 hero-anim hero-reveal" style={{ animationDelay: '0.1s' }}>
                           <DecryptedText text="REDEFINING " animateOn="view" />
                        </span>
                        <span className="block mt-1 hero-anim hero-reveal bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500" style={{ animationDelay: '0.3s' }}>
                           <DecryptedText text="SOFTWARE DEVELOPMENT." animateOn="view" initialDelay={220} />
                        </span>
                     </h2>
                     
                     <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#e8702a]/50 to-transparent mb-8"></div>
                     
                     <p className="text-gray-400 font-mono text-sm md:text-base leading-relaxed mb-12 max-w-2xl hero-anim hero-fade" style={{ animationDelay: '0.5s' }}>
                        <DecryptedText
                           text="Orion is an autonomous AI agent designed to replace the entire legacy development lifecycle. Just type your prompt, and watch as your SaaS application is built, tested, and deployed seamlessly."
                           animateOn="view"
                           initialDelay={500}
                        />
                     </p>
                     
                     <a href="#manifesto" className="relative group/btn inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full cursor-target overflow-hidden hero-anim hero-fade hover:shadow-[0_0_30px_rgba(232,112,42,0.4)] transition-all duration-300" style={{ animationDelay: '0.7s' }}>
                        <div className="absolute inset-0 bg-[#e8702a] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                        <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300">Read our Manifesto</span>
                        <ChevronRight className="relative z-10 w-4 h-4 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all duration-300" />
                     </a>
                  </div>
               </div>
            </div>
         </section>

         {/* 5. FOOTER SECTION */}
         <footer className="relative w-full py-16 px-8 bg-transparent border-t border-white/5 overflow-hidden">
            <DarkVeil hueShift={190} noiseIntensity={0} scanlineIntensity={1} scanlineFrequency={0} speed={0.5} />
            <div className="relative z-10">
               <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                  <div className="col-span-1 md:col-span-2">
                     <div className="flex items-center gap-3 mb-6">
                        <svg width="24" height="24" viewBox="0 0 256 256" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
                           <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
                        </svg>
                        <h1 className="text-xl font-bold tracking-widest text-white uppercase">
                           <FuzzyText enableScrollFuzz baseIntensity={0} hoverIntensity={1} fontSize={20} fontWeight="bold">
                              ORION
                           </FuzzyText>
                        </h1>
                     </div>
                     <p className="text-gray-500 font-mono text-sm max-w-sm leading-relaxed">
                        The temporal simulation engine. For architects of the future.
                     </p>
                  </div>

                  <div>
                     <h4 className="font-bold tracking-widest uppercase text-sm mb-6">Product</h4>
                     <ul className="space-y-4 font-mono text-sm text-gray-500">
                        <li><a href="#" className="hover:text-white transition-colors cursor-target">Features</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-target">Pricing</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-target">Documentation</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-target">Changelog</a></li>
                     </ul>
                  </div>

                  <div>
                     <h4 className="font-bold tracking-widest uppercase text-sm mb-6">Company</h4>
                     <ul className="space-y-4 font-mono text-sm text-gray-500">
                        <li><a href="#" className="hover:text-white transition-colors cursor-target">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-target">Careers</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-target">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-target">Terms of Service</a></li>
                     </ul>
                  </div>
               </div>

               <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
                  <div className="text-gray-600 font-mono text-xs mb-4 md:mb-0">
                     © 2026 Orion Engine. All rights reserved.
                  </div>
                  <div className="flex items-center gap-6 text-gray-500">
                     <a href="#" className="hover:text-white transition-colors cursor-target"><MessageSquare className="w-4 h-4" /></a>
                     <a href="#" className="hover:text-white transition-colors cursor-target"><Globe className="w-4 h-4" /></a>
                     <a href="#" className="hover:text-white transition-colors cursor-target"><Mail className="w-4 h-4" /></a>
                  </div>
               </div>
            </div>
         </footer>
      </main>
   );
}
