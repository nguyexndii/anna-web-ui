import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Server, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ServerPicker({ user, authLoading, onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Route Guard: If not authenticated, redirect to /login
  useEffect(() => {
    if (!authLoading && !user) {
      onLogin();
    }
  }, [user, authLoading, onLogin]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-anna-dark text-anna-text flex items-center justify-center p-6">
        <div className="text-xs text-anna-muted font-medium flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-anna-accent animate-ping"></span>
          <span>Đang tải danh sách Server...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const adminGuilds = user.adminGuilds || [];
  const searchParams = new URLSearchParams(location.search);
  const errorMsg = searchParams.get('error');

  return (
    <div className="min-h-screen bg-anna-dark text-anna-text p-6 selection:bg-anna-accent selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-anna-accent font-semibold uppercase tracking-wider">
            <Server className="w-4 h-4" />
            <span>Chọn Server Quản Lý</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Danh Sách Máy Chủ Bạn Có Quyền Quản Lý
          </h1>
          <p className="text-xs text-anna-muted">
            Chọn một máy chủ Discord bên dưới để bắt đầu cấu hình bài viết và minigame.
          </p>
        </div>

        {/* Access Denied Error Notification */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center space-x-3 text-xs text-rose-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Server Grid */}
        {adminGuilds.length === 0 ? (
          <div className="bg-anna-card border border-anna-border p-8 rounded-2xl text-center space-y-3">
            <div className="text-base font-bold text-white">Không Tìm Thấy Server Phù Hợp</div>
            <p className="text-xs text-anna-muted">
              Tài khoản Discord của bạn hiện chưa có quyền Quản Lý (Admin) trên máy chủ nào mà Anna Bot phục vụ.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {adminGuilds.map((guild) => {
              const guildInitial = guild.name ? guild.name.substring(0, 2).toUpperCase() : 'DS';

              return (
                <div
                  key={guild.id}
                  onClick={() => navigate(`/servers/${guild.id}/overview`)}
                  className="bg-anna-card hover:bg-slate-800/80 border border-anna-border hover:border-anna-accent rounded-2xl p-5 space-y-4 transition duration-200 cursor-pointer group shadow-lg flex flex-col justify-between"
                >
                  <div className="flex items-center space-x-4">
                    {guild.icon ? (
                      <img
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                        alt={guild.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-anna-border group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-anna-accent to-anna-purple flex items-center justify-center font-bold text-white text-sm shadow">
                        {guildInitial}
                      </div>
                    )}

                    <div className="truncate flex-1">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-anna-accent transition">
                        {guild.name}
                      </h3>
                      <span className="text-[11px] text-anna-muted font-mono block">ID: {guild.id}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/servers/${guild.id}/overview`);
                    }}
                    className="w-full bg-anna-dark group-hover:bg-anna-accent text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-anna-border group-hover:border-transparent transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Quản Lý Server</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
