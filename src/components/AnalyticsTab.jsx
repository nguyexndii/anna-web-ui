import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';

export default function AnalyticsTab({ realStats, isRefreshingStats, statsLoading, onRefreshStats }) {
  const isOwner = realStats && realStats.guildsCount !== undefined;

  return (
    <main className="p-6 max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-discord-accent" /> Giám Sát Máy Chủ & System Health
        </h2>
        <button
          onClick={onRefreshStats}
          disabled={isRefreshingStats || statsLoading}
          className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded border transition cursor-pointer font-medium ${
            isRefreshingStats
              ? 'bg-discord-accent text-white border-transparent'
              : 'bg-discord-card text-discord-text border-[#383a40] hover:bg-discord-cardHover'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingStats || statsLoading ? 'animate-spin' : ''}`} />
          <span>{isRefreshingStats ? 'Đang đồng bộ dữ liệu...' : 'Tải lại dữ liệu'}</span>
        </button>
      </div>

      <div className={`grid grid-cols-1 ${isOwner ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
        <div className="bg-discord-card p-4 rounded border border-[#383a40] space-y-1">
          <div className="text-xs text-discord-muted font-medium">Kết nối Discord Gateway</div>
          <div className={`text-base font-bold font-mono ${realStats.isReady ? 'text-emerald-400' : 'text-rose-400'}`}>
            {realStats.isReady ? 'ONLINE 🟢' : 'OFFLINE 🔴'}
          </div>
          <div className="text-[10px] text-discord-muted">Trạng thái máy chủ Discord</div>
        </div>

        <div className="bg-discord-card p-4 rounded border border-[#383a40] space-y-1">
          <div className="text-xs text-discord-muted font-medium">Độ trễ API (Latency)</div>
          <div className="text-base font-bold text-white font-mono">
            {realStats.ping >= 0 ? `${realStats.ping} ms` : 'N/A'}
          </div>
          <div className="text-[10px] text-discord-muted">Đo trực tiếp qua WebSocket</div>
        </div>

        {isOwner && (
          <div className="bg-discord-card p-4 rounded border border-[#383a40] space-y-1">
            <div className="text-xs text-discord-muted font-medium">Số Server đang phục vụ</div>
            <div className="text-base font-bold text-discord-accent font-mono">
              {realStats.guildsCount} Server
            </div>
            <div className="text-[10px] text-discord-muted">Số lượng máy chủ active</div>
          </div>
        )}
      </div>

      <div className="bg-discord-card p-4 rounded border border-[#383a40] space-y-2">
        <div className="text-xs font-bold text-white">Thời gian hoạt động liên tục (Uptime):</div>
        <div className="text-sm font-mono text-emerald-400">{realStats.uptime}</div>
      </div>
    </main>
  );
}
