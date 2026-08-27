import React from 'react';
import { Hash, Activity } from 'lucide-react';

export default function TopBar({ activeTab, realStats }) {
  const tabTitles = {
    overview: 'tong-quan-he-thong',
    builder: 'soan-bai-dang-tin',
    features: 'cau-hinh-tinh-nang',
    analytics: 'giam-sat-may-chu'
  };

  const currentTabTitle = tabTitles[activeTab] || 'general';
  const isOnline = realStats && realStats.isReady;

  return (
    <header className="h-12 bg-discord-dark border-b border-[#1f2023] px-4 flex items-center justify-between sticky top-0 z-40 select-none shadow-sm">
      
      {/* Left: Discord Channel Title */}
      <div className="flex items-center space-x-2 text-white font-bold text-sm">
        <Hash className="w-5 h-5 text-discord-muted" />
        <span>{currentTabTitle}</span>
      </div>

      {/* Right: Real Gateway Status & Ping */}
      <div className="flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-1.5 font-mono text-[11px] bg-discord-card px-2.5 py-1 rounded border border-[#383a40]">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-discord-green animate-pulse' : 'bg-discord-gray'}`}></span>
          <span className="text-discord-text">{isOnline ? 'Gateway Online' : 'Gateway Offline'}</span>
        </div>

        <div className="flex items-center space-x-1 font-mono text-[11px] bg-discord-card px-2.5 py-1 rounded border border-[#383a40] text-discord-text">
          <Activity className="w-3.5 h-3.5 text-discord-accent" />
          <span>{realStats && realStats.ping >= 0 ? `${realStats.ping} ms` : 'N/A'}</span>
        </div>
      </div>

    </header>
  );
}
