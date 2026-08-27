import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function Analytics({ realStats, isRefreshingStats, statsLoading, onRefreshStats }) {
  const isOwner = realStats && realStats.guildsCount !== undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Giám Sát Máy Chủ</h2>
          <p className="text-sm text-anna-muted font-medium mt-1">Thông số độ trễ API và thời gian hoạt động hệ thống real-time</p>
        </div>

        <button
          onClick={onRefreshStats}
          disabled={isRefreshingStats || statsLoading}
          className={`text-xs flex items-center gap-2 px-4 py-2.5 rounded-xl border transition cursor-pointer font-bold ${
            isRefreshingStats
              ? 'bg-anna-accent text-white border-transparent shadow-md'
              : 'bg-anna-card text-anna-text border-anna-border hover:bg-anna-cardHover shadow-sm'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshingStats || statsLoading ? 'animate-spin' : ''}`} />
          <span>{isRefreshingStats ? 'Đang đồng bộ dữ liệu...' : 'Tải lại dữ liệu'}</span>
        </button>
      </div>

      <div className={`grid grid-cols-1 ${isOwner ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-6`}>
        
        {/* GATEWAY STATUS */}
        <div className="bg-anna-card p-6 rounded-2xl border border-anna-border space-y-2 shadow-lg">
          <div className="text-xs uppercase tracking-wider text-anna-muted font-bold">Kết nối Discord Gateway</div>
          <div className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 ${realStats.isReady ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span className={`w-3 h-3 rounded-full ${realStats.isReady ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
            <span>{realStats.isReady ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
          <div className="text-xs text-anna-muted font-normal">Trạng thái máy chủ Discord</div>
        </div>

        {/* LATENCY */}
        <div className="bg-anna-card p-6 rounded-2xl border border-anna-border space-y-2 shadow-lg">
          <div className="text-xs uppercase tracking-wider text-anna-muted font-bold">Độ Trễ API (Latency)</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            <span className="font-mono">{realStats.ping >= 0 ? realStats.ping : 'N/A'}</span>
            <span className="text-sm text-anna-muted font-normal ml-1">ms</span>
          </div>
          <div className="text-xs text-anna-muted font-normal">Đo trực tiếp qua WebSocket</div>
        </div>

        {/* OWNER SERVER COUNT */}
        {isOwner && (
          <div className="bg-anna-card p-6 rounded-2xl border border-anna-border space-y-2 shadow-lg">
            <div className="text-xs uppercase tracking-wider text-anna-muted font-bold">Số Server Đang Phục Vụ</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
              <span className="font-mono">{realStats.guildsCount}</span>
              <span className="text-sm text-anna-muted font-normal ml-1">Server</span>
            </div>
            <div className="text-xs text-anna-muted font-normal">Số lượng máy chủ active</div>
          </div>
        )}
      </div>

      <div className="bg-anna-card p-6 rounded-2xl border border-anna-border space-y-2 shadow-xl">
        <div className="text-xs uppercase tracking-wider text-anna-muted font-bold">Thời Gian Hoạt Động Liên Tục (Uptime):</div>
        <div className="text-lg sm:text-xl font-mono font-bold text-emerald-400">{realStats.uptime}</div>
      </div>
    </div>
  );
}
