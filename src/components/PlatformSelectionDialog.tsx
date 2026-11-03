import React, { useState } from 'react';
import { X, Check, Plus, AlertCircle } from 'lucide-react';

interface PlatformSelectionDialogProps {
  isOpen: boolean;
  selectedPlatforms: string[];
  customPlatformName: string;
  onClose: () => void;
  onSave: (platforms: string[], customName: string) => void;
}

const STANDARD_PLATFORMS = ['Discord', 'Telegram', 'X'];

export const PlatformSelectionDialog: React.FC<PlatformSelectionDialogProps> = ({
  isOpen,
  selectedPlatforms,
  customPlatformName,
  onClose,
  onSave,
}) => {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedPlatforms);
  const [includeOther, setIncludeOther] = useState<boolean>(() => {
    return selectedPlatforms.some((p) => !STANDARD_PLATFORMS.includes(p)) || !!customPlatformName;
  });
  const [tempCustomName, setTempCustomName] = useState<string>(() => {
    const custom = selectedPlatforms.find((p) => !STANDARD_PLATFORMS.includes(p));
    return custom || customPlatformName || '';
  });
  const [validationError, setValidationError] = useState<string>('');

  if (!isOpen) return null;

  const handleToggleStandard = (platform: string) => {
    setValidationError('');
    setTempSelected((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handleToggleOther = () => {
    setValidationError('');
    setIncludeOther((prev) => !prev);
  };

  const handleSave = () => {
    const finalPlatforms: string[] = [];

    // Add standard ones
    STANDARD_PLATFORMS.forEach((p) => {
      if (tempSelected.includes(p)) {
        finalPlatforms.push(p);
      }
    });

    // Add other if checked
    if (includeOther) {
      const trimmed = tempCustomName.trim();
      if (!trimmed) {
        setValidationError('Please enter a platform name for "Other" or uncheck it.');
        return;
      }
      if (!finalPlatforms.includes(trimmed)) {
        finalPlatforms.push(trimmed);
      }
    }

    if (finalPlatforms.length === 0) {
      setValidationError('Please select at least one platform to audit.');
      return;
    }

    onSave(finalPlatforms, tempCustomName.trim());
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="platform-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0D1016] border border-zinc-800 p-6 sm:p-7 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close platform selection dialog"
          className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-850 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dialog Header */}
        <div className="space-y-1.5">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#00FF87]">
            Platform Setup
          </div>
          <h2 id="platform-dialog-title" className="text-xl sm:text-2xl font-extrabold text-white">
            What platform(s) are you auditing?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Choose as many platforms as apply. You will be able to score each platform one by one and view both individual and cumulative scores.
          </p>
        </div>

        {/* Platform Choices */}
        <div className="space-y-2.5">
          {STANDARD_PLATFORMS.map((platform) => {
            const isChecked = tempSelected.includes(platform);
            return (
              <label
                key={platform}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition select-none ${
                  isChecked
                    ? 'bg-[#121720] border-[#00FF87]/50 text-white'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center transition shrink-0 ${
                      isChecked
                        ? 'bg-[#00FF87] text-zinc-950'
                        : 'border border-zinc-700 bg-zinc-900'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="font-semibold text-sm sm:text-base">{platform}</span>
                </div>
                <span className="text-xs text-zinc-500 font-mono">
                  {isChecked ? 'Selected' : 'Click to add'}
                </span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleStandard(platform)}
                  className="sr-only"
                />
              </label>
            );
          })}

          {/* Other Platform Option */}
          <div
            className={`p-3.5 rounded-xl border transition ${
              includeOther
                ? 'bg-[#121720] border-[#00FF87]/50 text-white'
                : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400'
            }`}
          >
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center transition shrink-0 ${
                    includeOther
                      ? 'bg-[#00FF87] text-zinc-950'
                      : 'border border-zinc-700 bg-zinc-900'
                  }`}
                >
                  {includeOther && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="font-semibold text-sm sm:text-base">Other Platform</span>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Custom</span>
              <input
                type="checkbox"
                checked={includeOther}
                onChange={handleToggleOther}
                className="sr-only"
              />
            </label>

            {includeOther && (
              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1.5">
                <label htmlFor="other-platform-input" className="block text-xs text-zinc-300 font-medium">
                  Enter custom platform name:
                </label>
                <input
                  id="other-platform-input"
                  type="text"
                  value={tempCustomName}
                  onChange={(e) => {
                    setTempCustomName(e.target.value);
                    setValidationError('');
                  }}
                  placeholder="e.g. Circle, Discourse, Slack, WhatsApp, Farcaster..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-[#00FF87] text-white text-sm outline-none transition"
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>

        {validationError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Dialog Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-850">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#00FF87] hover:bg-[#22ff95] text-zinc-950 transition cursor-pointer shadow-md"
          >
            Confirm Platforms
          </button>
        </div>
      </div>
    </div>
  );
};
