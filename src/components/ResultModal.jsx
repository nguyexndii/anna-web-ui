import React from 'react';

export default function ResultModal({ resultModal, onClose }) {
  if (!resultModal.open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-discord-card border border-[#383a40] rounded-lg max-w-sm w-full p-6 text-center space-y-4 shadow-2xl"
      >
        <div>
          <h3 className={`text-base font-bold ${resultModal.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {resultModal.title}
          </h3>
          <p className="text-xs text-discord-text mt-2 leading-relaxed">{resultModal.message}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-discord-accent hover:bg-discord-hover text-white text-xs font-semibold py-2 rounded transition cursor-pointer shadow"
        >
          Đóng thông báo
        </button>
      </div>
    </div>
  );
}
