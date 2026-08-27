import React from 'react';

export default function Features({ realStats, guildId, onOpenToggleConfirmModal }) {
  const features = realStats?.features || { wordchain: false, wordscramble: false };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Cấu Hình Tính Năng Tự Động</h2>
        <p className="text-sm text-anna-muted font-medium mt-1">Bật/tắt các minigame tự động được áp dụng riêng cho Server này</p>
      </div>
      
      <div className="bg-anna-card p-7 rounded-2xl border border-anna-border space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-anna-border pb-5">
          <div className="space-y-1">
            <div className="text-base font-bold text-white">Minigame Nối Từ (WordChain)</div>
            <div className="text-xs text-anna-muted font-normal">Tự động nhận diện từ nối và lưu điểm trên MongoDB</div>
          </div>
          <button
            type="button"
            onClick={() => onOpenToggleConfirmModal('wordchain', 'Minigame Nối Từ', !!features.wordchain)}
            className={`text-xs px-4 py-2 rounded-xl border transition cursor-pointer font-bold ${
              features.wordchain
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 shadow-md'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30 shadow-md'
            }`}
          >
            {features.wordchain ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-base font-bold text-white">Minigame Sắp Xếp Từ (WordScramble)</div>
            <div className="text-xs text-anna-muted font-normal">Đố xáo trộn chữ cái tiếng Việt trong kênh giải trí</div>
          </div>
          <button
            type="button"
            onClick={() => onOpenToggleConfirmModal('wordscramble', 'Minigame Sắp Xếp Từ', !!features.wordscramble)}
            className={`text-xs px-4 py-2 rounded-xl border transition cursor-pointer font-bold ${
              features.wordscramble
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 shadow-md'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30 shadow-md'
            }`}
          >
            {features.wordscramble ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
          </button>
        </div>
      </div>
    </div>
  );
}
