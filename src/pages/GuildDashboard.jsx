import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import Overview from './dashboard-tabs/Overview';
import Builder from './dashboard-tabs/Builder';
import Features from './dashboard-tabs/Features';
import Analytics from './dashboard-tabs/Analytics';
import ResultModal from '../components/ResultModal';
import { Server, Home, Send, Sliders, Activity, ChevronRight, Eye, ArrowUp, ShieldCheck } from 'lucide-react';

export default function GuildDashboard({
  user,
  authLoading,
  backendUrl,
  handleApiError
}) {
  const { guildId, tab } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = tab || 'overview';

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

  // Message Type Mode: 'embed' | 'plain'
  const [msgMode, setMsgMode] = useState('embed');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Custom React Popups
  const [resultModal, setResultModal] = useState({ open: false, type: 'success', title: '', message: '' });
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [toggleConfirmModal, setToggleConfirmModal] = useState({ open: false, featureKey: null, featureName: '', currentStatus: false });

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

  // Route Guard Verification
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
        return;
      }
      const adminGuilds = user.adminGuilds || [];
      const hasPermission = adminGuilds.some((g) => g.id === guildId);
      if (!hasPermission) {
        navigate('/servers?error=' + encodeURIComponent('Bạn không có quyền quản trị server này!'));
      }
    }
  }, [user, authLoading, guildId, navigate]);

  // Synchronize Document Title
  useEffect(() => {
    const titles = {
      overview: 'Anna Manager - Tổng Quan Máy Chủ',
      builder: 'Anna Manager - Soạn Bài & Đăng Tin',
      features: 'Anna Manager - Cấu Hình Tính Năng',
      analytics: 'Anna Manager - Giám Sát Máy Chủ'
    };
    document.title = titles[activeTab] || 'Anna Manager Dashboard';
  }, [activeTab]);

  // Fetch Channels & Stats for this guildId
  const fetchChannels = async () => {
    setLoadingChannels(true);
    try {
      const res = await fetch(`${backendUrl}/api/channels`, { credentials: 'include' });
      const data = await res.json();
      if (handleApiError(res, data)) return;

      if (data.success && Array.isArray(data.channels)) {
        const guildChannels = data.channels.filter((ch) => ch.guildId === guildId);
        setChannels(guildChannels);
        if (guildChannels.length > 0 && !formData.channelId) {
          setFormData((prev) => ({ ...prev, channelId: guildChannels[0].id }));
        }
      }
    } catch (err) {
      console.log('Chưa kết nối được Backend API:', backendUrl);
    } finally {
      setLoadingChannels(false);
    }
  };

  const fetchRealStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/stats?guildId=${guildId}`, { credentials: 'include' });
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
    if (user && guildId) {
      fetchChannels();
      fetchRealStats();
    }
  }, [user, guildId, backendUrl]);

  const handleRefreshStats = async () => {
    setIsRefreshingStats(true);
    await fetchRealStats();
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

  const executeFeatureToggle = async () => {
    const { featureKey, currentStatus } = toggleConfirmModal;
    setToggleConfirmModal({ open: false, featureKey: null, featureName: '', currentStatus: false });

    try {
      const res = await fetch(`${backendUrl}/api/features/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ feature: featureKey, enabled: !currentStatus, guildId })
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

  if (authLoading || !user) return null;

  const currentGuild = (user.adminGuilds || []).find((g) => g.id === guildId) || { name: 'Server Discord', id: guildId };
  const selectedChannelObj = (channels || []).find((ch) => ch && ch.id === formData.channelId);

  return (
    <div className="min-h-screen bg-anna-dark text-anna-text p-6 selection:bg-anna-accent selection:text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Server Header Bar */}
        <div className="bg-anna-card border border-anna-border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-4">
            {currentGuild.icon ? (
              <img
                src={`https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.png`}
                alt={currentGuild.name}
                className="w-12 h-12 rounded-2xl object-cover border border-anna-border"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-anna-accent to-anna-purple flex items-center justify-center font-bold text-white text-sm shadow">
                {currentGuild.name ? currentGuild.name.substring(0, 2).toUpperCase() : 'DS'}
              </div>
            )}

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white">{currentGuild.name}</h1>
                <ShieldCheck className="w-4 h-4 text-emerald-400" title="Admin Verified" />
              </div>
              <span className="text-xs text-anna-muted font-mono">Guild ID: {guildId}</span>
            </div>
          </div>

          <Link
            to="/servers"
            className="text-xs bg-anna-dark hover:bg-slate-800 text-anna-text px-3.5 py-2 rounded-xl border border-anna-border transition cursor-pointer font-semibold flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Đổi Server Khác</span>
          </Link>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-anna-border pb-3 overflow-x-auto">
          <button
            onClick={() => navigate(`/servers/${guildId}/overview`)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-anna-accent text-white shadow-md'
                : 'bg-anna-card text-anna-muted hover:text-white hover:bg-slate-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Tổng Quan</span>
          </button>

          <button
            onClick={() => navigate(`/servers/${guildId}/builder`)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'builder'
                ? 'bg-anna-accent text-white shadow-md'
                : 'bg-anna-card text-anna-muted hover:text-white hover:bg-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Soạn Bài & Đăng Tin</span>
          </button>

          <button
            onClick={() => navigate(`/servers/${guildId}/features`)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'features'
                ? 'bg-anna-accent text-white shadow-md'
                : 'bg-anna-card text-anna-muted hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Cấu Hình Tính Năng</span>
          </button>

          <button
            onClick={() => navigate(`/servers/${guildId}/analytics`)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-anna-accent text-white shadow-md'
                : 'bg-anna-card text-anna-muted hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Giám Sát Máy Chủ</span>
          </button>
        </div>

        {/* POPUP MODALS */}
        <ResultModal
          resultModal={resultModal}
          onClose={() => setResultModal({ open: false, type: 'success', title: '', message: '' })}
        />

        {/* SUBMIT CONFIRMATION MODAL */}
        {showSubmitConfirmModal && (
          <div
            onClick={() => setShowSubmitConfirmModal(false)}
            className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-anna-card border border-anna-border rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl"
            >
              <div>
                <h3 className="text-base font-bold text-white">Xác nhận đăng bài viết?</h3>
                <p className="text-xs text-anna-text mt-2 leading-relaxed">
                  Bài viết sẽ được xuất bản trực tiếp tới kênh Discord <strong className="text-anna-accent">#{selectedChannelObj ? selectedChannelObj.name : formData.channelId}</strong>. Bạn có chắc chắn muốn đăng không?
                </p>
              </div>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirmModal(false)}
                  className="w-1/2 bg-anna-dark hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-xl border border-anna-border transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => { setShowSubmitConfirmModal(false); executeSendEmbed(); }}
                  className="w-1/2 bg-anna-accent hover:bg-anna-hover text-white text-xs font-semibold py-2.5 rounded-xl transition cursor-pointer shadow"
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
              className="bg-anna-card border border-anna-border rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl"
            >
              <div>
                <h3 className="text-base font-bold text-white">
                  Xác nhận {toggleConfirmModal.currentStatus ? 'TẮT' : 'BẬT'} tính năng?
                </h3>
                <p className="text-xs text-anna-muted mt-1">
                  Bạn có chắc chắn muốn {toggleConfirmModal.currentStatus ? 'tắt' : 'bật'} tính năng <strong>{toggleConfirmModal.featureName}</strong> cho Server này không?
                </p>
              </div>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={() => setToggleConfirmModal({ open: false, featureKey: null, featureName: '', currentStatus: false })}
                  className="w-1/2 bg-anna-dark hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-xl border border-anna-border transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={executeFeatureToggle}
                  className="w-1/2 bg-anna-accent hover:bg-anna-hover text-white text-xs font-semibold py-2 rounded-xl transition cursor-pointer shadow"
                >
                  Xác nhận {toggleConfirmModal.currentStatus ? 'Tắt' : 'Bật'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB VIEWS */}
        {activeTab === 'overview' && (
          <Overview realStats={realStats} guildId={guildId} />
        )}

        {activeTab === 'builder' && (
          <Builder
            channels={channels}
            guildId={guildId}
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

        {activeTab === 'features' && (
          <Features
            realStats={realStats}
            guildId={guildId}
            onOpenToggleConfirmModal={(featureKey, featureName, currentStatus) => {
              setToggleConfirmModal({ open: true, featureKey, featureName, currentStatus });
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics
            realStats={realStats}
            isRefreshingStats={isRefreshingStats}
            statsLoading={statsLoading}
            onRefreshStats={handleRefreshStats}
          />
        )}

      </div>

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2.5 z-50">
        {activeTab === 'builder' && (
          <button
            onClick={scrollToPreview}
            className="bg-anna-accent hover:bg-anna-hover text-white p-3.5 rounded-full shadow-2xl transition duration-200 cursor-pointer flex items-center justify-center border border-anna-accent/40"
            title="Xem Preview nhanh"
          >
            <Eye className="w-5 h-5" />
          </button>
        )}

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="bg-anna-card hover:bg-slate-800 text-white p-3.5 rounded-full shadow-2xl transition duration-200 cursor-pointer border border-anna-border flex items-center justify-center"
            title="Quay lại đầu trang"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>

    </div>
  );
}
