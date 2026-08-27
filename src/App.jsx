import React, { useState, useEffect, useRef } from 'react';
import DiscordEmbedPreview from './components/DiscordEmbedPreview';
import {
  Send, Image, Link, Type, Plus, Trash2, CheckCircle, AlertCircle, RefreshCw, Sparkles, MessageSquare,
  ListFilter, Hash, LogOut, ShieldCheck, Lock, ChevronDown, Check, Sliders, Activity, FileText,
  Eye, Bold, Italic, Code, Quote, Link2, ExternalLink, ChevronRight, Server, AtSign, Tag, ArrowUp,
  Settings, Home, Zap, Shield, HelpCircle, X, Copy, Info, Layers
} from 'lucide-react';

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
        <div className="min-h-screen bg-[#0e0f10] text-[#dbdee1] flex items-center justify-center p-4">
          <div className="bg-[#16171a] border border-[#2a2d34] p-6 rounded-lg max-w-md w-full text-center space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20 text-lg">
              ⚠️
            </div>
            <h2 className="text-base font-bold text-white">Đã xảy ra lỗi khởi chạy giao diện!</h2>
            <p className="text-xs text-rose-400 font-mono bg-[#0e0f10] p-2 rounded text-left overflow-x-auto border border-rose-500/20">
              {this.state.error ? this.state.error.toString() : 'Lỗi không xác định'}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold py-2 rounded transition cursor-pointer"
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [sending, setSending] = useState(false);
  const [useManualChannel, setUseManualChannel] = useState(false);

  // Real System Stats State
  const [realStats, setRealStats] = useState({
    isReady: false,
    ping: 0,
    uptime: 'Đang tải...',
    guildsCount: 0,
    features: { wordchain: true, wordscramble: true, wuwaWatcher: true }
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

  // Custom Dropdowns & Click-outside Ref
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [serverMenuOpen, setServerMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Custom React Popups (Result Modal, Logout Modal, Toggle Modal, Submit Confirm Modal)
  const [resultModal, setResultModal] = useState({ open: false, type: 'success', title: '', message: '' });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [toggleConfirmModal, setToggleConfirmModal] = useState({ open: false, featureKey: null, featureName: '', currentStatus: false });

  const templateRef = useRef(null);
  const userMenuRef = useRef(null);
  const serverMenuRef = useRef(null);
  const codeHandledRef = useRef(false);
  const previewRef = useRef(null);

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

  // Preset Colors
  const colorPresets = [
    { name: 'Blurple', hex: '#5865f2' },
    { name: 'Xanh lá', hex: '#22c55e' },
    { name: 'Vàng cam', hex: '#f59e0b' },
    { name: 'Đỏ', hex: '#ef4444' },
    { name: 'Xanh lam', hex: '#06b6d4' },
    { name: 'Tím', hex: '#a855f7' },
    { name: 'Xám', hex: '#4f545c' }
  ];

  // Clean Templates (Removed Thông Báo Bảo Trì per user request)
  const templates = [
    {
      id: 'tin-nhan-thuong',
      name: 'Tin Nhắn Thường (Văn Bản Thuần)',
      content: 'Xin chào mọi người! Đây là tin nhắn văn bản thuần túy không chứa khung Embed.',
      isPlain: true
    },
    {
      id: 'su-kien-qua-tang',
      name: 'Thông Báo Sự Kiện & Quà Tặng',
      content: '🎉 **SỰ KIỆN ĐẶC BIỆT DÀNH CHO THÀNH VIÊN**',
      title: 'Sự Kiện Tri Ân & Phần Thưởng',
      description: 'Chào mừng các bạn tham gia sự kiện tuần này!\n\n**Phần thưởng bao gồm:**\n• Role đặc biệt trong 30 ngày\n• Quà tặng thành viên tích cực\n\nNhấn vào liên kết bên dưới để tham gia ngay!',
      url: 'https://discord.gg/',
      color: '#5865f2',
      imageUrl: '',
      authorName: '',
      footerText: 'Hệ thống tự động',
      isPlain: false
    },
    {
      id: 'noi-quy-chao-mung',
      name: 'Nội Quy & Chào Mừng Thành Viên',
      content: '👋 **CHÀO MỪNG BẠN ĐẾN VỚI SERVER**',
      title: 'Nội Quy Thành Viên',
      description: 'Vui lòng tuân thủ các quy định chung của Server:\n\n1. Tôn trọng tất cả các thành viên.\n2. Không gửi nội dung spam hoặc quảng cáo.\n3. Giữ văn hóa giao tiếp lịch sự.\n\nChúc bạn có trải nghiệm tuyệt vời!',
      url: '',
      color: '#22c55e',
      imageUrl: '',
      authorName: '',
      footerText: 'Ban Quản Trị Server',
      isPlain: false
    }
  ];

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

  // Handle Click Outside to Auto-Close Dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (templateRef.current && !templateRef.current.contains(event.target)) {
        setTemplateMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (serverMenuRef.current && !serverMenuRef.current.contains(event.target)) {
        setServerMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Check saved user in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('anna_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed.user);
        setIsAdmin(parsed.isAdmin);
      } catch (e) {
        localStorage.removeItem('anna_user');
      }
    }
  }, []);

  // Handle Discord OAuth2 Callback (?code=...)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !codeHandledRef.current) {
      codeHandledRef.current = true;
      window.history.replaceState({}, document.title, window.location.pathname);

      setAuthLoading(true);
      fetch(`${backendUrl}/api/auth/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
            setIsAdmin(data.isAdmin);
            localStorage.setItem('anna_user', JSON.stringify({ user: data.user, isAdmin: data.isAdmin }));
          } else {
            setResultModal({ open: true, type: 'error', title: 'Đăng Nhập Thất Bại', message: data.error || 'Mã xác thực đã hết hạn!' });
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

  // Fetch channels & stats if logged in
  const fetchChannels = async () => {
    setLoadingChannels(true);
    try {
      const res = await fetch(`${backendUrl}/api/channels`);
      const data = await res.json();
      if (data.success && Array.isArray(data.channels)) {
        setChannels(data.channels);

        const guildsMap = {};
        data.channels.forEach((ch) => {
          if (ch && ch.guildId && !guildsMap[ch.guildId]) {
            guildsMap[ch.guildId] = { id: ch.guildId, name: ch.guildName || 'Server Discord' };
          }
        });
        const gList = Object.values(guildsMap);
        setGuildList(gList);

        if (gList.length > 0 && !selectedGuildId) {
          setSelectedGuildId(gList[0].id);
        }

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

  const fetchRealStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/stats`);
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
      fetchRealStats();
    }
  }, [user, backendUrl]);

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (tabName === 'analytics' || tabName === 'features') {
      fetchRealStats();
    }
  };

  // Handle Refresh Stats Button Click
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

  // Execute Feature Toggle on Backend
  const executeFeatureToggle = async () => {
    const { featureKey, currentStatus } = toggleConfirmModal;
    setToggleConfirmModal({ open: false, featureKey: null, featureName: '', currentStatus: false });

    try {
      const res = await fetch(`${backendUrl}/api/features/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: featureKey, enabled: !currentStatus })
      });
      const data = await res.json();
      if (data.success && data.features) {
        setRealStats((prev) => ({ ...prev, features: data.features }));
        setResultModal({
          open: true,
          type: 'success',
          title: 'Cập Nhật Tính Năng',
          message: `Đã ${!currentStatus ? 'BẬT' : 'TẮT'} thành công tính năng!`
        });
      }
    } catch (err) {
      setResultModal({
        open: true,
        type: 'error',
        title: 'Lỗi Cập Nhật',
        message: 'Không thể kết nối Backend server để bật/tắt tính năng!'
      });
    }
  };

  // Handle Discord Login
  const handleDiscordLogin = async () => {
    setAuthLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/auth/url`);
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

  // Handle Logout
  const confirmLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setShowLogoutModal(false);
    setUserMenuOpen(false);
    codeHandledRef.current = false;
    localStorage.removeItem('anna_user');
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...(formData.fields || [])];
    if (updatedFields[index]) {
      updatedFields[index][key] = value;
      setFormData((prev) => ({ ...prev, fields: updatedFields }));
    }
  };

  const addField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [...(prev.fields || []), { name: '', value: '', inline: false }]
    }));
  };

  const removeField = (index) => {
    setFormData((prev) => ({
      ...prev,
      fields: (prev.fields || []).filter((_, i) => i !== index)
    }));
  };

  const applyTemplateById = (templateId) => {
    setSelectedTemplateId(templateId);
    setTemplateMenuOpen(false);
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      if (tmpl.isPlain) {
        setMsgMode('plain');
        setFormData((prev) => ({
          ...prev,
          content: tmpl.content || ''
        }));
      } else {
        setMsgMode('embed');
        setFormData((prev) => ({
          ...prev,
          content: tmpl.content || '',
          title: tmpl.title || '',
          description: tmpl.description || '',
          url: tmpl.url || '',
          color: tmpl.color || '#5865f2',
          imageUrl: tmpl.imageUrl || '',
          thumbnailUrl: '',
          authorName: tmpl.authorName || '',
          footerText: tmpl.footerText || '',
          fields: prev.fields || []
        }));
      }
    }
  };

  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = document.getElementById(msgMode === 'plain' ? 'plain-msg-textarea' : 'desc-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = msgMode === 'plain' ? (formData.content || '') : (formData.description || '');
    const selected = currentText.substring(start, end) || 'nội dung';
    const replacement = `${prefix}${selected}${suffix}`;

    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);
    if (msgMode === 'plain') {
      handleChange('content', newText);
    } else {
      handleChange('description', newText);
    }
  };

  // Safe Filter channels based on selected Guild
  const activeGuildChannels = (channels || []).filter((ch) => ch && (!selectedGuildId || ch.guildId === selectedGuildId));
  const activeGuildObj = (guildList || []).find((g) => g && g.id === selectedGuildId) || ((guildList || []).length > 0 ? guildList[0] : { name: 'Đang tải Server...' });
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
  const selectedChannelObj = (channels || []).find((ch) => ch && ch.id === formData.channelId);

  // Open Confirmation Modal Before Sending
  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!formData.channelId) {
      setResultModal({ open: true, type: 'error', title: 'Gửi Thất Bại', message: 'Vui lòng chọn Kênh Discord để gửi bài!' });
      return;
    }
    setShowSubmitConfirmModal(true);
  };

  // Execute Actual Form Submit
  const executeSendEmbed = async () => {
    setSending(true);

    const payload = msgMode === 'plain'
      ? { channelId: formData.channelId, content: formData.content }
      : { ...formData };

    try {
      const res = await fetch(`${backendUrl}/api/send-embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

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
      setResultModal({
        open: true,
        type: 'error',
        title: 'Lỗi Kết Nối ❌',
        message: 'Không thể kết nối với Backend Server!'
      });
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

  // SCREEN 1: SLEEK MINIMALIST LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0e0f10] text-[#dbdee1] flex items-center justify-center p-4 selection:bg-[#5865f2] selection:text-white">
        <div className="bg-[#16171a] border border-[#2a2d34] p-8 rounded-lg max-w-sm w-full shadow-2xl text-center space-y-6">
          
          <div className="w-12 h-12 bg-[#5865f2] rounded-lg flex items-center justify-center mx-auto text-white shadow-md">
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Anna Manager</h1>
            <p className="text-xs text-zinc-400 mt-1">Đăng nhập để quản lý Discord Server của bạn</p>
          </div>

          <button
            onClick={handleDiscordLogin}
            disabled={authLoading}
            className="w-full bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded transition duration-150 flex items-center justify-center space-x-2 text-sm shadow cursor-pointer"
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

  // SCREEN 2: MAIN PRODUCTION DASHBOARD
  return (
    <div className="min-h-screen bg-[#0e0f10] text-[#dbdee1] font-sans antialiased flex flex-col md:flex-row selection:bg-[#5865f2] selection:text-white">
      
      {/* FIXED STICKY LEFT SIDEBAR (NEVER DISAPPEARS OR COLLAPSES) */}
      <aside className="w-full md:w-64 bg-[#16171a] border-r border-[#2a2d34] flex-shrink-0 flex flex-col justify-between sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 space-y-5">
          
          {/* Brand Logo & Title */}
          <button
            onClick={() => switchTab('overview')}
            className="flex items-center space-x-3 px-1 text-left cursor-pointer group w-full"
          >
            <div className="w-9 h-9 rounded bg-[#5865f2] flex items-center justify-center text-white font-bold text-base shadow group-hover:bg-[#4752c4] transition">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight group-hover:text-[#5865f2] transition">
                Anna Manager
              </h1>
              <span className="text-[10px] text-zinc-400 font-mono">Control Dashboard</span>
            </div>
          </button>

          {/* REAL Server Selector Dropdown */}
          <div className="bg-[#0e0f10] p-2 rounded border border-[#2a2d34] space-y-1 relative" ref={serverMenuRef}>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block px-1">
              Server Discord Active
            </label>

            <button
              type="button"
              onClick={() => setServerMenuOpen(!serverMenuOpen)}
              className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold text-white bg-[#16171a] hover:bg-[#1c1e22] rounded border border-[#2a2d34] transition cursor-pointer"
            >
              <div className="flex items-center space-x-2 truncate">
                <Server className="w-3.5 h-3.5 text-[#5865f2] flex-shrink-0" />
                <span className="truncate">{activeGuildObj ? activeGuildObj.name : 'Đang tải...'}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 ml-1" />
            </button>

            {serverMenuOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-[#16171a] border border-[#2a2d34] rounded shadow-2xl py-1 z-50 text-left max-h-48 overflow-y-auto">
                {(guildList || []).map((g) => (
                  <button
                    key={g.id}
                    onClick={() => { setSelectedGuildId(g.id); setServerMenuOpen(false); }}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between transition cursor-pointer hover:bg-[#1c1e22] ${selectedGuildId === g.id ? 'text-[#5865f2]' : 'text-white'}`}
                  >
                    <span className="truncate">{g.name}</span>
                    {selectedGuildId === g.id && <Check className="w-3.5 h-3.5 text-[#5865f2]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-1">
            <button
              onClick={() => switchTab('overview')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-xs font-medium transition cursor-pointer ${activeTab === 'overview' ? 'bg-[#5865f2] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-[#1c1e22]'}`}
            >
              <Home className="w-4 h-4" />
              <span>Tổng Quan Hệ Thống</span>
            </button>

            <button
              onClick={() => switchTab('builder')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-xs font-medium transition cursor-pointer ${activeTab === 'builder' ? 'bg-[#5865f2] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-[#1c1e22]'}`}
            >
              <Send className="w-4 h-4" />
              <span>Soạn Bài & Đăng Tin</span>
            </button>

            <button
              onClick={() => switchTab('features')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-xs font-medium transition cursor-pointer ${activeTab === 'features' ? 'bg-[#5865f2] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-[#1c1e22]'}`}
            >
              <Sliders className="w-4 h-4" />
              <span>Cấu Hình Tính Năng</span>
            </button>

            <button
              onClick={() => switchTab('analytics')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-xs font-medium transition cursor-pointer ${activeTab === 'analytics' ? 'bg-[#5865f2] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-[#1c1e22]'}`}
            >
              <Activity className="w-4 h-4" />
              <span>Giám Sát Máy Chủ</span>
            </button>
          </nav>
        </div>

        {/* ALWAYS-VISIBLE SIDEBAR FOOTER */}
        <div className="p-4 border-t border-[#2a2d34] text-xs text-zinc-400 space-y-2 bg-[#16171a]">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span>Máy chủ Discord:</span>
            <span className={realStats.isReady ? "text-emerald-400 flex items-center gap-1 font-semibold" : "text-rose-400 flex items-center gap-1 font-semibold"}>
              <span className={`w-1.5 h-1.5 rounded-full ${realStats.isReady ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span> {realStats.isReady ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span>Độ trễ API (Latency):</span>
            <span className="text-white font-semibold">{realStats.ping >= 0 ? `${realStats.ping} ms` : 'N/A'}</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* INTERACTIVE BREADCRUMB HEADER */}
        <header className="bg-[#16171a] border-b border-[#2a2d34] px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-2 text-xs text-zinc-400">
            <button
              onClick={() => switchTab('overview')}
              className="hover:text-white font-medium cursor-pointer transition"
            >
              Tổng Quan
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-white font-medium">
              {activeTab === 'overview' && 'Tổng Quan Hệ Thống'}
              {activeTab === 'builder' && 'Soạn Bài & Đăng Tin'}
              {activeTab === 'features' && 'Cấu Hình Tính Năng'}
              {activeTab === 'analytics' && 'Giám Sát Máy Chủ'}
            </span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2.5 bg-[#0e0f10] hover:bg-[#1c1e22] px-3 py-1.5 rounded border border-[#2a2d34] transition cursor-pointer"
            >
              <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full border border-[#5865f2]" />
              <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                {user.globalName || user.username}
              </span>
              {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Admin Verified" />}
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#16171a] border border-[#2a2d34] rounded shadow-2xl py-1.5 z-50 text-left space-y-1 animate-in fade-in duration-100">
                <div className="px-3 py-2 border-b border-[#2a2d34]">
                  <div className="text-xs font-bold text-white truncate">{user.globalName || user.username}</div>
                  <div className="text-[11px] text-zinc-400 font-mono truncate">@{user.username}</div>
                </div>

                <button
                  onClick={() => { setUserMenuOpen(false); setShowLogoutModal(true); }}
                  className="w-full px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất tài khoản</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CUSTOM POPUP MODAL: RESULT NOTIFICATION */}
        {resultModal.open && (
          <div
            onClick={() => setResultModal({ open: false, type: 'success', title: '', message: '' })}
            className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#16171a] border border-[#2a2d34] rounded-lg max-w-sm w-full p-6 text-center space-y-4 shadow-2xl"
            >
              <div>
                <h3 className={`text-base font-bold ${resultModal.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {resultModal.title}
                </h3>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{resultModal.message}</p>
              </div>
              <button
                onClick={() => setResultModal({ open: false, type: 'success', title: '', message: '' })}
                className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold py-2 rounded transition cursor-pointer shadow"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        )}

        {/* CUSTOM POPUP MODAL: LOGOUT CONFIRMATION */}
        {showLogoutModal && (
          <div
            onClick={() => setShowLogoutModal(false)}
            className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#16171a] border border-[#2a2d34] rounded-lg max-w-sm w-full p-6 text-center space-y-4 shadow-2xl"
            >
              <div>
                <h3 className="text-base font-bold text-white">Xác nhận đăng xuất?</h3>
                <p className="text-xs text-zinc-400 mt-1">Bạn sẽ cần đăng nhập lại tài khoản Discord để tiếp tục quản lý.</p>
              </div>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-1/2 bg-[#0e0f10] hover:bg-[#1c1e22] text-white text-xs font-semibold py-2 rounded border border-[#2a2d34] transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmLogout}
                  className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2 rounded transition cursor-pointer shadow"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM POPUP MODAL: SUBMIT FORM CONFIRMATION */}
        {showSubmitConfirmModal && (
          <div
            onClick={() => setShowSubmitConfirmModal(false)}
            className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#16171a] border border-[#2a2d34] rounded-lg max-w-sm w-full p-6 text-center space-y-4 shadow-2xl"
            >
              <div>
                <h3 className="text-base font-bold text-white">Xác nhận đăng bài viết?</h3>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  Bài viết sẽ được xuất bản trực tiếp tới kênh Discord <strong className="text-[#5865f2]">#{selectedChannelObj ? selectedChannelObj.name : formData.channelId}</strong>. Bạn có chắc chắn muốn đăng không?
                </p>
              </div>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirmModal(false)}
                  className="w-1/2 bg-[#0e0f10] hover:bg-[#1c1e22] text-white text-xs font-semibold py-2.5 rounded border border-[#2a2d34] transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => { setShowSubmitConfirmModal(false); executeSendEmbed(); }}
                  className="w-1/2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold py-2.5 rounded transition cursor-pointer shadow"
                >
                  Xác Nhận Đăng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM POPUP MODAL: FEATURE TOGGLE CONFIRMATION */}
        {toggleConfirmModal.open && (
          <div
            onClick={() => setToggleConfirmModal({ open: false, featureKey: null, featureName: '', currentStatus: false })}
            className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#16171a] border border-[#2a2d34] rounded-lg max-w-sm w-full p-6 text-center space-y-4 shadow-2xl"
            >
              <div>
                <h3 className="text-base font-bold text-white">
                  Xác nhận {toggleConfirmModal.currentStatus ? 'TẮT' : 'BẬT'} tính năng?
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Bạn có chắc chắn muốn {toggleConfirmModal.currentStatus ? 'tắt' : 'bật'} tính năng <strong>{toggleConfirmModal.featureName}</strong> không?
                </p>
              </div>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={() => setToggleConfirmModal({ open: false, featureKey: null, featureName: '', currentStatus: false })}
                  className="w-1/2 bg-[#0e0f10] hover:bg-[#1c1e22] text-white text-xs font-semibold py-2 rounded border border-[#2a2d34] transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={executeFeatureToggle}
                  className="w-1/2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold py-2 rounded transition cursor-pointer shadow"
                >
                  Xác nhận {toggleConfirmModal.currentStatus ? 'Tắt' : 'Bật'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE VIEW 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <main className="p-6 max-w-5xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Tổng Quan Hệ Thống Quản Lý Bot</h2>
              <p className="text-xs text-zinc-400 mt-1">Giám sát tổng thể hoạt động và phím tắt thao tác nhanh</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[#16171a] p-4 rounded border border-[#2a2d34] space-y-1">
                <div className="text-xs text-zinc-400 font-medium">Trạng thái Bot</div>
                <div className={`text-base font-bold font-mono ${realStats.isReady ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {realStats.isReady ? '🟢 HOẠT ĐỘNG' : '🔴 MẤT KẾT NỐI'}
                </div>
              </div>

              <div className="bg-[#16171a] p-4 rounded border border-[#2a2d34] space-y-1">
                <div className="text-xs text-zinc-400 font-medium">Độ trễ API (Latency)</div>
                <div className="text-base font-bold text-white font-mono">{realStats.ping >= 0 ? `${realStats.ping} ms` : 'N/A'}</div>
              </div>

              <div className="bg-[#16171a] p-4 rounded border border-[#2a2d34] space-y-1">
                <div className="text-xs text-zinc-400 font-medium">Server Phục Vụ</div>
                <div className="text-base font-bold text-[#5865f2] font-mono">{realStats.guildsCount} Server</div>
              </div>

              <div className="bg-[#16171a] p-4 rounded border border-[#2a2d34] space-y-1">
                <div className="text-xs text-zinc-400 font-medium">Tính năng Active</div>
                <div className="text-base font-bold text-amber-400 font-mono">3 / 3 Bật</div>
              </div>
            </div>

            <div className="bg-[#16171a] p-6 rounded border border-[#2a2d34] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Phím Tắt Thao Tác Nhanh</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => switchTab('builder')}
                  className="bg-[#0e0f10] hover:bg-[#1c1e22] p-4 rounded border border-[#2a2d34] text-left transition cursor-pointer space-y-1 group"
                >
                  <Send className="w-5 h-5 text-[#5865f2] group-hover:scale-110 transition" />
                  <div className="text-xs font-bold text-white pt-1">Soạn Bài & Đăng Tin</div>
                  <div className="text-[11px] text-zinc-400">Tạo tin nhắn văn bản thường hoặc Embed card</div>
                </button>

                <button
                  onClick={() => switchTab('features')}
                  className="bg-[#0e0f10] hover:bg-[#1c1e22] p-4 rounded border border-[#2a2d34] text-left transition cursor-pointer space-y-1 group"
                >
                  <Sliders className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
                  <div className="text-xs font-bold text-white pt-1">Cấu Hình Tính Năng</div>
                  <div className="text-[11px] text-zinc-400">Bật/tắt các trò chơi Nối Từ, Sắp Xếp Từ, Săn Code</div>
                </button>

                <button
                  onClick={() => switchTab('analytics')}
                  className="bg-[#0e0f10] hover:bg-[#1c1e22] p-4 rounded border border-[#2a2d34] text-left transition cursor-pointer space-y-1 group"
                >
                  <Activity className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
                  <div className="text-xs font-bold text-white pt-1">Giám Sát Máy Chủ</div>
                  <div className="text-[11px] text-zinc-400">Kiểm tra thông số Uptime và Ping thực tế</div>
                </button>
              </div>
            </div>
          </main>
        )}

        {/* WORKSPACE VIEW 2: UNIFIED BUILDER TAB */}
        {activeTab === 'builder' && (
          <main className="p-6 max-w-4xl space-y-6">
            
            {/* UNIFIED FORM CONTAINER */}
            <div className="bg-[#16171a] border border-[#2a2d34] rounded-lg p-6 space-y-5">
              
              <div className="flex flex-wrap items-center justify-between border-b border-[#2a2d34] pb-4 gap-4">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    {msgMode === 'embed' ? <Layers className="w-4 h-4 text-[#5865f2]" /> : <MessageSquare className="w-4 h-4 text-[#5865f2]" />}
                    {msgMode === 'embed' ? 'Soạn Bài Đăng Embed Card' : 'Soạn Tin Nhắn Thường (Văn Bản Thuần)'}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Chọn Mẫu Nhanh ở bên phải để thay đổi nhanh định dạng bài viết bên dưới
                  </p>
                </div>

                {/* Unified Template Selector */}
                <div className="relative flex items-center space-x-2" ref={templateRef}>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-medium text-zinc-400">Mẫu nhanh:</span>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setTemplateMenuOpen(!templateMenuOpen)}
                      className="bg-[#0e0f10] hover:bg-[#1c1e22] border border-[#2a2d34] text-white text-xs rounded px-3 py-1.5 outline-none flex items-center justify-between min-w-[220px] transition cursor-pointer shadow-sm"
                    >
                      <span className="truncate">{selectedTemplate ? selectedTemplate.name : '-- Chọn mẫu bài đăng --'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 ml-2 transition-transform duration-200 ${templateMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {templateMenuOpen && (
                      <div className="absolute right-0 mt-1 w-72 bg-[#16171a] border border-[#2a2d34] rounded shadow-2xl py-1 z-50 text-left space-y-1 animate-in fade-in duration-100">
                        {templates.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => applyTemplateById(t.id)}
                            className={`w-full px-3 py-2 text-xs text-left flex items-center justify-between transition cursor-pointer hover:bg-[#1c1e22] ${selectedTemplateId === t.id ? 'bg-[#1c1e22] text-[#5865f2] font-semibold' : 'text-[#dbdee1]'}`}
                          >
                            <span className="truncate">{t.name}</span>
                            {selectedTemplateId === t.id && <Check className="w-3.5 h-3.5 text-[#5865f2] flex-shrink-0" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mode Toggle Checkbox */}
              <div className="bg-[#0e0f10] p-2.5 rounded border border-[#2a2d34] flex items-center justify-between">
                <span className="text-xs text-zinc-300 font-medium">Định dạng hiển thị bài viết:</span>
                <div className="flex items-center space-x-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setMsgMode('embed')}
                    className={`px-3 py-1 rounded transition cursor-pointer font-semibold ${msgMode === 'embed' ? 'bg-[#5865f2] text-white' : 'text-zinc-400 hover:text-white'}`}
                  >
                    📌 Embed Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setMsgMode('plain')}
                    className={`px-3 py-1 rounded transition cursor-pointer font-semibold ${msgMode === 'plain' ? 'bg-[#5865f2] text-white' : 'text-zinc-400 hover:text-white'}`}
                  >
                    💬 Tin Nhắn Thường
                  </button>
                </div>
              </div>

              <form onSubmit={handlePreSubmit} className="space-y-4">
                
                {/* Channel Selector */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Kênh Discord Nhận Bài <span className="text-rose-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseManualChannel(!useManualChannel)}
                      className="text-xs text-[#5865f2] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      {useManualChannel ? <ListFilter className="w-3 h-3" /> : <Hash className="w-3 h-3" />}
                      <span>{useManualChannel ? 'Dùng Dropdown Danh Sách Kênh' : 'Nhập Channel ID thủ công'}</span>
                    </button>
                  </div>

                  {!useManualChannel && activeGuildChannels.length > 0 ? (
                    <select
                      value={formData.channelId}
                      onChange={(e) => handleChange('channelId', e.target.value)}
                      className="w-full bg-[#0e0f10] border border-[#2a2d34] text-white text-xs rounded p-2.5 outline-none focus:border-[#5865f2] cursor-pointer"
                    >
                      {activeGuildChannels.map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          #{ch.name} (ID: {ch.id})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Nhập Channel ID thủ công (vd: 1447095306079698984)"
                      value={formData.channelId}
                      onChange={(e) => handleChange('channelId', e.target.value)}
                      className="w-full bg-[#0e0f10] border border-[#2a2d34] text-white text-xs rounded p-2.5 outline-none focus:border-[#5865f2]"
                    />
                  )}
                </div>

                {/* MODE 1: PLAIN TEXT MESSAGE INTERFACE */}
                {msgMode === 'plain' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Nội dung Tin Nhắn Văn Bản Thuần Túy <span className="text-rose-400">*</span>
                      </label>

                      <div className="flex items-center space-x-1 bg-[#0e0f10] px-2 py-0.5 rounded border border-[#2a2d34] text-xs">
                        <button type="button" onClick={() => insertMarkdown('**', '**')} className="hover:bg-[#1c1e22] text-white px-1.5 py-0.5 rounded font-bold" title="In đậm">B</button>
                        <button type="button" onClick={() => insertMarkdown('*', '*')} className="hover:bg-[#1c1e22] text-white px-1.5 py-0.5 rounded italic" title="In nghiêng">I</button>
                        <button type="button" onClick={() => insertMarkdown('`', '`')} className="hover:bg-[#1c1e22] text-white px-1.5 py-0.5 rounded font-mono" title="Code">Code</button>
                        <button type="button" onClick={() => insertMarkdown('> ')} className="hover:bg-[#1c1e22] text-white px-1.5 py-0.5 rounded" title="Trích dẫn">&gt; Quote</button>
                      </div>
                    </div>

                    <textarea
                      id="plain-msg-textarea"
                      rows={6}
                      value={formData.content || ''}
                      onChange={(e) => handleChange('content', e.target.value)}
                      placeholder="Nhập nội dung tin nhắn thường tại đây... Dùng Shift + Enter để xuống dòng mượt mà!"
                      className="w-full bg-[#0e0f10] border border-[#2a2d34] text-white text-xs rounded p-3 outline-none focus:border-[#5865f2] font-sans leading-relaxed resize-y"
                    ></textarea>

                    <p className="text-[11px] text-zinc-400">💡 Ở chế độ này, bài đăng sẽ chỉ là tin nhắn chữ thường chuẩn Discord, hoàn toàn không kèm theo bất cứ khung Embed hay dải viền nào.</p>
                  </div>
                )}

                {/* MODE 2: FULL EMBED CARD INTERFACE */}
                {msgMode === 'embed' && (
                  <>
                    <div className="bg-[#0e0f10] p-3 rounded border border-[#2a2d34] space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-[#5865f2]" /> Tin nhắn ngoài Embed (Nơi đính kèm Tag @everyone, @role)
                        </label>
                      </div>

                      <input
                        type="text"
                        value={formData.content || ''}
                        onChange={(e) => handleChange('content', e.target.value)}
                        placeholder="Ví dụ: @everyone Thông báo bảo trì hệ thống!"
                        className="w-full bg-[#16171a] border border-[#2a2d34] text-white text-xs rounded p-2 outline-none focus:border-[#5865f2]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-8">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                          Tiêu đề Embed Card (Title)
                        </label>
                        <input
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) => handleChange('title', e.target.value)}
                          placeholder="Tiêu đề chính của Embed..."
                          className="w-full bg-[#0e0f10] border border-[#2a2d34] text-white text-xs rounded p-2.5 outline-none focus:border-[#5865f2]"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1 flex items-center justify-between">
                          <span>Màu viền Embed</span>
                          <span className="font-mono text-[10px] text-zinc-300">{formData.color}</span>
                        </label>
                        <div className="flex items-center space-x-2 pt-1">
                          {colorPresets.map((preset) => (
                            <button
                              key={preset.hex}
                              type="button"
                              onClick={() => handleChange('color', preset.hex)}
                              className={`w-6 h-6 rounded-full border-2 transition ${formData.color === preset.hex ? 'border-white scale-110 ring-2 ring-white shadow-lg' : 'border-transparent opacity-75 hover:opacity-100'}`}
                              style={{ backgroundColor: preset.hex }}
                              title={preset.name}
                            />
                          ))}
                          <input
                            type="color"
                            value={formData.color || '#5865f2'}
                            onChange={(e) => handleChange('color', e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                            title="Màu tùy chỉnh"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
                        <Link className="w-3.5 h-3.5 text-[#5865f2]" /> Đường dẫn liên kết tiêu đề (URL)
                      </label>
                      <input
                        type="text"
                        value={formData.url || ''}
                        onChange={(e) => handleChange('url', e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#0e0f10] border border-[#2a2d34] text-white text-xs rounded p-2.5 outline-none focus:border-[#5865f2]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Nội dung bài viết Embed (Description)
                        </label>

                        <div className="flex items-center space-x-1 bg-[#0e0f10] px-2 py-0.5 rounded border border-[#2a2d34] text-xs">
                          <button type="button" onClick={() => insertMarkdown('**', '**')} className="hover:bg-[#1c1e22] text-white px-1.5 py-0.5 rounded font-bold" title="In đậm">B</button>
                          <button type="button" onClick={() => insertMarkdown('*', '*')} className="hover:bg-[#1c1e22] text-white px-1.5 py-0.5 rounded italic" title="In nghiêng">I</button>
                          <button type="button" onClick={() => insertMarkdown('`', '`')} className="hover:bg-[#1c1e22] text-white px-1.5 py-0.5 rounded font-mono" title="Code">Code</button>
                          <button type="button" onClick={() => insertMarkdown('> ')} className="hover:bg-[#1c1e22] text-white px-1.5 py-0.5 rounded" title="Trích dẫn">&gt; Quote</button>
                          <button type="button" onClick={() => insertMarkdown('[Tên Link](', ')')} className="hover:bg-[#1c1e22] text-white px-1.5 py-0.5 rounded" title="Link">Link</button>
                        </div>
                      </div>

                      <textarea
                        id="desc-textarea"
                        rows={7}
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Nhập nội dung bài viết..."
                        className="w-full bg-[#0e0f10] border border-[#2a2d34] text-white text-xs rounded p-3 outline-none focus:border-[#5865f2] font-mono leading-relaxed resize-y"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
                          <Image className="w-3.5 h-3.5 text-[#5865f2]" /> Link Ảnh Banner Lớn (Image URL)
                        </label>
                        <input
                          type="text"
                          value={formData.imageUrl || ''}
                          onChange={(e) => handleChange('imageUrl', e.target.value)}
                          placeholder="https://i.imgur.com/..."
                          className="w-full bg-[#0e0f10] border border-[#2a2d34] text-white text-xs rounded p-2.5 outline-none focus:border-[#5865f2]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
                          <Image className="w-3.5 h-3.5 text-[#5865f2]" /> Link Thumbnail Nhỏ (Góc phải)
                        </label>
                        <input
                          type="text"
                          value={formData.thumbnailUrl || ''}
                          onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-[#0e0f10] border border-[#2a2d34] text-white text-xs rounded p-2.5 outline-none focus:border-[#5865f2]"
                        />
                      </div>
                    </div>

                    <div className="border-t border-[#2a2d34] pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Các ô thông tin phụ (Fields)</label>
                        </div>
                        <button
                          type="button"
                          onClick={addField}
                          className="text-xs bg-[#0e0f10] hover:bg-[#1c1e22] text-white px-2.5 py-1 rounded border border-[#2a2d34] flex items-center gap-1 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#5865f2]" /> Thêm ô mới
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(formData.fields || []).map((field, idx) => (
                          <div key={idx} className="flex flex-wrap items-center gap-2 bg-[#0e0f10] p-2 rounded border border-[#2a2d34]">
                            <input
                              type="text"
                              placeholder="Tên ô"
                              value={field.name || ''}
                              onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                              className="w-full md:w-1/3 bg-[#16171a] text-white text-xs rounded p-2 outline-none border border-[#2a2d34]"
                            />
                            <input
                              type="text"
                              placeholder="Giá trị ô"
                              value={field.value || ''}
                              onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                              className="w-full md:w-5/12 bg-[#16171a] text-white text-xs rounded p-2 outline-none border border-[#2a2d34]"
                            />
                            <label className="flex items-center space-x-1.5 text-xs text-zinc-300 cursor-pointer bg-[#16171a] px-2.5 py-1.5 rounded border border-[#2a2d34]" title="Nếu tích chọn, ô này sẽ xếp nằm ngang trên cùng 1 hàng với ô bên cạnh">
                              <input
                                type="checkbox"
                                checked={!!field.inline}
                                onChange={(e) => handleFieldChange(idx, 'inline', e.target.checked)}
                                className="rounded bg-[#0e0f10] text-[#5865f2]"
                              />
                              <span>Xếp cùng 1 hàng ngang (Inline)</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeField(idx)}
                              className="text-zinc-400 hover:text-rose-400 p-1.5 transition cursor-pointer ml-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#2a2d34] pt-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                          Tên Tác Giả (Để trống nếu không dùng Dòng Tác Giả nhỏ)
                        </label>
                        <input
                          type="text"
                          value={formData.authorName || ''}
                          onChange={(e) => handleChange('authorName', e.target.value)}
                          placeholder="Để trống nếu không muốn dùng..."
                          className="w-full bg-[#0e0f10] border border-[#2a2d34] text-white text-xs rounded p-2.5 outline-none focus:border-[#5865f2]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                          Dòng Chân Trang (Footer Text)
                        </label>
                        <input
                          type="text"
                          value={formData.footerText || ''}
                          onChange={(e) => handleChange('footerText', e.target.value)}
                          placeholder="Hệ thống tự động..."
                          className="w-full bg-[#0e0f10] border border-[#2a2d34] text-white text-xs rounded p-2.5 outline-none focus:border-[#5865f2]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ONE SINGLE UNIFIED HELP BOX COMBINING ALL FORMATTING RULES */}
                <div className="bg-[#0e0f10] p-3 rounded border border-[#2a2d34] space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Info className="w-4 h-4 text-[#5865f2]" /> Cụm Hướng Dẫn Định Dạng & Tag Discord Chuẩn:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                    <div><span className="text-white font-bold">**in đậm**</span> ➔ <strong>in đậm</strong></div>
                    <div><span className="text-white font-bold">*in nghiêng*</span> ➔ <em>in nghiêng</em></div>
                    <div><span className="text-white font-bold">`code`</span> ➔ <code className="bg-[#16171a] px-1 rounded text-zinc-200">code</code></div>
                    <div><span className="text-white font-bold">&gt; trích dẫn</span> ➔ Trích dẫn</div>
                    <div><span className="text-emerald-400 font-bold">&lt;@ID_USER&gt;</span> ➔ Tag User</div>
                    <div><span className="text-amber-400 font-bold">&lt;@&amp;ID_ROLE&gt;</span> ➔ Tag Role</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#2a2d34] flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white font-bold py-3 px-5 rounded flex items-center justify-center space-x-2 transition duration-150 shadow-lg cursor-pointer text-xs uppercase tracking-wider"
                  >
                    <Send className="w-4 h-4" />
                    <span>{sending ? 'Đang đăng bài...' : 'ĐĂNG BÀI VIẾT NÀY'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={scrollToPreview}
                    className="bg-[#0e0f10] hover:bg-[#1c1e22] text-white font-medium py-3 px-4 rounded border border-[#2a2d34] flex items-center justify-center space-x-1.5 transition cursor-pointer text-xs"
                  >
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Xem Preview</span>
                  </button>
                </div>
              </form>
            </div>

            {/* LIVE PREVIEW CONTAINER AT THE BOTTOM */}
            <div ref={previewRef} className="space-y-2 pt-2 border-t border-[#2a2d34]">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-400" /> XEM TRƯỚC BÀI ĐĂNG (LIVE PREVIEW DISCORD)
                </h2>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Giao diện Discord
                </span>
              </div>

              <DiscordEmbedPreview embedData={msgMode === 'plain' ? { content: formData.content } : formData} />
            </div>

          </main>
        )}

        {/* WORKSPACE VIEW 3: REAL SYSTEM HEALTH TAB */}
        {activeTab === 'analytics' && (
          <main className="p-6 max-w-4xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#5865f2]" /> Giám Sát Máy Chủ & System Health
              </h2>
              <button
                onClick={handleRefreshStats}
                disabled={isRefreshingStats || statsLoading}
                className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded border transition cursor-pointer font-medium ${isRefreshingStats ? 'bg-[#5865f2] text-white border-transparent' : 'bg-[#16171a] text-zinc-200 border-[#2a2d34] hover:bg-[#1c1e22]'}`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingStats || statsLoading ? 'animate-spin' : ''}`} />
                <span>{isRefreshingStats ? 'Đang đồng bộ dữ liệu...' : 'Tải lại dữ liệu'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#16171a] p-4 rounded border border-[#2a2d34] space-y-1">
                <div className="text-xs text-zinc-400 font-medium">Kết nối Discord Gateway</div>
                <div className={`text-base font-bold font-mono ${realStats.isReady ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {realStats.isReady ? 'ONLINE 🟢' : 'OFFLINE 🔴'}
                </div>
                <div className="text-[10px] text-zinc-500">Trạng thái máy chủ Discord</div>
              </div>

              <div className="bg-[#16171a] p-4 rounded border border-[#2a2d34] space-y-1">
                <div className="text-xs text-zinc-400 font-medium">Độ trễ API (Latency)</div>
                <div className="text-base font-bold text-white font-mono">
                  {realStats.ping >= 0 ? `${realStats.ping} ms` : 'N/A'}
                </div>
                <div className="text-[10px] text-zinc-500">Đo trực tiếp qua WebSocket</div>
              </div>

              <div className="bg-[#16171a] p-4 rounded border border-[#2a2d34] space-y-1">
                <div className="text-xs text-zinc-400 font-medium">Số Server đang phục vụ</div>
                <div className="text-base font-bold text-[#5865f2] font-mono">
                  {realStats.guildsCount} Server
                </div>
                <div className="text-[10px] text-zinc-500">Số lượng máy chủ active</div>
              </div>
            </div>

            <div className="bg-[#16171a] p-4 rounded border border-[#2a2d34] space-y-2">
              <div className="text-xs font-bold text-white">Thời gian hoạt động liên tục (Uptime):</div>
              <div className="text-sm font-mono text-emerald-400">{realStats.uptime}</div>
            </div>
          </main>
        )}

        {/* WORKSPACE VIEW 4: FEATURE CONFIG TAB */}
        {activeTab === 'features' && (
          <main className="p-6 max-w-4xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#5865f2]" /> Cấu Hình Tính Năng Tự Động
            </h2>
            
            <div className="bg-[#16171a] p-4 rounded border border-[#2a2d34] space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2d34] pb-3">
                <div>
                  <div className="text-xs font-semibold text-white">Minigame Nối Từ (WordChain)</div>
                  <div className="text-[11px] text-zinc-400">Tự động nhận diện từ nối và lưu điểm MongoDB</div>
                </div>
                <button
                  type="button"
                  onClick={() => setToggleConfirmModal({ open: true, featureKey: 'wordchain', featureName: 'Minigame Nối Từ', currentStatus: realStats.features.wordchain })}
                  className={`text-xs font-mono px-3 py-1 rounded border transition cursor-pointer font-bold ${realStats.features.wordchain ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'}`}
                >
                  {realStats.features.wordchain ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-[#2a2d34] pb-3">
                <div>
                  <div className="text-xs font-semibold text-white">Minigame Sắp Xếp Từ (WordScramble)</div>
                  <div className="text-[11px] text-zinc-400">Đố xáo trộn chữ cái tiếng Việt trong kênh giải trí</div>
                </div>
                <button
                  type="button"
                  onClick={() => setToggleConfirmModal({ open: true, featureKey: 'wordscramble', featureName: 'Minigame Sắp Xếp Từ', currentStatus: realStats.features.wordscramble })}
                  className={`text-xs font-mono px-3 py-1 rounded border transition cursor-pointer font-bold ${realStats.features.wordscramble ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'}`}
                >
                  {realStats.features.wordscramble ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Săn Code Wuthering Waves Watcher</div>
                  <div className="text-[11px] text-zinc-400">Tự động cào code mới từ Fandom Wiki và gửi tin nhắn</div>
                </div>
                <button
                  type="button"
                  onClick={() => setToggleConfirmModal({ open: true, featureKey: 'wuwaWatcher', featureName: 'Săn Code Wuthering Waves', currentStatus: realStats.features.wuwaWatcher })}
                  className={`text-xs font-mono px-3 py-1 rounded border transition cursor-pointer font-bold ${realStats.features.wuwaWatcher ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'}`}
                >
                  {realStats.features.wuwaWatcher ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                </button>
              </div>
            </div>
          </main>
        )}

      </div>

      {/* FLOATING ACTION BUTTONS AT BOTTOM RIGHT */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2.5 z-50">
        {activeTab === 'builder' && (
          <button
            onClick={scrollToPreview}
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white p-3 rounded-full shadow-2xl transition duration-200 cursor-pointer flex items-center justify-center border border-[#5865f2]/40"
            title="Xem Preview nhanh"
          >
            <Eye className="w-5 h-5" />
          </button>
        )}

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="bg-[#16171a] hover:bg-[#1c1e22] text-white p-3 rounded-full shadow-2xl transition duration-200 cursor-pointer border border-[#2a2d34] flex items-center justify-center"
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
