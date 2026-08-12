import React, { useEffect, useRef, useState } from 'react';
import { Download, Edit2, Share2, ArrowLeft, Loader2 } from 'lucide-react';
import { drawFormatB } from '../utils/canvasRenderer';
import { generateDeterministicId } from '../utils/idGenerator';

interface BuilderCardPreviewProps {
  data: {
    name: string;
    photoFile: File;
    role: string;
    builderTitle: string;
    location: string;
    vibe: string;
    origin: string;
  };
  onEdit: () => void;
  onBack: () => void;
}

export const BuilderCardPreview: React.FC<BuilderCardPreviewProps> = ({
  data,
  onEdit,
  onBack,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const builderId = generateDeterministicId(data.name, data.role).toUpperCase();
  const profileUrl = `${window.location.origin}/builder?d=${encodeURIComponent(
    JSON.stringify({
      id: builderId,
      name: data.name,
      role: data.role,
      title: data.builderTitle,
      loc: data.location,
      vibe: data.vibe,
      origin: data.origin,
    })
  )}`;

  useEffect(() => {
    let active = true;
    const render = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Read photo file as an HTMLImageElement
        const img = new Image();
        const reader = new FileReader();
        
        const imageLoadedPromise = new Promise<void>((resolve, reject) => {
          reader.onload = (e) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Failed to load uploaded image file."));
            img.src = e.target?.result as string;
          };
          reader.onerror = () => reject(new Error("Failed to read uploaded photo file."));
          reader.readAsDataURL(data.photoFile);
        });
        
        await imageLoadedPromise;
        
        if (!active) return;
        
        if (canvasRef.current) {
          await drawFormatB(canvasRef.current, img, {
            name: data.name,
            role: data.role,
            location: data.location,
            builderTitle: data.builderTitle,
            vibe: data.vibe,
            qrUrl: profileUrl,
          });
          
          setDataUrl(canvasRef.current.toDataURL('image/png'));
        }
      } catch (err: any) {
        console.error("Rendering failed", err);
        if (active) setError(err.message || 'Failed to render Builder Pass.');
      } finally {
        if (active) setLoading(false);
      }
    };
    
    render();
    
    return () => {
      active = false;
    };
  }, [data, profileUrl]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `HH-Goa-2026-Builder-${builderId}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleShareToX = () => {
    const tweetText = `Just built my HH Goa 2026 identity. 🌴⚡\nReady to Build. Collaborate. Ship.\n#FrameInGoa`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    
    // Open X compose
    window.open(shareUrl, '_blank');
    
    // Advise the user about downloading/attaching the card
    alert("X compose page opened! Your custom Builder Card has been downloaded. Simply attach the downloaded image to your X post.");
    handleDownload();
  };

  return (
    <div className="max-w-4xl w-full mx-auto py-6 px-4 animate-scale-in">
      <button 
        onClick={onBack} 
        className="inline-flex items-center space-x-2 text-brand-green/80 hover:text-brand-green font-display font-semibold text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO HOMEPAGE</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Render Preview Card */}
        <div className="relative bg-[#FDFBF9] border-3 border-brand-ink rounded-2xl p-4 shadow-[6px_6px_0px_0px_#133B2B] flex flex-col items-center justify-center min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/80 rounded-2xl flex flex-col items-center justify-center z-10">
              <Loader2 className="w-12 h-12 text-brand-green animate-spin mb-3" />
              <p className="font-display font-bold text-brand-green text-base">
                Creating your Builder Card...
              </p>
            </div>
          )}
          
          {error && (
            <div className="text-center p-6">
              <p className="text-brand-pink font-display font-bold text-sm mb-4">
                {error}
              </p>
              <button 
                onClick={onEdit}
                className="bg-brand-green hover:bg-brand-pink text-brand-cream font-display font-bold px-4 py-2 rounded-xl border-2 border-brand-ink"
              >
                Go Back & Retry
              </button>
            </div>
          )}

          {/* Hidden Canvas used for drawing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Display Rendered Image URL */}
          {dataUrl && (
            <div className="w-full flex justify-center">
              <img 
                src={dataUrl} 
                alt="Generated Builder Pass" 
                className="w-full max-w-[340px] h-auto border-3 border-brand-green rounded-xl shadow-lg object-contain transition-transform hover:scale-[1.01]" 
              />
            </div>
          )}
        </div>

        {/* Action Controls panel */}
        <div className="bg-[#FDFBF9] border-3 border-brand-ink rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#133B2B] space-y-6">
          <div>
            <span className="inline-flex items-center space-x-1.5 bg-[#E2ECE9] text-brand-green text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Success // Pass Generated
            </span>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brand-green leading-tight">
              Your Badge is Ready!
            </h2>
            <p className="text-brand-ink/70 text-sm font-medium mt-2">
              Review your details, download the high-resolution event pass, or share your builder card with the community.
            </p>
          </div>

          <div className="space-y-3.5">
            <button
              onClick={handleDownload}
              disabled={loading || !!error}
              className="w-full inline-flex items-center justify-center space-x-2 bg-brand-green hover:bg-brand-pink text-brand-cream font-display font-bold text-base py-3.5 rounded-xl border-3 border-brand-ink shadow-[3px_3px_0px_0px_#1A1A1A] transition-all hover:translate-y-[-2px] active:translate-y-[2px] disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>DOWNLOAD BADGE (PNG)</span>
            </button>

            <button
              onClick={handleShareToX}
              disabled={loading || !!error}
              className="w-full inline-flex items-center justify-center space-x-2 bg-[#1DA1F2] hover:bg-[#0c85d0] text-white font-display font-bold text-base py-3.5 rounded-xl border-3 border-brand-ink shadow-[3px_3px_0px_0px_#1A1A1A] transition-all hover:translate-y-[-2px] active:translate-y-[2px] disabled:opacity-50 cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
              <span>SHARE TO X (#FrameInGoa)</span>
            </button>

            <button
              onClick={onEdit}
              disabled={loading}
              className="w-full inline-flex items-center justify-center space-x-2 bg-[#F9F6F4] hover:bg-brand-cream/80 text-brand-green font-display font-bold text-base py-3.5 rounded-xl border-3 border-brand-ink shadow-[3px_3px_0px_0px_#1A1A1A] transition-all hover:translate-y-[-2px] active:translate-y-[2px] disabled:opacity-50 cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              <span>EDIT CARD DETAILS</span>
            </button>
          </div>

          {/* Guidelines info badge */}
          <div className="border-2 border-brand-green/10 bg-[#F9F6F4] rounded-xl p-4 text-xs text-brand-green/80 font-medium space-y-2">
            <p className="font-bold uppercase tracking-wider text-brand-pink">
              How to share on X:
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click <b>Share to X</b> to open compose.</li>
              <li>Your badge image has been downloaded.</li>
              <li>Attach the downloaded image file to your post.</li>
              <li>Hit post!</li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
};
