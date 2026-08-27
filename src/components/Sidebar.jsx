import React from 'react';
import { Hash, Home, Send, Sliders, Activity, ChevronDown, LogOut, ShieldCheck, Server } from 'lucide-react';

export default function Sidebar({
  activeTab,
  onSelectTab,
  activeGuildObj,
  realStats,
  user,
  userMenuOpen,
  setUserMenuOpen,
  onOpenLogoutModal,
  userMenuRef
}) {
  const isBotOnline = realStats && realStats.isReady;

  return (
    <aside className="w-60 bg-discord-sidebar flex-shrink-0 flex flex-col justify-between h-screen border-r border-[#232428] select-none">
      
      {/* Server / App Header */}
      <div className="h-12 border-b border-[#1f2023] px-4 flex items-center justify-between font-bold text-white text-sm shadow-sm">
        <div className="flex items-center space-x-2 truncate">
          <Server className="w-4 h-4 text-discord-accent flex-shrink-0" />
          <span className="truncate">{activeGuildObj ? activeGuildObj.name : 'Anna Manager'}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-discord-muted flex-shrink-0 ml-1" />
      </div>

      {/* Navigation Channels List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        
        {/* Category 1: TỔNG QUAN & SOẠN BÀI */}
        <div className="space-y-0.5">
          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-discord-muted">
            Kênh Quản Lý
          </div>

          <button
            onClick={() => onSelectTab('overview')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-discord-cardHover text-white font-semibold'
                : 'text-discord-muted hover:bg-[#35373c]/50 hover:text-discord-text'
            }`}
          >
            <Hash className="w-4 h-4 text-discord-muted" />
            <span>tong-quan-he-thong</span>
          </button>

          <button
            onClick={() => onSelectTab('builder')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-discord-cardHover text-white font-semibold'
                : 'text-discord-muted hover:bg-[#35373c]/50 hover:text-discord-text'
            }`}
          >
            <Hash className="w-4 h-4 text-discord-muted" />
            <span>soan-bai-dang-tin</span>
          </button>
        </div>

        {/* Category 2: CẤU HÌNH & GIÁM SÁT */}
        <div className="space-y-0.5">
          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-discord-muted">
            Cấu Hình & Hệ Thống
          </div>

          <button
            onClick={() => onSelectTab('features')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
              activeTab === 'features'
                ? 'bg-discord-cardHover text-white font-semibold'
                : 'text-discord-muted hover:bg-[#35373c]/50 hover:text-discord-text'
            }`}
          >
            <Hash className="w-4 h-4 text-discord-muted" />
            <span>cau-hinh-tinh-nang</span>
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-discord-cardHover text-white font-semibold'
                : 'text-discord-muted hover:bg-[#35373c]/50 hover:text-discord-text'
            }`}
          >
            <Hash className="w-4 h-4 text-discord-muted" />
            <span>giam-sat-may-chu</span>
          </button>
        </div>

      </div>

      {/* Bottom User Bar (Discord Bottom Left Profile Bar) */}
      <div className="bg-[#232428] p-2 flex items-center justify-between border-t border-[#1f2023] relative" ref={userMenuRef}>
        
        {/* User Avatar & Info */}
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center space-x-2 p-1 rounded hover:bg-discord-cardHover transition cursor-pointer truncate flex-1"
        >
          <div className="relative flex-shrink-0">
            <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-discord-accent" />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#232428] ${
                isBotOnline ? 'bg-discord-green' : 'bg-discord-gray'
              }`}
              title={isBotOnline ? 'Bot Online 🟢' : 'Bot Offline 🔴'}
            ></span>
          </div>

          <div className="truncate text-left leading-tight">
            <div className="text-xs font-bold text-white truncate flex items-center gap-1">
              {user.globalName || user.username}
              {user.isOwner && <ShieldCheck className="w-3 h-3 text-emerald-400" title="Bot Owner" />}
            </div>
            <div className="text-[10px] text-discord-muted truncate">@{user.username}</div>
          </div>
        </button>

        {/* User Logout Menu Dropdown */}
        {userMenuOpen && (
          <div className="absolute bottom-14 left-2 right-2 bg-discord-card border border-[#383a40] rounded shadow-2xl py-1.5 z-50 text-left space-y-1 animate-in fade-in duration-100">
            <div className="px-3 py-1.5 border-b border-[#383a40]">
              <div className="text-xs font-bold text-white truncate">{user.globalName || user.username}</div>
              <div className="text-[10px] text-discord-muted truncate">@{user.username}</div>
            </div>

            <button
              onClick={() => { setUserMenuOpen(false); onOpenLogoutModal(); }}
              className="w-full px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        )}

      </div>

    </aside>
  );
}
