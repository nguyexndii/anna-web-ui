import React from 'react';
import { Send, Sliders, Activity } from 'lucide-react';

export default function OverviewTab({ realStats, onSwitchTab }) {
  const isOwner = realStats && realStats.guildsCount !== undefined;

  return (
    <main className="p-6 max-w-5xl space-y-6">
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">Tổng Quan Hệ Thống Quản Lý Bot</h2>
        <p className="text-xs text-discord-muted mt-1">Giám sát tổng thể hoạt động và phím tắt thao tác nhanh</p>
      </div>

      <div className={`grid grid-cols-1 ${isOwner ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-4`}>
        <div className="bg-discord-card p-4 rounded border border-[#383a40] space-y-1">
          <div className="text-xs text-discord-muted font-medium">Trạng thái Bot</div>
          <div className={`text-base font-bold font-mono ${realStats.isReady ? 'text-emerald-400' : 'text-rose-400'}`}>
            {realStats.isReady ? '🟢 HOẠT ĐỘNG' : '🔴 MẤT KẾT NỐI'}
          </div>
        </div>

        <div className="bg-discord-card p-4 rounded border border-[#383a40] space-y-1">
          <div className="text-xs text-discord-muted font-medium">Độ trễ API (Latency)</div>
          <div className="text-base font-bold text-white font-mono">
            {realStats.ping >= 0 ? `${realStats.ping} ms` : 'N/A'}
          </div>
        </div>

        {/* OWNER-ONLY STAT: Server Phục Vụ */}
        {isOwner && (
          <div className="bg-discord-card p-4 rounded border border-[#383a40] space-y-1">
            <div className="text-xs text-discord-muted font-medium">Server Phục Vụ (Owner Only)</div>
            <div className="text-base font-bold text-discord-accent font-mono">
              {realStats.guildsCount} Server
            </div>
          </div>
        )}

        <div className="bg-discord-card p-4 rounded border border-[#383a40] space-y-1">
          <div className="text-xs text-discord-muted font-medium">Tính năng Active</div>
          <div className="text-base font-bold text-amber-400 font-mono">
            {realStats.features ? (Object.values(realStats.features).filter(Boolean).length) : 0} Bật
          </div>
        </div>
      </div>

      <div className="bg-discord-card p-6 rounded border border-[#383a40] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-discord-muted">Phím Tắt Thao Tác Nhanh</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onSwitchTab('builder')}
            className="bg-discord-dark hover:bg-[#35373c] p-4 rounded border border-[#383a40] text-left transition cursor-pointer space-y-1 group"
          >
            <Send className="w-5 h-5 text-discord-accent group-hover:scale-110 transition" />
            <div className="text-xs font-bold text-white pt-1">Soạn Bài & Đăng Tin</div>
            <div className="text-[11px] text-discord-muted">Tạo tin nhắn văn bản thường hoặc Embed card</div>
          </button>

          <button
            onClick={() => onSwitchTab('features')}
            className="bg-discord-dark hover:bg-[#35373c] p-4 rounded border border-[#383a40] text-left transition cursor-pointer space-y-1 group"
          >
            <Sliders className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
            <div className="text-xs font-bold text-white pt-1">Cấu Hình Tính Năng</div>
            <div className="text-[11px] text-discord-muted">Bật/tắt các trò chơi Nối Từ, Sắp Xếp Từ</div>
          </button>

          <button
            onClick={() => onSwitchTab('analytics')}
            className="bg-discord-dark hover:bg-[#35373c] p-4 rounded border border-[#383a40] text-left transition cursor-pointer space-y-1 group"
          >
            <Activity className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
            <div className="text-xs font-bold text-white pt-1">Giám Sát Máy Chủ</div>
            <div className="text-[11px] text-discord-muted">Kiểm tra thông số Uptime và Ping thực tế</div>
          </button>
        </div>
      </div>
    </main>
  );
}
