import React, { useState } from 'react';
import {
  X,
  Smartphone,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Download,
  CheckCircle2,
  Sparkles,
  Info,
  Apple,
} from 'lucide-react';

interface PhoneInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneInstallModal: React.FC<PhoneInstallModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios'>('android');

  if (!isOpen) return null;

  // Retrieve current active URL or the deployed preview
  const currentUrl = typeof window !== 'undefined' && window.location.href.startsWith('http')
    ? window.location.href
    : 'https://ais-pre-ga7dqsxn6scy3jmwkkxvmq-149838347698.europe-west2.run.app';

  // High-resolution QR code generator URL
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    currentUrl
  )}&margin=10&color=0F2744&bgcolor=FFFFFF`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenLink = () => {
    window.open(currentUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="bg-[#0F2744] text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white p-1 border border-white/20 shadow-sm shrink-0">
              <img
                src="/src/assets/images/restaurant_logo_1794344925528.jpg"
                alt="Portale Ristorante"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#10B981] text-white px-2 py-0.5 rounded-full">
                  PWA Mobile
                </span>
                <span className="text-xs text-slate-300">Portale Ristorante</span>
              </div>
              <h2 className="text-lg font-black text-white tracking-tight mt-0.5">
                Scarica l'App sul tuo Telefono
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors relative z-10"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* QR Code Presentation Box */}
          <div className="bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF] border border-slate-200 rounded-3xl p-5 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#0F2744] shadow-xs mb-3">
              <QrCode className="w-4 h-4 text-[#10B981]" />
              <span>Inquadra con la Fotocamera dello Smartphone</span>
            </div>

            {/* QR Code Container */}
            <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-slate-100 relative group">
              <img
                src={qrApiUrl}
                alt="QR Code per scaricare l'app Portale Ristorante"
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl"
                loading="eager"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md border border-slate-200 flex items-center justify-center">
                  <img
                    src="/src/assets/images/restaurant_logo_1794344925528.jpg"
                    alt="Logo Portale Ristorante"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2.5 max-w-xs">
              Punta la fotocamera del tuo telefono sul codice QR per aprire istantaneamente l'app.
            </p>

            {/* Direct Copy & Open Link Actions */}
            <div className="flex flex-wrap gap-2 mt-3.5 w-full justify-center">
              <button
                onClick={handleCopyLink}
                className="h-10 px-4 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-[#0F2744] hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span className="text-[#065F46]">Link Copiato negli Appunti!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copia Link per Telefono</span>
                  </>
                )}
              </button>

              <button
                onClick={handleOpenLink}
                className="h-10 px-4 rounded-xl bg-[#0F2744] hover:bg-[#0A1C30] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span>Apri in nuova scheda</span>
              </button>
            </div>
          </div>

          {/* Installation Instructions Guide */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Guida all'installazione su Smartphone:
              </h3>

              {/* Android / iOS Switcher */}
              <div className="bg-[#F1F5F9] p-0.5 rounded-xl flex gap-0.5">
                <button
                  onClick={() => setActivePlatform('android')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activePlatform === 'android'
                      ? 'bg-white text-[#0F2744] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Android</span>
                </button>
                <button
                  onClick={() => setActivePlatform('ios')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activePlatform === 'ios'
                      ? 'bg-white text-[#0F2744] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Apple className="w-3.5 h-3.5 text-slate-800" />
                  <span>iPhone / iPad</span>
                </button>
              </div>
            </div>

            {/* Platform Instructions Details */}
            {activePlatform === 'android' ? (
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#10B981] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F2744]">Inquadra il QR Code</h4>
                    <p className="text-[11px] text-slate-600">
                      Apri la fotocamera di Android, inquadra il codice QR qui sopra e tocca il banner per aprire in <strong>Google Chrome</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#10B981] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F2744]">Apri il Menu di Chrome</h4>
                    <p className="text-[11px] text-slate-600">
                      Tocca l'icona con i <strong>tre puntini verticali (⋮)</strong> nell'angolo in alto a destra.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#10B981] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F2744]">Seleziona "Installa app" o "Aggiungi a Home"</h4>
                    <p className="text-[11px] text-slate-600">
                      Tocca l'opzione <strong>"Installa app"</strong> (oppure <strong>"Aggiungi a schermata Home"</strong>).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#10B981] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F2744]">Pronto! Icona creata</h4>
                    <p className="text-[11px] text-slate-600">
                      Troverai l'icona ufficiale di <strong>Portale Ristorante</strong> sulla tua schermata principale. Si aprirà a schermo intero come una vera app nativa!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0F2744] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F2744]">Inquadra con la Fotocamera iPhone</h4>
                    <p className="text-[11px] text-slate-600">
                      Punta la fotocamera dell'iPhone sul QR Code e tocca il banner giallo per aprire il link in <strong>Safari</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0F2744] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F2744]">Tocca il pulsante "Condividi" [↑]</h4>
                    <p className="text-[11px] text-slate-600">
                      In basso al centro dello schermo di Safari, tocca l'icona di condivisione (il quadrato con la freccia rivolta verso l'alto).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0F2744] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F2744]">Tocca "Aggiungi alla schermata Home"</h4>
                    <p className="text-[11px] text-slate-600">
                      Scorri verso il basso nel menu e seleziona <strong>"Aggiungi alla schermata Home"</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0F2744] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F2744]">Conferma toccando "Aggiungi"</h4>
                    <p className="text-[11px] text-slate-600">
                      Tocca <strong>"Aggiungi"</strong> in alto a destra. L'icona di Portale Ristorante sarà disponibile tra le tue app come se fosse scaricata dall'App Store!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Value Props & Benefits Box */}
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-[#065F46]">
            <Sparkles className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">Vantaggi dell'installazione su Smartphone:</span>
              <p className="text-[11px] text-[#065F46]/90 leading-relaxed">
                Nessun download pesante da store, avvio istantaneo a schermo intero, notifiche per i turni di servizio e timbratura rapida con un tocco.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#0F2744] text-white text-xs font-bold hover:bg-[#0A1C30] transition-colors"
          >
            Ho capito, Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
