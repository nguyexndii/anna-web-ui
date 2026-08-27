import React, { useState, useEffect, useRef } from 'react';
import ServerRail from './components/ServerRail';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LoginScreen from './components/LoginScreen';
import OverviewTab from './components/OverviewTab';
import EmbedBuilderTab from './components/EmbedBuilderTab';
import FeaturesTab from './components/FeaturesTab';
import AnalyticsTab from './components/AnalyticsTab';
import ResultModal from './components/ResultModal';
import LogoutModal from './components/LogoutModal';
import { Eye, ArrowUp } from 'lucide-react';

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
        <div className="min-h-screen bg-discord-serverRail text-discord-text flex items-center justify-center p-4">
          <div className="bg-discord-card border border-[#383a40] p-6 rounded-lg max-w-md w-full text-center space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20 text-lg">
              ⚠️
            </div>
            <h2 className="text-base font-bold text-white">Đã xảy ra lỗi khởi chạy giao diện!</h2>
            <p className="text-xs text-rose-400 font-mono bg-discord-dark p-2 rounded text-left overflow-x-auto border border-rose-500/20">
              {this.state.error ? this.state.error.toString() : 'Lỗi không xác định'}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="w-full bg-discord-accent hover:bg-discord-hover text-white text-xs font-semibold py-2 rounded transition cursor-pointer"
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
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [sending, setSending] = useState(false);

  // Real System Stats State
  const [realStats, setRealStats] = useState({
    isReady: false,
    ping: 0,
    uptime: 'Đang tải...',
    features: { wordchain: false, wordscramble: false }
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);

  // Navigation Sidebar State ('overview' | 'builder' | 'features' | 'analytics')
  const [activeTab, setActiveTab] = useState('overview');

  // Message Type Mode: 'embed' | 'plain'
  const [msgMode, setMsgMode] = useState('embed');

  // Selected Server State
  const [selectedGuildId, setSelectedGuildId] = useState('');
  const [guildList, setGuildList] = useState([]);

  // Custom Dropdowns & Ref
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Custom React Popups (Result Modal, Logout Modal, Toggle Modal, Submit Confirm Modal)
  const [resultModal, setResultModal] = useState({ open: false, type: 'success', title: '', message: '' });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [toggleConfirmModal, setToggleConfirmModal] = useState({ open: false, featureKey: null, featureName: '', currentStatus: false });

  const userMenuRef = useRef(null);
  const codeHandledRef = useRef(false);
  const previewRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    channelId: '',
    content: '🎉 **SỰ KIỆN ĐẶC BIỆT DÀNH CHO THÀNH VIÊN**',
    title: 'Sự Kiện Tri Ân & Phần Thưởng',
    description: 'Chào mừng các bạn tham gia sự kiện tuần này!\n\n**Phần thưởng bao gồm:**\n• Role đặc biệt trong 30 ngày\n• Quà tặng thành viên tích cực\n\nNhấn vào liên kết bên dưới để tham gia ngay!',
    url: 'https://discord.gg/',
    color: '#5865f2',
    imageUrl: '',
    thumbnailUrl: '',
    authorName: '',
    authorIcon: '',
    footerText: 'Hệ thống tự động',
    footerIcon: '',
    fields: [
      { name: 'Phần Thưởng', value: 'Role V.I.P 30 ngày', inline: true },
      { name: 'Thời Gian', value: 'Hết tuần này', inline: true }
    ]
  });

  // Handle Scroll to Show "Back to Top" Button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Synchronize Tab with Document Title and URL Hash (#tabName)
  useEffect(() => {
    const titles = {
      overview: 'Anna Manager - Tổng Quan Hệ Thống',
      builder: 'Anna Manager - Soạn Bài & Đăng Tin',
      features: 'Anna Manager - Cấu Hình Tính Năng',
      analytics: 'Anna Manager - Giám Sát Máy Chủ'
    };
    document.title = titles[activeTab] || 'Anna Manager';

    if (window.location.hash !== `#${activeTab}`) {
      window.history.replaceState(null, '', `#${activeTab}`);
    }
  }, [activeTab]);

  // Read initial tab from URL Hash on Mount & handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'builder', 'features', 'analytics'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Click outside listener for user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          if (Array.isArray(data.user.adminGuilds) && data.user.adminGuilds.length > 0) {
            setGuildList(data.user.adminGuilds);
            setSelectedGuildId(data.user.adminGuilds[0].id);
          }
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
            if (Array.isArray(data.user.adminGuilds) && data.user.adminGuilds.length > 0) {
              setGuildList(data.user.adminGuilds);
              setSelectedGuildId(data.user.adminGuilds[0].id);
            }
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

  // Fetch channels & stats when logged in or selectedGuildId changes
  const fetchChannels = async () => {
    setLoadingChannels(true);
    try {
      const res = await fetch(`${backendUrl}/api/channels`, { credentials: 'include' });
      const data = await res.json();
      if (handleApiError(res, data)) return;

      if (data.success && Array.isArray(data.channels)) {
        setChannels(data.channels);
        if (data.channels.length > 0 && !formData.channelId) {
          setFormData((prev) => ({ ...prev, channelId: data.channels[0].id }));
        }
      }
    } catch (err) {
      console.log('Chưa kết nối được Backend API:', backendUrl);
    } finally {
      setLoadingChannels(false);
    }
  };

  const fetchRealStats = async (guildId = selectedGuildId) => {
    setStatsLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/stats?guildId=${guildId || ''}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setRealStats(data);
      }
    } catch (err) {
      console.log('Không thể lấy stats thực tế từ Backend API');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChannels();
      fetchRealStats(selectedGuildId);
    }
  }, [user, selectedGuildId, backendUrl]);

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (tabName === 'analytics' || tabName === 'features') {
      fetchRealStats(selectedGuildId);
    }
  };

  // Handle Refresh Stats Button Click
  const handleRefreshStats = async () => {
    setIsRefreshingStats(true);
    await fetchRealStats(selectedGuildId);
    setTimeout(() => {
      setIsRefreshingStats(false);
      setResultModal({
        open: true,
        type: 'success',
        title: 'Đồng Bộ Thành Công',
        message: `Đã cập nhật dữ liệu mới nhất từ Máy chủ Discord! (Độ trễ API hiện tại: ${realStats.ping >= 0 ? realStats.ping : 0} ms)`
      });
    }, 600);
  };

  // Handle Feature Toggle on Backend with per-guild scope
  const executeFeatureToggle = async () => {
    const { featureKey, currentStatus } = toggleConfirmModal;
    setToggleConfirmModal({ open: false, featureKey: null, featureName: '', currentStatus: false });

    try {
      const res = await fetch(`${backendUrl}/api/features/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ feature: featureKey, enabled: !currentStatus, guildId: selectedGuildId })
      });
      const data = await res.json();
      if (handleApiError(res, data)) return;

      if (data.success && data.features) {
        setRealStats((prev) => ({ ...prev, features: data.features }));
        setResultModal({
          open: true,
          type: 'success',
          title: 'Cập Nhật Tính Năng',
          message: `Đã ${!currentStatus ? 'BẬT' : 'TẮT'} thành công tính năng cho Server!`
        });
      } else {
        setResultModal({ open: true, type: 'error', title: 'Cập Nhật Thất Bại', message: data.error || 'Lỗi cập nhật tính năng!' });
      }
    } catch (err) {
      setResultModal({ open: true, type: 'error', title: 'Lỗi Cập Nhật', message: 'Không thể kết nối Backend server!' });
    }
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
    setUserMenuOpen(false);
    try {
      await fetch(`${backendUrl}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {}
    setUser(null);
    codeHandledRef.current = false;
  };

  // Handle Form Submit
  const executeSendEmbed = async () => {
    setSending(true);

    const payload = msgMode === 'plain'
      ? { channelId: formData.channelId, content: formData.content }
      : { ...formData };

    try {
      const res = await fetch(`${backendUrl}/api/send-embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (handleApiError(res, data)) return;

      if (data.success) {
        setResultModal({
          open: true,
          type: 'success',
          title: 'Đăng Bài Thành Công! 🎉',
          message: data.message || 'Bài viết đã được đăng trực tiếp vào kênh Discord!'
        });
      } else {
        setResultModal({
          open: true,
          type: 'error',
          title: 'Đăng Bài Thất Bại ❌',
          message: data.error || 'Lỗi gửi tin nhắn tới Discord API.'
        });
      }
    } catch (err) {
      setResultModal({ open: true, type: 'error', title: 'Lỗi Kết Nối ❌', message: 'Không thể kết nối với Backend Server!' });
    } finally {
      setSending(false);
    }
  };

  const scrollToPreview = () => {
    if (previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeGuildObj = (guildList || []).find((g) => g && g.id === selectedGuildId) || ((guildList || []).length > 0 ? guildList[0] : { name: 'Anna Manager' });
  const selectedChannelObj = (channels || []).find((ch) => ch && ch.id === formData.channelId);

  // SCREEN 1: DISCORD-STYLED LOGIN SCREEN
  if (!user) {
    return <LoginScreen onLogin={handleDiscordLogin} authLoading={authLoading} />;
  }

  // SCREEN 2: AUTHENTIC DISCORD DESKTOP DASHBOARD LAYOUT
  return (
    <div className="min-h-screen bg-discord-dark text-discord-text font-sans antialiased flex flex-row selection:bg-discord-accent selection:text-white">
      
      {/* 1. FAR-LEFT SERVER RAIL BAR */}
      <ServerRail
        guildList={guildList}
        selectedGuildId={selectedGuildId}
        onSelectGuild={(id) => { setSelectedGuildId(id); fetchRealStats(id); }}
        onHomeClick={() => switchTab('overview')}
      />

      {/* 2. CHANNELS CATEGORY SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={switchTab}
        activeGuildObj={activeGuildObj}
        realStats={realStats}
        user={user}
        userMenuOpen={userMenuOpen}
        setUserMenuOpen={setUserMenuOpen}
        onOpenLogoutModal={() => setShowLogoutModal(true)}
        userMenuRef={userMenuRef}
      />

      {/* 3. MAIN WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* DISCORD TOP HEADER BAR */}
        <TopBar activeTab={activeTab} realStats={realStats} />

        {/* POPUP MODALS */}
        <ResultModal
          resultModal={resultModal}
          onClose={() => setResultModal({ open: false, type: 'success', title: '', message: '' })}
        />

        <LogoutModal
          showLogoutModal={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirmLogout={confirmLogout}
        />

        {/* SUBMIT CONFIRMATION MODAL */}
        {showSubmitConfirmModal && (
          <div
            onClick={() => setShowSubmitConfirmModal(false)}
            className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-discord-card border border-[#383a40] rounded-lg max-w-sm w-full p-6 text-center space-y-4 shadow-2xl"
            >
              <div>
                <h3 className="text-base font-bold text-white">Xác nhận đăng bài viết?</h3>
                <p className="text-xs text-discord-text mt-2 leading-relaxed">
                  Bài viết sẽ được xuất bản trực tiếp tới kênh Discord <strong className="text-discord-accent">#{selectedChannelObj ? selectedChannelObj.name : formData.channelId}</strong>. Bạn có chắc chắn muốn đăng không?
                </p>
              </div>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirmModal(false)}
                  className="w-1/2 bg-discord-dark hover:bg-discord-cardHover text-white text-xs font-semibold py-2.5 rounded border border-[#383a40] transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => { setShowSubmitConfirmModal(false); executeSendEmbed(); }}
                  className="w-1/2 bg-discord-accent hover:bg-discord-hover text-white text-xs font-semibold py-2.5 rounded transition cursor-pointer shadow"
                >
                  Xác Nhận Đăng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FEATURE TOGGLE CONFIRMATION MODAL */}
        {toggleConfirmModal.open && (
          <div
            onClick={() => setToggleConfirmModal({ open: false, featureKey: null, featureName: '', currentStatus: false })}
            className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-discord-card border border-[#383a40] rounded-lg max-w-sm w-full p-6 text-center space-y-4 shadow-2xl"
            >
              <div>
                <h3 className="text-base font-bold text-white">
                  Xác nhận {toggleConfirmModal.currentStatus ? 'TẮT' : 'BẬT'} tính năng?
                </h3>
                <p className="text-xs text-discord-muted mt-1">
                  Bạn có chắc chắn muốn {toggleConfirmModal.currentStatus ? 'tắt' : 'bật'} tính năng <strong>{toggleConfirmModal.featureName}</strong> cho Server này không?
                </p>
              </div>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={() => setToggleConfirmModal({ open: false, featureKey: null, featureName: '', currentStatus: false })}
                  className="w-1/2 bg-discord-dark hover:bg-discord-cardHover text-white text-xs font-semibold py-2 rounded border border-[#383a40] transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={executeFeatureToggle}
                  className="w-1/2 bg-discord-accent hover:bg-discord-hover text-white text-xs font-semibold py-2 rounded transition cursor-pointer shadow"
                >
                  Xác nhận {toggleConfirmModal.currentStatus ? 'Tắt' : 'Bật'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <OverviewTab realStats={realStats} onSwitchTab={switchTab} />
        )}

        {/* TAB 2: EMBED & MESSAGE BUILDER */}
        {activeTab === 'builder' && (
          <EmbedBuilderTab
            channels={channels}
            selectedGuildId={selectedGuildId}
            formData={formData}
            setFormData={setFormData}
            msgMode={msgMode}
            setMsgMode={setMsgMode}
            sending={sending}
            onPreSubmit={(e) => {
              e.preventDefault();
              if (!formData.channelId) {
                setResultModal({ open: true, type: 'error', title: 'Gửi Thất Bại', message: 'Vui lòng chọn Kênh Discord để gửi bài!' });
                return;
              }
              setShowSubmitConfirmModal(true);
            }}
            previewRef={previewRef}
            scrollToPreview={scrollToPreview}
          />
        )}

        {/* TAB 3: FEATURE CONFIG TAB */}
        {activeTab === 'features' && (
          <FeaturesTab
            realStats={realStats}
            selectedGuildId={selectedGuildId}
            onOpenToggleConfirmModal={(featureKey, featureName, currentStatus) => {
              setToggleConfirmModal({ open: true, featureKey, featureName, currentStatus });
            }}
          />
        )}

        {/* TAB 4: SYSTEM HEALTH ANALYTICS */}
        {activeTab === 'analytics' && (
          <AnalyticsTab
            realStats={realStats}
            isRefreshingStats={isRefreshingStats}
            statsLoading={statsLoading}
            onRefreshStats={handleRefreshStats}
          />
        )}

      </div>

      {/* FLOATING ACTION BUTTONS AT BOTTOM RIGHT */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2.5 z-50">
        {activeTab === 'builder' && (
          <button
            onClick={scrollToPreview}
            className="bg-discord-accent hover:bg-discord-hover text-white p-3 rounded-full shadow-2xl transition duration-200 cursor-pointer flex items-center justify-center border border-discord-accent/40"
            title="Xem Preview nhanh"
          >
            <Eye className="w-5 h-5" />
          </button>
        )}

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="bg-discord-card hover:bg-discord-cardHover text-white p-3 rounded-full shadow-2xl transition duration-200 cursor-pointer border border-[#383a40] flex items-center justify-center"
            title="Quay lại đầu trang"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
