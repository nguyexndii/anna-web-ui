import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Invite from './pages/Invite';
import ServerPicker from './pages/ServerPicker';
import GuildDashboard from './pages/GuildDashboard';
import LogoutModal from './components/LogoutModal';
import ResultModal from './components/ResultModal';

// Error Boundary Guard to Prevent Screen Blackout Crash
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-anna-dark text-anna-text flex items-center justify-center p-4">
          <div className="bg-anna-card border border-anna-border p-6 rounded-2xl max-w-md w-full text-center space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20 text-lg">
              ⚠️
            </div>
            <h2 className="text-base font-bold text-white">Đã xảy ra lỗi khởi chạy giao diện!</h2>
            <p className="text-xs text-rose-400 font-mono bg-anna-dark p-2 rounded text-left overflow-x-auto border border-rose-500/20">
              {this.state.error ? this.state.error.toString() : 'Lỗi không xác định'}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="w-full bg-anna-accent hover:bg-anna-hover text-white text-xs font-semibold py-2 rounded-xl transition cursor-pointer"
            >
              Tải lại trang Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [backendUrl, setBackendUrl] = useState('http://localhost:3000');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [resultModal, setResultModal] = useState({ open: false, type: 'success', title: '', message: '' });

  const codeHandledRef = useRef(false);

  // Check saved HTTP-Only session cookie on mount via /api/auth/me
  useEffect(() => {
    setAuthLoading(true);
    fetch(`${backendUrl}/api/auth/me`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, [backendUrl]);

  // Handle Discord OAuth2 Callback (?code=...&state=...)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && !codeHandledRef.current) {
      codeHandledRef.current = true;
      window.history.replaceState({}, document.title, window.location.pathname);

      setAuthLoading(true);
      fetch(`${backendUrl}/api/auth/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, state })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
            window.location.href = '/servers';
          } else {
            setResultModal({ open: true, type: 'error', title: 'Đăng Nhập Thất Bại', message: data.error || 'Mã xác thực không hợp lệ!' });
          }
        })
        .catch(() => {
          setResultModal({ open: true, type: 'error', title: 'Lỗi Kết Nối', message: 'Không thể kết nối tới Server Backend!' });
        })
        .finally(() => {
          setAuthLoading(false);
        });
    }
  }, [backendUrl]);

  // Helper for Handling 401 Unauthorized Response (Auto Re-login Prompt)
  const handleApiError = (res, data) => {
    if (res.status === 401) {
      setUser(null);
      setResultModal({
        open: true,
        type: 'error',
        title: 'Phiên Hết Hạn',
        message: 'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!'
      });
      return true;
    }
    return false;
  };

  // Handle Discord Login via CSRF-protected backend endpoint
  const handleDiscordLogin = async () => {
    setAuthLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/auth/url`, { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setResultModal({ open: true, type: 'error', title: 'Lỗi Cấu Hình', message: data.error || 'Chưa cấu hình DISCORD_CLIENT_ID!' });
        setAuthLoading(false);
      }
    } catch (err) {
      setResultModal({ open: true, type: 'error', title: 'Lỗi Kết Nối', message: 'Không kết nối được với Server Backend!' });
      setAuthLoading(false);
    }
  };

  // Handle Logout via Server API
  const confirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await fetch(`${backendUrl}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {}
    setUser(null);
    codeHandledRef.current = false;
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-anna-dark text-anna-text flex flex-col font-sans antialiased">
        
        {/* GLOBAL NAVIGATION NAVBAR */}
        <Navbar user={user} onLogin={handleDiscordLogin} onLogout={() => setShowLogoutModal(true)} />

        {/* MODALS */}
        <ResultModal
          resultModal={resultModal}
          onClose={() => setResultModal({ open: false, type: 'success', title: '', message: '' })}
        />

        <LogoutModal
          showLogoutModal={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirmLogout={confirmLogout}
        />

        {/* ROUTE DEFINITIONS */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home user={user} onLogin={handleDiscordLogin} />} />
            <Route path="/invite" element={<Invite backendUrl={backendUrl} />} />
            <Route path="/login" element={<Home user={user} onLogin={handleDiscordLogin} />} />
            
            <Route
              path="/servers"
              element={<ServerPicker user={user} authLoading={authLoading} onLogin={handleDiscordLogin} />}
            />

            <Route
              path="/servers/:guildId"
              element={
                <GuildDashboard
                  user={user}
                  authLoading={authLoading}
                  backendUrl={backendUrl}
                  handleApiError={handleApiError}
                />
              }
            />

            <Route
              path="/servers/:guildId/:tab"
              element={
                <GuildDashboard
                  user={user}
                  authLoading={authLoading}
                  backendUrl={backendUrl}
                  handleApiError={handleApiError}
                />
              }
            />

            <Route path="*" element={<Home user={user} onLogin={handleDiscordLogin} />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
