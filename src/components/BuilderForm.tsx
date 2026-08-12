import React, { useState, useRef } from 'react';
import { Upload, X, ArrowLeft, RefreshCw } from 'lucide-react';
import { SUGGESTED_TITLES, getBuilderTitle } from '../utils/titleGenerator';

interface BuilderFormProps {
  onBack: () => void;
  onSubmit: (data: {
    name: string;
    photoFile: File;
    role: string;
    builderTitle: string;
    location: string;
    vibe: string;
    origin: string;
  }) => void;
}

export const BuilderForm: React.FC<BuilderFormProps> = ({
  onBack,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [role, setRole] = useState('');
  const [builderTitle, setBuilderTitle] = useState('');
  const [location, setLocation] = useState('');
  const [vibe, setVibe] = useState('');
  const [origin, setOrigin] = useState('HOME');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'File must be an image (PNG, JPG, JPEG).' }));
      return;
    }
    setPhoto(file);
    setPhotoUrl(URL.createObjectURL(file));
    setErrors(prev => {
      const copy = { ...prev };
      delete copy.photo;
      return copy;
    });
  };

  const autoGenerateTitle = () => {
    if (role.trim()) {
      setBuilderTitle(getBuilderTitle(role));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!photo) newErrors.photo = 'Photo is required.';
    if (!role.trim()) newErrors.role = 'Stack / Role is required.';
    if (!builderTitle.trim()) newErrors.builderTitle = 'Builder Title is required.';
    if (!location.trim()) newErrors.location = 'Location is required.';
    if (!vibe.trim()) newErrors.vibe = 'Vibe / Fun Fact is required.';
    if (!origin.trim()) newErrors.origin = 'Origin is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name,
      photoFile: photo!,
      role,
      builderTitle,
      location,
      vibe,
      origin,
    });
  };

  return (
    <div className="max-w-xl w-full mx-auto py-6 px-4 animate-scale-in">
      <button 
        onClick={onBack} 
        className="inline-flex items-center space-x-2 text-brand-green/80 hover:text-brand-green font-display font-semibold text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO HOMEPAGE</span>
      </button>

      <div className="bg-[#FDFBF9] border-3 border-brand-ink rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#133B2B]">
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brand-green mb-6 border-b-3 border-brand-ink pb-3">
          Builder Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Photo Uploader */}
          <div>
            <label className="block text-brand-green font-display font-bold text-sm uppercase tracking-wider mb-2">
              1. Upload Your Photo <span className="text-brand-pink">*</span>
            </label>
            
            {!photoUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-3 border-dashed border-brand-green/30 hover:border-brand-green bg-[#F9F6F4] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-brand-cream/50 ${errors.photo ? 'border-brand-pink bg-brand-pink/5' : ''}`}
              >
                <Upload className="w-10 h-10 text-brand-green/60 mb-2 animate-bounce" style={{ animationDuration: '3s' }} />
                <span className="font-display font-semibold text-brand-green/80 text-sm mb-1">
                  Click to select or drag and drop
                </span>
                <span className="text-xs text-brand-green/50">
                  PNG, JPG, JPEG (automatically circular cropped)
                </span>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handlePhotoChange(e.target.files[0])}
                  accept="image/*"
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="relative border-3 border-brand-ink rounded-xl p-4 bg-[#F9F6F4] flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={photoUrl} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-full border-2 border-brand-green object-cover" 
                  />
                  <div className="overflow-hidden">
                    <p className="font-display font-bold text-brand-green text-sm truncate max-w-[200px]">
                      {photo?.name}
                    </p>
                    <p className="text-xs text-brand-green/60">
                      {(photo!.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null);
                    setPhotoUrl('');
                  }}
                  className="p-2 bg-brand-pink/10 hover:bg-brand-pink/20 rounded-full text-brand-pink transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {errors.photo && (
              <p className="text-brand-pink text-xs font-semibold mt-1.5">{errors.photo}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-brand-green font-display font-bold text-sm uppercase tracking-wider mb-2">
              2. Full Name <span className="text-brand-pink">*</span>
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. HEMANTH K"
              className={`w-full bg-[#F9F6F4] border-3 border-brand-ink rounded-xl px-4 py-3 font-display font-semibold text-brand-green placeholder-brand-green/40 focus:outline-none focus:border-brand-pink transition-colors ${errors.name ? 'border-brand-pink' : ''}`}
            />
            {errors.name && (
              <p className="text-brand-pink text-xs font-semibold mt-1.5">{errors.name}</p>
            )}
          </div>

          {/* Stack / Role */}
          <div>
            <label className="block text-brand-green font-display font-bold text-sm uppercase tracking-wider mb-2">
              3. Stack / Role <span className="text-brand-pink">*</span>
            </label>
            <input 
              type="text" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. AI / ML DEVELOPER"
              className={`w-full bg-[#F9F6F4] border-3 border-brand-ink rounded-xl px-4 py-3 font-display font-semibold text-brand-green placeholder-brand-green/40 focus:outline-none focus:border-brand-pink transition-colors ${errors.role ? 'border-brand-pink' : ''}`}
            />
            {errors.role && (
              <p className="text-brand-pink text-xs font-semibold mt-1.5">{errors.role}</p>
            )}
          </div>

          {/* Builder Title with Auto-Generate Helper */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-brand-green font-display font-bold text-sm uppercase tracking-wider">
                4. Builder Title <span className="text-brand-pink">*</span>
              </label>
              {role.trim() && (
                <button
                  type="button"
                  onClick={autoGenerateTitle}
                  className="inline-flex items-center space-x-1 text-xs font-mono font-bold text-brand-pink hover:underline"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Auto-Suggest</span>
                </button>
              )}
            </div>
            
            <input 
              type="text" 
              value={builderTitle}
              onChange={(e) => setBuilderTitle(e.target.value)}
              placeholder="e.g. THE MODEL WHISPERER"
              className={`w-full bg-[#F9F6F4] border-3 border-brand-ink rounded-xl px-4 py-3 font-display font-semibold text-brand-green placeholder-brand-green/40 focus:outline-none focus:border-brand-pink transition-colors ${errors.builderTitle ? 'border-brand-pink' : ''}`}
            />
            
            {/* Quick Suggestions Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SUGGESTED_TITLES.slice(0, 4).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setBuilderTitle(t)}
                  className="text-[10px] font-mono font-bold bg-brand-green/5 hover:bg-brand-green/10 border border-brand-green/20 rounded-md px-2 py-0.5 text-brand-green transition-all"
                >
                  {t}
                </button>
              ))}
            </div>

            {errors.builderTitle && (
              <p className="text-brand-pink text-xs font-semibold mt-1.5">{errors.builderTitle}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-brand-green font-display font-bold text-sm uppercase tracking-wider mb-2">
              5. Location <span className="text-brand-pink">*</span>
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. BENGALURU"
              className={`w-full bg-[#F9F6F4] border-3 border-brand-ink rounded-xl px-4 py-3 font-display font-semibold text-brand-green placeholder-brand-green/40 focus:outline-none focus:border-brand-pink transition-colors ${errors.location ? 'border-brand-pink' : ''}`}
            />
            {errors.location && (
              <p className="text-brand-pink text-xs font-semibold mt-1.5">{errors.location}</p>
            )}
          </div>

          {/* Vibe / Fun Fact */}
          <div>
            <label className="block text-brand-green font-display font-bold text-sm uppercase tracking-wider mb-2">
              6. Vibe / Fun Fact <span className="text-brand-pink">*</span>
            </label>
            <input 
              type="text" 
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="e.g. BUILDING AI THAT SEES THE WORLD"
              className={`w-full bg-[#F9F6F4] border-3 border-brand-ink rounded-xl px-4 py-3 font-display font-semibold text-brand-green placeholder-brand-green/40 focus:outline-none focus:border-brand-pink transition-colors ${errors.vibe ? 'border-brand-pink' : ''}`}
            />
            {errors.vibe && (
              <p className="text-brand-pink text-xs font-semibold mt-1.5">{errors.vibe}</p>
            )}
          </div>

          {/* Origin */}
          <div>
            <label className="block text-brand-green font-display font-bold text-sm uppercase tracking-wider mb-2">
              7. Origin
            </label>
            <input 
              type="text" 
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. HOME"
              className={`w-full bg-[#F9F6F4] border-3 border-brand-ink rounded-xl px-4 py-3 font-display font-semibold text-brand-green placeholder-brand-green/40 focus:outline-none focus:border-brand-pink transition-colors ${errors.origin ? 'border-brand-pink' : ''}`}
            />
            {errors.origin && (
              <p className="text-brand-pink text-xs font-semibold mt-1.5">{errors.origin}</p>
            )}
          </div>

          {/* Readonly/Disabled Event Information */}
          <div className="grid grid-cols-3 gap-3 bg-[#F9F6F4] border-2 border-brand-green/20 rounded-xl p-3.5">
            <div>
              <span className="block text-[10px] font-mono font-bold text-brand-green/50 uppercase tracking-wider">Destination</span>
              <span className="font-display font-bold text-brand-green text-sm">GOA</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono font-bold text-brand-green/50 uppercase tracking-wider">Class</span>
              <span className="font-display font-bold text-brand-green text-sm">BUILDER</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono font-bold text-brand-green/50 uppercase tracking-wider">Status</span>
              <span className="font-display font-bold text-brand-pink text-sm uppercase tracking-wider">VERIFIED</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center bg-brand-green hover:bg-brand-pink text-brand-cream font-display font-bold text-lg py-4 rounded-xl border-3 border-brand-ink shadow-[4px_4px_0px_0px_#1A1A1A] transition-all hover:translate-y-[-2px] active:translate-y-[2px] cursor-pointer"
          >
            GENERATE MY BUILDER PASS
          </button>

        </form>
      </div>
    </div>
  );
};
