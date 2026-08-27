import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({ user, onLogin, onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-anna-card border-b border-anna-border sticky top-0 z-40 px-6 py-3 select-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-anna-accent to-anna-purple flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-200">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight block leading-none">
              Anna Bot
            </span>
            <span className="text-[11px] text-anna-muted font-medium">Dashboard Quản Lý</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 text-xs font-semibold">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-lg transition ${
              isActive('/') && location.pathname === '/'
                ? 'bg-anna-border text-white'
                : 'text-anna-muted hover:text-white hover:bg-anna-card'
            }`}
          >
            Trang Chủ
          </Link>

          <Link
            to="/invite"
            className={`px-3.5 py-2 rounded-lg transition ${
              isActive('/invite')
                ? 'bg-anna-border text-white'
                : 'text-anna-muted hover:text-white hover:bg-anna-card'
            }`}
          >
            Mời Bot Vào Server
          </Link>

          <Link
            to="/servers"
            className={`px-3.5 py-2 rounded-lg transition ${
              isActive('/servers')
                ? 'bg-anna-border text-white'
                : 'text-anna-muted hover:text-white hover:bg-anna-card'
            }`}
          >
            Quản Lý Server
          </Link>
        </nav>

        {/* Right User Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <Link
                to="/servers"
                className="flex items-center space-x-2 bg-anna-border hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-600 transition cursor-pointer text-xs font-semibold text-white"
              >
                <img src={user.avatar} alt="avatar" className="w-5 h-5 rounded-full border border-anna-accent" />
                <span className="truncate max-w-[100px]">{user.globalName || user.username}</span>
                {user.isOwner && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Bot Owner" />}
              </Link>

              <button
                onClick={onLogout}
                className="p-2 text-anna-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="bg-anna-accent hover:bg-anna-hover text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow cursor-pointer"
            >
              Vào Dashboard
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
