import React from 'react';
import { Sliders } from 'lucide-react';

export default function Features({ realStats, guildId, onOpenToggleConfirmModal }) {
  const features = realStats?.features || { wordchain: false, wordscramble: false };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
        <Sliders className="w-4 h-4 text-anna-accent" /> Cấu Hình Tính Năng Tự Động (Theo Server)
      </h2>
      
      <div className="bg-anna-card p-4 rounded-2xl border border-anna-border space-y-4">
        <div className="flex items-center justify-between border-b border-anna-border pb-3">
          <div>
            <div className="text-xs font-semibold text-white">Minigame Nối Từ (WordChain)</div>
            <div className="text-[11px] text-anna-muted">Tự động nhận diện từ nối và lưu điểm MongoDB</div>
          </div>
          <button
            type="button"
            onClick={() => onOpenToggleConfirmModal('wordchain', 'Minigame Nối Từ', !!features.wordchain)}
            className={`text-xs font-mono px-3 py-1 rounded-lg border transition cursor-pointer font-bold ${
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
            <div className="text-[11px] text-anna-muted">Đố xáo trộn chữ cái tiếng Việt trong kênh giải trí</div>
          </div>
          <button
            type="button"
            onClick={() => onOpenToggleConfirmModal('wordscramble', 'Minigame Sắp Xếp Từ', !!features.wordscramble)}
            className={`text-xs font-mono px-3 py-1 rounded-lg border transition cursor-pointer font-bold ${
              features.wordscramble
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'
            }`}
          >
            {features.wordscramble ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
          </button>
        </div>
      </div>
    </div>
  );
}
