import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Server, ArrowRight, AlertCircle } from 'lucide-react';

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
        <div className="text-sm text-anna-muted font-medium flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-anna-accent animate-ping"></span>
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
    <div className="min-h-screen bg-anna-dark text-anna-text p-6 sm:p-8 selection:bg-anna-accent selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-anna-accent font-bold uppercase tracking-wider">
            <Server className="w-4.5 h-4.5" />
            <span>Chọn Server Quản Lý</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Danh Sách Máy Chủ Bạn Có Quyền Quản Lý
          </h1>
          <p className="text-sm text-anna-muted font-normal">
            Chọn một máy chủ Discord bên dưới để bắt đầu cấu hình bài viết và minigame.
          </p>
        </div>

        {/* Access Denied Error Notification */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center space-x-3 text-sm text-rose-400 font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Server Grid */}
        {adminGuilds.length === 0 ? (
          <div className="bg-anna-card border border-anna-border p-10 rounded-2xl text-center space-y-3">
            <div className="text-lg font-bold text-white">Không Tìm Thấy Server Phù Hợp</div>
            <p className="text-sm text-anna-muted">
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
                  className="bg-anna-card hover:bg-anna-cardHover border border-anna-border hover:border-anna-accent/60 rounded-2xl p-6 space-y-5 transition duration-200 cursor-pointer group shadow-xl flex flex-col justify-between"
                >
                  <div className="flex items-center space-x-4">
                    {guild.icon ? (
                      <img
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                        alt={guild.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-anna-border group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-anna-accent to-anna-purple flex items-center justify-center font-extrabold text-white text-base shadow">
                        {guildInitial}
                      </div>
                    )}

                    <div className="truncate flex-1">
                      <h3 className="text-base font-bold text-white truncate group-hover:text-anna-accent transition">
                        {guild.name}
                      </h3>
                      <span className="text-xs text-anna-muted font-mono block mt-0.5">ID: {guild.id}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/servers/${guild.id}/overview`);
                    }}
                    className="w-full bg-anna-dark group-hover:bg-anna-accent text-white text-sm font-bold py-3 px-4 rounded-xl border border-anna-border group-hover:border-transparent transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  >
                    <span>Quản Lý Server</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
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
