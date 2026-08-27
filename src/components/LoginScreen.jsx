import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function LoginScreen({ onLogin, authLoading }) {
  return (
    <div className="min-h-screen bg-discord-serverRail text-discord-text flex items-center justify-center p-4 selection:bg-discord-accent selection:text-white select-none">
      <div className="bg-discord-card border border-[#383a40] p-8 rounded-lg max-w-sm w-full shadow-2xl text-center space-y-6">
        
        <div className="w-12 h-12 bg-discord-accent rounded-lg flex items-center justify-center mx-auto text-white shadow-md">
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Anna Manager</h1>
          <p className="text-xs text-discord-muted mt-1">Đăng nhập để quản lý Discord Server của bạn</p>
        </div>

        <button
          onClick={onLogin}
          disabled={authLoading}
          className="w-full bg-discord-accent hover:bg-discord-hover disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded transition duration-150 flex items-center justify-center space-x-2 text-sm shadow cursor-pointer"
        >
          {authLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>Đăng nhập với Discord</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
