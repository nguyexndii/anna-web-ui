import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Plus, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({ user, onLogin, onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-anna-card/80 backdrop-blur-md border-b border-anna-border sticky top-0 z-40 px-6 py-3 select-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-anna-accent to-anna-purple flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-200">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight block leading-none">
              Anna Manager
            </span>
            <span className="text-[11px] text-anna-muted font-medium">Discord Bot Suite</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 text-xs font-semibold">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg transition ${
              isActive('/') && location.pathname === '/'
                ? 'bg-anna-border text-white'
                : 'text-anna-muted hover:text-white hover:bg-anna-card'
            }`}
          >
            Trang Chủ
          </Link>

          <Link
            to="/invite"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              isActive('/invite')
                ? 'bg-anna-border text-white'
                : 'text-anna-muted hover:text-white hover:bg-anna-card'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Mời Bot Vào Server</span>
          </Link>

          <Link
            to="/servers"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              isActive('/servers')
                ? 'bg-anna-border text-white'
                : 'text-anna-muted hover:text-white hover:bg-anna-card'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-anna-accent" />
            <span>Quản Lý Server</span>
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
              className="bg-anna-accent hover:bg-anna-hover text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow cursor-pointer flex items-center space-x-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>Vào Dashboard</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
