import React from 'react';
import { ArrowRight, Palmtree, Sparkles } from 'lucide-react';
import sampleBuilderPass from '../assets/references/sample-builder-pass.png';

interface LandingScreenProps {
  onNext: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onNext,
}) => {
  return (
    <div className="relative overflow-hidden w-full py-8 md:py-16 px-4 flex flex-col items-center justify-center animate-scale-in">
      
      {/* Dynamic Goan Sunset & Beach Atmosphere background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] via-[#FFF3E0] to-[#FFE0E0] pointer-events-none -z-20" />
      
      {/* Giant glowing blur sun */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-brand-orange/20 to-brand-pink/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      
      {/* Decorative floating clouds/mist */}
      <div className="absolute top-10 left-10 w-48 h-12 bg-white/20 blur-md rounded-full pointer-events-none -z-10" />
      <div className="absolute top-32 right-12 w-64 h-16 bg-white/20 blur-md rounded-full pointer-events-none -z-10" />

      {/* Subtle Ocean Wave Lines SVG */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none -z-10 opacity-30">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[100px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,55.05,16.22,83.1,22.66,135.22,34.6,187.89,42.43,241,45.88A907.41,907.41,0,0,0,321.39,56.44Z" fill="#FFA726" opacity="0.3"></path>
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A907.41,907.41,0,0,1,241,45.88c-53.11-3.45-105.78-11.28-157.9-23.22C55.05,16.22,26.9,8.75,0,0V120H1200V95.83C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#EC4899" opacity="0.15"></path>
        </svg>
      </div>

      {/* Subtle Palm Silhouettes framing the top wrapper */}
      <div className="absolute -top-12 -left-12 opacity-15 pointer-events-none -z-10 rotate-45">
        <Palmtree className="w-48 h-48 text-brand-green" />
      </div>
      <div className="absolute -top-12 -right-12 opacity-15 pointer-events-none -z-10 -rotate-45 scale-x-[-1]">
        <Palmtree className="w-48 h-48 text-brand-green" />
      </div>

      <div className="max-w-xl w-full mx-auto flex flex-col items-center">
        {/* Campaign Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-1.5 bg-brand-pink text-brand-cream text-xs font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 shadow-sm border border-brand-green/20">
            <Sparkles className="w-3.5 h-3.5 text-brand-yellow animate-spin" style={{ animationDuration: '4s' }} />
            <span>HH Goa 2026 // Campaign Tool</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-brand-green leading-tight tracking-tight mb-4">
            Frame Your <br />
            <span className="bg-gradient-to-r from-brand-pink to-brand-orange bg-clip-text text-transparent drop-shadow-sm">Builder Identity</span>
          </h1>
          <p className="text-brand-ink/80 max-w-sm mx-auto text-sm md:text-base font-medium px-4">
            Generate your official illustrated HH Goa 2026 travel credential or social profile frame.
          </p>
        </div>

        {/* Static Sample Builder Pass Preview with custom glowing sunset backdrop */}
        <div className="relative flex justify-center mb-10 px-4">
          <div className="absolute inset-0 bg-brand-pink/5 rounded-3xl blur-2xl -z-10" />
          <img
            src={sampleBuilderPass}
            alt="Sample Builder Pass"
            className="w-full max-w-[270px] md:max-w-[290px] h-auto border-4 border-brand-green rounded-2xl shadow-[10px_10px_0px_0px_#133B2B] object-contain transition-transform hover:scale-[1.02] duration-300"
          />
        </div>

        {/* Action CTA Button */}
        <div className="text-center w-full px-4">
          <button
            onClick={onNext}
            className="group w-full sm:w-auto inline-flex items-center justify-center bg-brand-green hover:bg-brand-pink text-brand-cream font-display font-bold text-lg px-8 py-4 rounded-xl border-3 border-brand-ink shadow-[4px_4px_0px_0px_#1A1A1A] transition-all hover:translate-y-[-2px] active:translate-y-[2px]"
          >
            <span>CREATE MY BUILDER PASS</span>
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
