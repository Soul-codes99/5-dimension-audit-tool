import React from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';
import { BRAND_NAME, BRAND_LOGO } from '../utils/auditLogic';

export const PersonalCTA: React.FC = () => {
  return (
    <footer className="pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-850 bg-[#0C0E12]">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Call to Action Box: Solid, clean, authoritative card */}
        <div className="relative rounded-3xl p-7 sm:p-10 border border-zinc-800 bg-[#12161D] shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Need something more advanced?
              </h2>

              <p className="text-base text-zinc-300 font-medium leading-relaxed italic">
                &ldquo;Doesn&apos;t have to be so complicated.{" "}
                <br className="hidden sm:inline" />
                If you want more advanced automated community services, reach out to me.&rdquo;
              </p>
            </div>

            {/* Clickable email button */}
            <div className="shrink-0">
              <a
                href="mailto:Segunpaul99@gmail.com"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-900 border border-purple-500/40 hover:border-[#00FF87] text-white hover:text-[#00FF87] font-semibold text-sm sm:text-base transition shadow-sm group"
              >
                <div className="p-2 rounded-xl bg-purple-950/60 group-hover:bg-[#00FF87]/15 text-purple-400 group-hover:text-[#00FF87] transition">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Segunpaul99@gmail.com</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00FF87] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Small Footer with SOŪL 魂 attribution */}
        <div className="text-center text-xs text-zinc-400 tracking-wide font-medium">
          The 5-Dimension Community Audit Tool | By {BRAND_NAME} ({BRAND_LOGO})
        </div>
      </div>
    </footer>
  );
};
