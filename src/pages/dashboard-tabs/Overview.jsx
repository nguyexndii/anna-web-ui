import React from 'react';
import { Send, Sliders, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Overview({ realStats, guildId }) {
  const navigate = useNavigate();
  const isOwner = realStats && realStats.guildsCount !== undefined;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">Tổng Quan Máy Chủ</h2>
        <p className="text-xs text-anna-muted mt-1">Giám sát tổng thể hoạt động và phím tắt thao tác nhanh</p>
      </div>

      <div className={`grid grid-cols-1 ${isOwner ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-4`}>
        <div className="bg-anna-card p-4 rounded-xl border border-anna-border space-y-1">
          <div className="text-xs text-anna-muted font-medium">Trạng thái Bot</div>
          <div className={`text-base font-bold font-mono ${realStats.isReady ? 'text-emerald-400' : 'text-rose-400'}`}>
            {realStats.isReady ? '🟢 HOẠT ĐỘNG' : '🔴 MẤT KẾT NỐI'}
          </div>
        </div>

        <div className="bg-anna-card p-4 rounded-xl border border-anna-border space-y-1">
          <div className="text-xs text-anna-muted font-medium">Độ trễ API (Latency)</div>
          <div className="text-base font-bold text-white font-mono">
            {realStats.ping >= 0 ? `${realStats.ping} ms` : 'N/A'}
          </div>
        </div>

        {/* OWNER-ONLY STAT: Server Phục Vụ */}
        {isOwner && (
          <div className="bg-anna-card p-4 rounded-xl border border-anna-border space-y-1">
            <div className="text-xs text-anna-muted font-medium">Server Phục Vụ (Owner Only)</div>
            <div className="text-base font-bold text-anna-accent font-mono">
              {realStats.guildsCount} Server
            </div>
          </div>
        )}

        <div className="bg-anna-card p-4 rounded-xl border border-anna-border space-y-1">
          <div className="text-xs text-anna-muted font-medium">Tính năng Active</div>
          <div className="text-base font-bold text-amber-400 font-mono">
            {realStats.features ? (Object.values(realStats.features).filter(Boolean).length) : 0} Bật
          </div>
        </div>
      </div>

      <div className="bg-anna-card p-6 rounded-2xl border border-anna-border space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-anna-muted">Phím Tắt Thao Tác Nhanh</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate(`/servers/${guildId}/builder`)}
            className="bg-anna-dark hover:bg-slate-800 p-4 rounded-xl border border-anna-border text-left transition cursor-pointer space-y-1 group"
          >
            <Send className="w-5 h-5 text-anna-accent group-hover:scale-110 transition" />
            <div className="text-xs font-bold text-white pt-1">Soạn Bài & Đăng Tin</div>
            <div className="text-[11px] text-anna-muted">Tạo tin nhắn văn bản thường hoặc Embed card</div>
          </button>

          <button
            onClick={() => navigate(`/servers/${guildId}/features`)}
            className="bg-anna-dark hover:bg-slate-800 p-4 rounded-xl border border-anna-border text-left transition cursor-pointer space-y-1 group"
          >
            <Sliders className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
            <div className="text-xs font-bold text-white pt-1">Cấu Hình Tính Năng</div>
            <div className="text-[11px] text-anna-muted">Bật/tắt các trò chơi Nối Từ, Sắp Xếp Từ</div>
          </button>

          <button
            onClick={() => navigate(`/servers/${guildId}/analytics`)}
            className="bg-anna-dark hover:bg-slate-800 p-4 rounded-xl border border-anna-border text-left transition cursor-pointer space-y-1 group"
          >
            <Activity className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
            <div className="text-xs font-bold text-white pt-1">Giám Sát Máy Chủ</div>
            <div className="text-[11px] text-anna-muted">Kiểm tra thông số Uptime và Ping thực tế</div>
          </button>
        </div>
      </div>
    </div>
  );
}
