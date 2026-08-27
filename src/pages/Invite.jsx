import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function Invite({ backendUrl = 'http://localhost:3000' }) {
  const [inviteUrl, setInviteUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${backendUrl}/api/invite-url`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.url) {
          setInviteUrl(data.url);
        } else {
          setError(data.error || 'Không lấy được link mời Bot!');
        }
      })
      .catch(() => {
        setError('Không kết nối được tới Backend Server!');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [backendUrl]);

  return (
    <div className="min-h-screen bg-anna-dark text-anna-text flex items-center justify-center p-6 selection:bg-anna-accent selection:text-white">
      <div className="bg-anna-card border border-anna-border rounded-3xl p-8 sm:p-10 max-w-md w-full text-center space-y-8 shadow-2xl">
        
        {/* Bot Avatar Image */}
        <img
          src="/logo.jpg"
          alt="Anna Bot Avatar"
          className="w-24 h-24 rounded-3xl object-cover border-2 border-anna-accent mx-auto shadow-2xl hover:scale-105 transition duration-200"
        />

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Mời Anna Bot Vào Server</h1>
          <p className="text-sm text-anna-muted leading-relaxed font-normal">
            Ủy quyền cho Anna Bot tham gia máy chủ Discord của bạn để mở khóa các tính năng quản lý bài đăng & minigame giải trí.
          </p>
        </div>

        {/* CTA Button */}
        {loading ? (
          <div className="flex items-center justify-center space-x-2 text-sm text-anna-muted py-4">
            <RefreshCw className="w-5 h-5 animate-spin text-anna-accent" />
            <span>Đang lấy liên kết mời Bot...</span>
          </div>
        ) : error ? (
          <div className="text-sm text-rose-400 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
            {error}
          </div>
        ) : (
          <a
            href={inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-anna-accent hover:bg-anna-hover text-white font-bold py-4 px-6 rounded-2xl transition duration-200 shadow-xl flex items-center justify-center text-base cursor-pointer"
          >
            THÊM BOT VÀO DISCORD SERVER
          </a>
        )}

      </div>
    </div>
  );
}
