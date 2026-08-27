import React from 'react';
import { Sliders } from 'lucide-react';

export default function FeaturesTab({ realStats, selectedGuildId, onOpenToggleConfirmModal }) {
  const features = realStats?.features || { wordchain: false, wordscramble: false };

  return (
    <main className="p-6 max-w-4xl space-y-4">
      <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
        <Sliders className="w-4 h-4 text-discord-accent" /> Cấu Hình Tính Năng Tự Động (Theo Server)
      </h2>
      
      <div className="bg-discord-card p-4 rounded border border-[#383a40] space-y-4">
        <div className="flex items-center justify-between border-b border-[#383a40] pb-3">
          <div>
            <div className="text-xs font-semibold text-white">Minigame Nối Từ (WordChain)</div>
            <div className="text-[11px] text-discord-muted">Tự động nhận diện từ nối và lưu điểm MongoDB</div>
          </div>
          <button
            type="button"
            onClick={() => onOpenToggleConfirmModal('wordchain', 'Minigame Nối Từ', !!features.wordchain)}
            className={`text-xs font-mono px-3 py-1 rounded border transition cursor-pointer font-bold ${
              features.wordchain
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'
            }`}
          >
            {features.wordchain ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white">Minigame Sắp Xếp Từ (WordScramble)</div>
            <div className="text-[11px] text-discord-muted">Đố xáo trộn chữ cái tiếng Việt trong kênh giải trí</div>
          </div>
          <button
            type="button"
            onClick={() => onOpenToggleConfirmModal('wordscramble', 'Minigame Sắp Xếp Từ', !!features.wordscramble)}
            className={`text-xs font-mono px-3 py-1 rounded border transition cursor-pointer font-bold ${
              features.wordscramble
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'
            }`}
          >
            {features.wordscramble ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
          </button>
        </div>
      </div>
    </main>
  );
}
