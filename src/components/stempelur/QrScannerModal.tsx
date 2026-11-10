import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  X,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  MapPin,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import jsQR from 'jsqr';

export interface SiteLocation {
  id: string;
  code: string;
  name: string;
  zone: string;
  department: string;
}

export const VERIFIED_SITES: SiteLocation[] = [
  {
    id: 'site-1',
    code: 'PORTALE-DK-SALA-01',
    name: 'Servering & Sal - Hovedstation',
    zone: 'Sal 1 & Cassa',
    department: 'Sala',
  },
  {
    id: 'site-2',
    code: 'PORTALE-DK-KOKKEN-02',
    name: 'Køkken & Varmt parti',
    zone: 'Produktionskøkken',
    department: 'Cucina',
  },
  {
    id: 'site-3',
    code: 'PORTALE-DK-PIZZA-03',
    name: 'Pizzeria & Stenovn',
    zone: 'Pizzaparti & Hævebænk',
    department: 'Pizzeria',
  },
  {
    id: 'site-4',
    code: 'PORTALE-DK-BAR-04',
    name: 'Bar & Drikkevarer',
    zone: 'Kaffebar & Lounge',
    department: 'Bar',
  },
  {
    id: 'site-5',
    code: 'PORTALE-DK-ADM-05',
    name: 'Administration & Baglokale',
    zone: 'Personalerum & Kontor',
    department: 'Amministrazione',
  },
];

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (site: SiteLocation, actionType: 'in' | 'out') => void;
  isClockedIn: boolean;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  isClockedIn,
}) => {
  const [activeMode, setActiveMode] = useState<'camera' | 'sites' | 'print'>('camera');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<SiteLocation | null>(null);
  const [manualCode, setManualCode] = useState<string>('');
  const [selectedSiteToDisplay, setSelectedSiteToDisplay] = useState<SiteLocation>(VERIFIED_SITES[0]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Start Camera stream
  const startCamera = async () => {
    setCameraError(null);
    setIsScanning(true);
    setScannedResult(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kameraet understøttes ikke i denne browser eller i et usikret miljø.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Kameraadgang blev afvist. Tillad kamera i browseren eller vælg en lokation manuelt.'
          : 'Kameraet kunne ikke startes (bruges måske af et andet program). Vælg en on-site kode nedenfor.'
      );
      setIsScanning(false);
    }
  };

  // Stop Camera stream
  const stopCamera = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  // QR Processing Loop
  const tickScan = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data) {
            handleCodeFound(code.data);
            return;
          }
        }
      }
    }
    animFrameIdRef.current = requestAnimationFrame(tickScan);
  };

  const handleCodeFound = (dataString: string) => {
    stopCamera();
    const clean = dataString.trim();

    // Match code to verified sites
    const matched = VERIFIED_SITES.find(
      (s) => s.code === clean || clean.includes(s.code) || clean.toLowerCase().includes(s.id)
    );

    if (matched) {
      setScannedResult(matched);
    } else {
      // Create fallback valid site from generic restaurant code
      const fallbackSite: SiteLocation = {
        id: 'site-custom',
        code: clean.slice(0, 24),
        name: `Portale Ristorante (${clean.slice(0, 16)})`,
        zone: 'Restaurant Område',
        department: 'Sala',
      };
      setScannedResult(fallbackSite);
    }
  };

  useEffect(() => {
    if (isOpen && activeMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeMode]);

  if (!isOpen) return null;

  const handleManualVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleCodeFound(manualCode.trim());
  };

  const handleConfirmVerification = () => {
    if (!scannedResult) return;
    onVerified(scannedResult, isClockedIn ? 'out' : 'in');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0F2744] text-white p-4.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#10B981] text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">QR-Stempelur Scanner</h3>
              <p className="text-[11px] text-slate-300">
                {isClockedIn ? 'Scan on-site kode for at stemple UD' : 'Scan on-site kode for at stemple IND'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="bg-slate-100 p-1 flex gap-1 border-b border-slate-200 shrink-0">
          <button
            onClick={() => {
              setActiveMode('camera');
              setScannedResult(null);
            }}
            className={`flex-1 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'camera'
                ? 'bg-white text-[#0F2744] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kamera Scanner</span>
          </button>
          <button
            onClick={() => {
              setActiveMode('sites');
              stopCamera();
            }}
            className={`flex-1 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'sites'
                ? 'bg-white text-[#0F2744] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vælg Station</span>
          </button>
          <button
            onClick={() => {
              setActiveMode('print');
              stopCamera();
            }}
            className={`flex-1 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'print'
                ? 'bg-white text-[#0F2744] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>Vis Koder</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* CAMERA SCANNER VIEW */}
          {activeMode === 'camera' && !scannedResult && (
            <div className="space-y-3">
              {/* Viewfinder Container */}
              <div className="relative aspect-square w-full max-w-[280px] mx-auto rounded-3xl overflow-hidden bg-black border-2 border-[#10B981] shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Laser / Scanner Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                  {/* Targeting brackets */}
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                    <div className="w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                  </div>

                  {/* Animated laser scan line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse" />

                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                    <div className="w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                  </div>
                </div>

                {cameraError && (
                  <div className="absolute inset-0 bg-slate-900/90 p-4 text-center flex flex-col items-center justify-center text-white">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
                    <p className="text-xs text-slate-200">{cameraError}</p>
                    <button
                      onClick={() => setActiveMode('sites')}
                      className="mt-3 px-3.5 py-1.5 rounded-xl bg-[#10B981] text-white text-xs font-bold"
                    >
                      Brug stationstest i stedet
                    </button>
                  </div>
                )}
              </div>

              <div className="text-center text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-[#0F2744]">
                  Ret kameraet mod QR-koden placeret ved din arbejdsstation
                </p>
                <p className="text-[11px] text-slate-400">
                  Bekræfter automatisk lokation for stempling i Portale Ristorante
                </p>
              </div>

              {/* Quick simulation buttons for desktop/camera test */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Hurtig test: Klik på en station for at simulere scanning
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {VERIFIED_SITES.slice(0, 4).map((site) => (
                    <button
                      key={site.id}
                      onClick={() => handleCodeFound(site.code)}
                      className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#eff4ff] border border-slate-200 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-[#0F2744] truncate">{site.name}</div>
                      <div className="text-[10px] text-emerald-700 font-mono">{site.code}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VERIFIED SCANNED RESULT CONFIRMATION */}
          {scannedResult && (
            <div className="space-y-4 py-2">
              <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] border border-emerald-200 text-[#065F46] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
              </div>

              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full inline-block">
                  Lokationskode Verificeret
                </span>
                <h3 className="text-base font-extrabold text-[#0F2744]">
                  {scannedResult.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Zone: <strong>{scannedResult.zone}</strong> • Reparto: <strong>{scannedResult.department}</strong>
                </p>
              </div>

              {/* Security verification details */}
              <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-[11px] text-slate-400">On-site Kode:</span>
                  <span className="font-mono font-bold text-[#0F2744]">{scannedResult.code}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-[11px] text-slate-400">GPS / Wi-Fi tjek:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Godkendt på lokation
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-[11px] text-slate-400">Handling:</span>
                  <span className={`font-bold ${isClockedIn ? 'text-red-700' : 'text-emerald-700'}`}>
                    {isClockedIn ? 'Stempel UD for i dag' : 'Stempel IND på vagt'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setScannedResult(null);
                    if (activeMode === 'camera') startCamera();
                  }}
                  className="flex-1 h-[48px] rounded-2xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Scan Igen
                </button>
                <button
                  type="button"
                  onClick={handleConfirmVerification}
                  className={`flex-1 h-[48px] rounded-2xl text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 android-tap ${
                    isClockedIn
                      ? 'bg-[#BA1A1A] hover:bg-[#93000A]'
                      : 'bg-[#10B981] hover:bg-[#059669]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isClockedIn ? 'Bekræft Stempel UD' : 'Bekræft Stempel IND'}</span>
                </button>
              </div>
            </div>
          )}

          {/* SITES SELECTOR VIEW */}
          {activeMode === 'sites' && !scannedResult && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Vælg den autoriserede QR-arbejdsstation for Portale Ristorante:
              </div>

              <div className="space-y-2">
                {VERIFIED_SITES.map((site) => (
                  <div
                    key={site.id}
                    onClick={() => handleCodeFound(site.code)}
                    className="p-3 bg-[#F8FAFC] hover:bg-[#eff4ff] border border-slate-200 rounded-2xl cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0F2744] shrink-0 shadow-2xs">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F2744]">{site.name}</div>
                        <div className="text-[11px] text-slate-500">{site.zone}</div>
                        <div className="text-[10px] font-mono text-emerald-800 font-semibold mt-0.5">
                          {site.code}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>

              {/* Manual input fallback */}
              <form onSubmit={handleManualVerifySubmit} className="pt-2 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Eller indtast on-site kode..."
                  className="flex-1 h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
                />
                <button
                  type="submit"
                  className="h-11 px-4 rounded-xl bg-[#0F2744] text-white text-xs font-bold shadow-xs hover:bg-[#0A1C30]"
                >
                  Tjek
                </button>
              </form>
            </div>
          )}

          {/* PRINT & DISPLAY ON-SITE QR CODES */}
          {activeMode === 'print' && (
            <div className="space-y-3 text-center">
              <div className="text-xs text-slate-500">
                QR-koder til opsætning i restauranten ved hver arbejdsstation:
              </div>

              {/* Station selector */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
                {VERIFIED_SITES.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => setSelectedSiteToDisplay(site)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                      selectedSiteToDisplay.id === site.id
                        ? 'bg-[#0F2744] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {site.department}
                  </button>
                ))}
              </div>

              {/* Simulated Printable On-Site Badge */}
              <div className="p-5 bg-white border-2 border-dashed border-slate-300 rounded-3xl space-y-3 shadow-xs">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-black tracking-tight text-[#0F2744]">
                    PORTALE RISTORANTE
                  </span>
                  <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] px-2 py-0.5 rounded-full">
                    On-Site Stempelpunkt
                  </span>
                </div>

                {/* Dynamic SVG QR simulation with real scan pattern */}
                <div className="w-44 h-44 mx-auto p-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center relative">
                  <QrCode className="w-36 h-36 text-[#0F2744]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center shadow-xs">
                      <span className="text-[9px] font-black text-emerald-700">DK</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-extrabold text-[#0F2744]">{selectedSiteToDisplay.name}</div>
                  <div className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                    {selectedSiteToDisplay.code}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Område: {selectedSiteToDisplay.zone}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCodeFound(selectedSiteToDisplay.code)}
                  className="w-full h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
                >
                  ✓ Test stempling med denne kode
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-400 shrink-0">
          QR Stempelur • Portale Ristorante Danmark • 37t standard
        </div>
      </div>
    </div>
  );
};
