import React from 'react';
import { AlertOctagon, Phone, X, HeartHandshake, ShieldCheck } from 'lucide-react';

interface RedFlagAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  specificAlert?: string;
}

export const RedFlagAlertModal: React.FC<RedFlagAlertModalProps> = ({
  isOpen,
  onClose,
  specificAlert
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-softCoral-300 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-plum-400 hover:text-plum-900 rounded-full hover:bg-cream-200 transition-colors"
          aria-label="Close safety alert"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-softCoral-500 mb-4">
          <div className="p-3 bg-softCoral-100 rounded-2xl">
            <AlertOctagon className="w-7 h-7 text-softCoral-500" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-plum-900 leading-tight">
              Health & Urgent Safety Guide
            </h2>
            <p className="text-xs text-softCoral-600 font-semibold uppercase tracking-wider">
              Priority Care • Stop & Check
            </p>
          </div>
        </div>

        {specificAlert && (
          <div className="p-3.5 bg-softCoral-50 border border-softCoral-300 rounded-2xl text-softCoral-700 text-sm font-medium mb-4">
            ⚠️ {specificAlert}
          </div>
        )}

        <div className="space-y-4 text-sm text-plum-800 leading-relaxed">
          <div className="bg-cream-100/80 p-4 rounded-2xl border border-cream-300">
            <h3 className="font-bold text-plum-900 mb-2 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-roseDust-500" />
              <span>When to Stop Exercising Immediately</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm text-plum-700">
              <li><strong>Chest pain or tightness</strong>, pressure or squeezing sensation.</li>
              <li><strong>Dizziness, lightheadedness, or feeling faint</strong>.</li>
              <li><strong>Severe or unusual breathlessness</strong> that does not ease when you slow down.</li>
              <li><strong>Sudden sharp joint, muscle, or abdominal pain</strong>.</li>
              <li><strong>Unusually heavy or alarming bleeding</strong> during your cycle.</li>
            </ul>
          </div>

          <div className="bg-roseDust-50/60 p-4 rounded-2xl border border-roseDust-200">
            <h3 className="font-bold text-plum-900 mb-2 flex items-center space-x-2">
              <Phone className="w-4 h-4 text-roseDust-600" />
              <span>Verified Emergency Contacts</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-roseDust-200 shadow-sm">
                <span className="block font-bold text-plum-900">National Emergency (India)</span>
                <a href="tel:112" className="text-roseDust-600 font-bold text-base hover:underline">
                  📞 112
                </a>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-roseDust-200 shadow-sm">
                <span className="block font-bold text-plum-900">Medical Ambulance</span>
                <a href="tel:108" className="text-roseDust-600 font-bold text-base hover:underline">
                  🚑 108 / 102
                </a>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-roseDust-200 shadow-sm">
                <span className="block font-bold text-plum-900">Tele-MANAS (Govt Wellness)</span>
                <a href="tel:14416" className="text-plum-800 font-bold text-sm hover:underline">
                  🌿 14416 / 1800-891-4416
                </a>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-roseDust-200 shadow-sm">
                <span className="block font-bold text-plum-900">Vandrevala Support</span>
                <a href="tel:9999666555" className="text-plum-800 font-bold text-sm hover:underline">
                  🤍 9999 666 555
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2 p-3 bg-cream-200/50 rounded-2xl text-xs text-plum-600">
            <HeartHandshake className="w-4 h-4 text-roseDust-500 shrink-0 mt-0.5" />
            <p>
              Deep's Magical Journey is your supportive wellness companion, not a replacement for a doctor. If you have chronic conditions, medication, or unusual symptoms, always consult your physician.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-plum-900 hover:bg-plum-950 text-white rounded-2xl font-semibold transition-all shadow-soft"
          >
            I Understand — Return to App
          </button>
        </div>
      </div>
    </div>
  );
};
