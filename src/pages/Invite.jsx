import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw } from 'lucide-react';

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
      <div className="bg-anna-card border border-anna-border rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
        
        {/* Bot Avatar Icon */}
        <div className="w-16 h-16 bg-gradient-to-tr from-anna-accent to-anna-purple rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl">
          <Bot className="w-9 h-9" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mời Anna Bot Vào Server</h1>
          <p className="text-xs text-anna-muted mt-1.5 leading-relaxed">
            Ủy quyền cho Anna Bot tham gia máy chủ Discord của bạn để mở khóa các tính năng quản lý bài đăng & minigame giải trí.
          </p>
        </div>

        {/* CTA Button */}
        {loading ? (
          <div className="flex items-center justify-center space-x-2 text-xs text-anna-muted py-3">
            <RefreshCw className="w-4 h-4 animate-spin text-anna-accent" />
            <span>Đang lấy liên kết mời Bot...</span>
          </div>
        ) : error ? (
          <div className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
            {error}
          </div>
        ) : (
          <a
            href={inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-anna-accent hover:bg-anna-hover text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 shadow-xl flex items-center justify-center text-sm cursor-pointer"
          >
            THÊM BOT VÀO DISCORD SERVER
          </a>
        )}

      </div>
    </div>
  );
}
