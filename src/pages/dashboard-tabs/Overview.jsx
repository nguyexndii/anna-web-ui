import React from 'react';
import { Send, Sliders, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Overview({ realStats, guildId }) {
  const navigate = useNavigate();
  const isOwner = realStats && realStats.guildsCount !== undefined;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Tổng Quan Máy Chủ</h2>
        <p className="text-sm text-anna-muted font-medium mt-1">Giám sát tổng thể hoạt động và phím tắt thao tác nhanh</p>
      </div>

      {/* STAT CARDS WITH VISUAL HIERARCHY */}
      <div className={`grid grid-cols-1 ${isOwner ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-6`}>
        
        {/* PRIMARY HERO STAT CARD: BOT STATUS */}
        <div className={`p-6 rounded-2xl border transition shadow-xl space-y-2 relative overflow-hidden ${
          realStats.isReady
            ? 'bg-gradient-to-br from-emerald-500/10 via-anna-card to-anna-card border-emerald-500/30 ring-1 ring-emerald-500/20'
            : 'bg-gradient-to-br from-rose-500/10 via-anna-card to-anna-card border-rose-500/30 ring-1 ring-rose-500/20'
        }`}>
          <div className="text-xs uppercase tracking-wider text-anna-muted font-bold">Trạng Thái Bot</div>
          <div className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 ${realStats.isReady ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span className={`w-3 h-3 rounded-full ${realStats.isReady ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
            <span>{realStats.isReady ? 'HOẠT ĐỘNG' : 'MẤT KẾT NỐI'}</span>
          </div>
          <div className="text-xs text-anna-muted font-normal">Kết nối Discord Gateway</div>
        </div>

        {/* SECONDARY STAT CARD: LATENCY */}
        <div className="bg-anna-card p-6 rounded-2xl border border-anna-border space-y-2 shadow-lg">
          <div className="text-xs uppercase tracking-wider text-anna-muted font-bold">Độ Trễ API (Latency)</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            <span className="font-mono">{realStats.ping >= 0 ? realStats.ping : 'N/A'}</span>
            <span className="text-sm text-anna-muted font-normal ml-1">ms</span>
          </div>
          <div className="text-xs text-anna-muted font-normal">WebSocket Realtime</div>
        </div>

        {/* OWNER-ONLY STAT CARD: SERVER COUNT */}
        {isOwner && (
          <div className="bg-anna-card p-6 rounded-2xl border border-anna-border space-y-2 shadow-lg">
            <div className="text-xs uppercase tracking-wider text-anna-muted font-bold">Server Phục Vụ (Owner Only)</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
              <span className="font-mono">{realStats.guildsCount}</span>
              <span className="text-sm text-anna-muted font-normal ml-1">Server</span>
            </div>
            <div className="text-xs text-anna-muted font-normal">Toàn hệ thống</div>
          </div>
        )}

        {/* SECONDARY STAT CARD: ACTIVE FEATURES */}
        <div className="bg-anna-card p-6 rounded-2xl border border-anna-border space-y-2 shadow-lg">
          <div className="text-xs uppercase tracking-wider text-anna-muted font-bold">Tính Năng Active</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
            <span className="font-mono">{realStats.features ? (Object.values(realStats.features).filter(Boolean).length) : 0}</span>
            <span className="text-sm text-anna-muted font-normal ml-1">Bật</span>
          </div>
          <div className="text-xs text-anna-muted font-normal">Tự động hóa server</div>
        </div>

      </div>

      {/* QUICK SHORTCUT CARDS */}
      <div className="bg-anna-card p-7 rounded-2xl border border-anna-border space-y-5 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-anna-muted">Phím Tắt Thao Tác Nhanh</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            onClick={() => navigate(`/servers/${guildId}/builder`)}
            className="bg-anna-dark hover:bg-anna-cardHover p-6 rounded-2xl border border-anna-border text-left transition duration-200 cursor-pointer space-y-2 group shadow-md"
          >
            <Send className="w-7 h-7 text-indigo-400 group-hover:scale-110 transition duration-200" />
            <div className="text-base font-bold text-white pt-1">Soạn Bài & Đăng Tin</div>
            <div className="text-xs text-anna-muted font-normal leading-relaxed">Tạo tin nhắn văn bản thường hoặc Embed card</div>
          </button>

          <button
            onClick={() => navigate(`/servers/${guildId}/features`)}
            className="bg-anna-dark hover:bg-anna-cardHover p-6 rounded-2xl border border-anna-border text-left transition duration-200 cursor-pointer space-y-2 group shadow-md"
          >
            <Sliders className="w-7 h-7 text-amber-400 group-hover:scale-110 transition duration-200" />
            <div className="text-base font-bold text-white pt-1">Cấu Hình Tính Năng</div>
            <div className="text-xs text-anna-muted font-normal leading-relaxed">Bật/tắt các trò chơi Nối Từ, Sắp Xếp Từ</div>
          </button>

          <button
            onClick={() => navigate(`/servers/${guildId}/analytics`)}
            className="bg-anna-dark hover:bg-anna-cardHover p-6 rounded-2xl border border-anna-border text-left transition duration-200 cursor-pointer space-y-2 group shadow-md"
          >
            <Activity className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition duration-200" />
            <div className="text-base font-bold text-white pt-1">Giám Sát Máy Chủ</div>
            <div className="text-xs text-anna-muted font-normal leading-relaxed">Kiểm tra thông số Uptime và Ping thực tế</div>
          </button>
        </div>
      </div>
    </div>
  );
}
