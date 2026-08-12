import { Compass, CheckCircle2, User, Award, Tag, MapPin, Smile } from 'lucide-react';

interface BuilderProfileProps {
  onBack: () => void;
}

export const BuilderProfile: React.FC<BuilderProfileProps> = ({
  onBack,
}) => {
  const params = new URLSearchParams(window.location.search);
  const dataStr = params.get('d');
  
  let profile: any = null;
  let error = '';

  if (dataStr) {
    try {
      profile = JSON.parse(decodeURIComponent(dataStr));
    } catch (e) {
      console.error("Failed to parse profile payload", e);
      error = "Invalid or corrupted builder profile data.";
    }
  } else {
    error = "Builder profile data not found in URL.";
  }

  return (
    <div className="relative overflow-hidden w-full min-h-screen py-10 px-4 flex flex-col items-center justify-center animate-scale-in">
      
      {/* Background sunset gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] via-[#FFF3E0] to-[#FFE0E0] pointer-events-none -z-20" />
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none -z-10 opacity-30">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[80px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,55.05,16.22,83.1,22.66,135.22,34.6,187.89,42.43,241,45.88A907.41,907.41,0,0,0,321.39,56.44Z" fill="#FFA726" opacity="0.3"></path>
        </svg>
      </div>

      <div className="max-w-xl w-full mx-auto">
        <button 
          onClick={onBack} 
          className="inline-flex items-center space-x-2 text-brand-green/80 hover:text-brand-green font-display font-semibold text-sm mb-6 transition-colors"
        >
          <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
          <span>GO TO HOMEPAGE</span>
        </button>

        {error ? (
          <div className="bg-[#FDFBF9] border-3 border-brand-ink rounded-2xl p-8 text-center shadow-[6px_6px_0px_0px_#133B2B]">
            <p className="text-brand-pink font-display font-bold text-lg mb-4">{error}</p>
            <p className="text-xs text-brand-green/60">
              Please scan a valid HH Goa 2026 dynamic QR code to access builder profiles.
            </p>
          </div>
        ) : (
          <div className="bg-[#FDFBF9] border-3 border-brand-ink rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#133B2B] space-y-6">
            
            {/* Header info */}
            <div className="border-b-3 border-brand-ink pb-4 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center space-x-1.5 bg-brand-green text-brand-cream text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                  HH Goa 2026 // Profile
                </span>
                <h1 className="font-display font-extrabold text-2xl md:text-3xl text-brand-green leading-tight">
                  Builder Profile
                </h1>
              </div>
              <span className="font-mono text-xs font-bold text-brand-green/60 bg-brand-green/5 border border-brand-green/20 rounded-md px-2 py-1">
                {profile?.id || 'HH26-UNKNOWN'}
              </span>
            </div>

            {/* Profile fields layout */}
            <div className="space-y-4 font-display">
              
              {/* Name */}
              <div className="flex items-start space-x-3.5 border-b-2 border-brand-green/5 pb-3">
                <User className="w-5 h-5 text-brand-green mt-1 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] font-mono font-bold text-brand-green/40 uppercase tracking-wider">Name</span>
                  <span className="text-lg font-black text-brand-green uppercase">
                    {profile?.name}
                  </span>
                </div>
              </div>

              {/* Stack / Role */}
              <div className="flex items-start space-x-3.5 border-b-2 border-brand-green/5 pb-3">
                <Award className="w-5 h-5 text-brand-pink mt-1 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] font-mono font-bold text-brand-green/40 uppercase tracking-wider">Stack / Role</span>
                  <span className="text-base font-extrabold text-brand-pink uppercase">
                    {profile?.role}
                  </span>
                </div>
              </div>

              {/* Builder Title */}
              <div className="flex items-start space-x-3.5 border-b-2 border-brand-green/5 pb-3">
                <Tag className="w-5 h-5 text-brand-green mt-1 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] font-mono font-bold text-brand-green/40 uppercase tracking-wider">Builder Title</span>
                  <span className="text-base font-extrabold text-brand-green uppercase">
                    ⚡ {profile?.title} ⚡
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3.5 border-b-2 border-brand-green/5 pb-3">
                <MapPin className="w-5 h-5 text-brand-pink mt-1 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] font-mono font-bold text-brand-green/40 uppercase tracking-wider">Location</span>
                  <span className="text-base font-extrabold text-brand-pink uppercase">
                    {profile?.loc}
                  </span>
                </div>
              </div>

              {/* Vibe / Fun Fact */}
              <div className="flex items-start space-x-3.5 border-b-2 border-brand-green/5 pb-3">
                <Smile className="w-5 h-5 text-brand-green mt-1 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] font-mono font-bold text-brand-green/40 uppercase tracking-wider">Vibe / Fun Fact</span>
                  <span className="text-sm font-bold text-brand-green uppercase">
                    {profile?.vibe}
                  </span>
                </div>
              </div>

              {/* Event credentials grid */}
              <div className="grid grid-cols-3 gap-3 bg-[#F9F6F4] border-2 border-brand-green/20 rounded-xl p-3.5">
                <div>
                  <span className="block text-[10px] font-mono font-bold text-brand-green/40 uppercase tracking-wider">Origin</span>
                  <span className="font-display font-bold text-brand-green text-sm uppercase">{profile?.origin || 'HOME'}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-bold text-brand-green/40 uppercase tracking-wider">Destination</span>
                  <span className="font-display font-bold text-brand-green text-sm">GOA</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-bold text-brand-green/40 uppercase tracking-wider">Class</span>
                  <span className="font-display font-bold text-brand-green text-sm">BUILDER</span>
                </div>
              </div>

              {/* Status verified row */}
              <div className="flex items-center space-x-2 bg-brand-green/5 border-2 border-brand-green/20 rounded-xl p-3">
                <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0" />
                <div className="font-display">
                  <span className="block text-[10px] font-mono font-bold text-brand-green/40 uppercase tracking-wider">Verification Status</span>
                  <span className="text-xs font-bold text-brand-green uppercase tracking-wide">
                    VERIFIED BUILDER ID CARD OWNER
                  </span>
                </div>
              </div>

            </div>

            {/* Campaign footer ribbon */}
            <div className="text-center border-t-3 border-brand-ink pt-4 font-mono text-xs font-bold text-brand-green/60">
              Built for #FrameInGoa 🌴
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
