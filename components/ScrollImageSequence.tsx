'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import DecryptedText from '@/components/DecryptedText';
import FuzzyText from '@/components/FuzzyText';

// Register GSAP plugin safely on the client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollImageSequenceProps {
  folderPath?: string;
  frameCount?: number;
  extension?: string;
  padLength?: number;
}

export default function ScrollImageSequence({
  folderPath = '/scrollanimation/',
  frameCount = 192,
  extension = '.png',
  padLength = 5,
}: ScrollImageSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [images] = useState<HTMLImageElement[]>([]);

  const renderFrame = useCallback((index: number) => {
    if (!canvasRef.current || !images[index] || !images[index].complete) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = images[index];
    
    // Scale to cover
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, [images]);

  useEffect(() => {
    let active = true;

    const preloadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const frameIndex = i.toString().padStart(padLength, '0');
        img.src = `${folderPath}${frameIndex}${extension}`;
        
        img.onload = () => {
          if (!active) return;
          setLoadedFrames(prev => prev + 1);
          if (i === 1) {
            renderFrame(0);
          }
        };
        img.onerror = () => {
          console.warn(`Failed to load frame: ${frameIndex}`);
        };
        images.push(img);
      }
    };

    preloadImages();

    return () => {
      active = false;
      images.forEach(img => { img.src = ''; });
    };
  }, [folderPath, frameCount, extension, padLength, images, renderFrame]);



  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
        
        const progress = ScrollTrigger.getById('seq-trigger')?.progress || 0;
        const currentFrame = Math.min(
          frameCount - 1,
          Math.max(0, Math.floor(progress * frameCount))
        );
        renderFrame(currentFrame);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [frameCount, loadedFrames, renderFrame]);

  useEffect(() => {
    if (loadedFrames < 1 || !containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: 'seq-trigger',
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%', // Pin for 4x viewport height
        pin: true,
        scrub: 0.1, // Smooth scrub
        onUpdate: (self) => {
          const frameIndex = Math.min(
            frameCount - 1,
            Math.max(0, Math.floor(self.progress * frameCount))
          );
          
          requestAnimationFrame(() => {
            renderFrame(frameIndex);
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loadedFrames, frameCount, renderFrame]);

  const loadProgress = Math.floor((loadedFrames / frameCount) * 100);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
      {/* Loading Indicator */}
      {loadedFrames < frameCount && (
        <div className="absolute top-8 right-8 z-50 text-[var(--color-neon-blue)] font-mono text-sm border border-[var(--color-neon-blue)]/30 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
          SEQ_LOAD: {loadProgress}%
        </div>
      )}
      
      {/* Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full object-cover z-10"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16 pointer-events-none pb-32 md:pb-40">
         <div className="flex flex-col md:flex-row justify-between items-end w-full max-w-7xl mx-auto gap-12 md:gap-8">
            
            {/* Bottom Left: Hero Text, Motto & Buttons */}
            <div className="flex flex-col items-start gap-6 pointer-events-auto">
               <div className="text-7xl md:text-9xl font-bold tracking-tighter text-white mix-blend-overlay opacity-90 leading-[0.85]">
                  <FuzzyText className="-ml-[50px] md:-ml-[55px]" enableScrollFuzz baseIntensity={0} hoverIntensity={0.8} fontSize="clamp(4.5rem, 8vw, 8rem)" fontWeight="bold">
                     ORION
                  </FuzzyText>
               </div>
               <p className="text-xl md:text-2xl font-light tracking-wide text-gray-300 max-w-lg mb-2 drop-shadow-md">
                 <DecryptedText 
                    text="The AI agent that builds software from a single prompt."
                    speed={30}
                    animateOn="view"
                 />
               </p>
               <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors cursor-target text-center">
                     Get Started
                  </Link>
                  <button className="w-full sm:w-auto px-8 py-4 bg-black/40 border border-white/20 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/10 backdrop-blur-md transition-colors cursor-target">
                     Run a Demo
                  </button>
               </div>
            </div>

            {/* Bottom Right: Main Attraction Text */}
            <div className="flex flex-col items-start md:items-end text-left md:text-right max-w-sm pointer-events-auto mt-8 md:mt-0 translate-y-6 md:translate-y-12">
               <div className="font-mono text-xs tracking-widest text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/30 bg-[var(--color-neon-blue)]/10 px-3 py-1 rounded-full mb-4">
                  <FuzzyText enableScrollFuzz baseIntensity={0} hoverIntensity={0.8} fontSize={12} color="#00f0ff">
                     [AUTONOMOUS_BUILDER]
                  </FuzzyText>
               </div>
               <p className="text-gray-300 font-mono text-sm leading-relaxed drop-shadow-md bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-black/60 transition-colors duration-300 cursor-target">
                 <DecryptedText 
                    text="Forget legacy coding. Just describe the SaaS application you want to build, and Orion's autonomous agent will generate, test, and deploy your entire architecture in seconds."
                    speed={20}
                    animateOn="view"
                 />
               </p>
            </div>

         </div>
      </div>
    </section>
  );
}
