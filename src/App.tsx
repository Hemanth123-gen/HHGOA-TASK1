import { useState, useEffect } from 'react';
import { LandingScreen } from './components/LandingScreen';
import { BuilderForm } from './components/BuilderForm';
import { BuilderCardPreview } from './components/BuilderCardPreview';
import { BuilderProfile } from './components/BuilderProfile';

type Step = 'landing' | 'form' | 'preview' | 'profile';

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [formData, setFormData] = useState<any>(null);

  // Check if we are on the builder profile route (contain query parameter 'd')
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('d')) {
      setStep('profile');
    }
  }, []);

  const handleBackToLanding = () => {
    // Clear URL query parameters when returning to homepage
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setStep('landing');
    setFormData(null);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      {/* Brand Header Navbar */}
      <header className="w-full bg-brand-green border-b-3 border-brand-ink py-4 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2.5">
          <span className="font-display font-black text-xl text-brand-yellow tracking-wider">
            HH GOA 2026
          </span>
          <span className="h-4 w-0.5 bg-brand-cream/30" />
          <span className="font-mono text-xs font-bold text-brand-pink tracking-widest uppercase">
            Pass Gen
          </span>
        </div>
        <span className="font-mono text-xs font-bold text-brand-cream/80 hover:text-brand-yellow transition-colors cursor-pointer hidden sm:inline">
          #FrameInGoa 🌴
        </span>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {step === 'landing' && (
          <LandingScreen onNext={() => setStep('form')} />
        )}
        
        {step === 'form' && (
          <BuilderForm 
            onBack={() => setStep('landing')}
            onSubmit={(data) => {
              setFormData(data);
              setStep('preview');
            }}
          />
        )}
        
        {step === 'preview' && formData && (
          <BuilderCardPreview 
            data={formData}
            onEdit={() => setStep('form')}
            onBack={handleBackToLanding}
          />
        )}

        {step === 'profile' && (
          <BuilderProfile onBack={handleBackToLanding} />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="w-full bg-[#E2ECE9] border-t-3 border-brand-ink py-4 px-6 text-center text-xs font-mono font-bold text-brand-green/75">
        &copy; {new Date().getFullYear()} HH Goa 2026. Made with 🌴 and ⚡ in Goa. All rights reserved.
      </footer>
    </div>
  );
}
