import React, { useState, useEffect } from 'react';
import DiscordEmbedPreview from './components/DiscordEmbedPreview';
import { Send, Image, Link, Type, Palette, Plus, Trash2, CheckCircle, AlertCircle, RefreshCw, Sparkles, MessageSquare, ListFilter, Hash, LogOut, ShieldCheck, Lock } from 'lucide-react';

export default function App() {
  const [backendUrl, setBackendUrl] = useState('http://localhost:3000');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [useManualChannel, setUseManualChannel] = useState(false);

  // Preset Discord Color Swatches
  const colorPresets = [
    { name: 'Blurple', hex: '#5865f2' },
    { name: 'Xanh lá', hex: '#22c55e' },
    { name: 'Vàng cam', hex: '#f59e0b' },
    { name: 'Đỏ', hex: '#ef4444' },
    { name: 'Xanh lam', hex: '#06b6d4' },
    { name: 'Tím', hex: '#a855f7' },
    { name: 'Xám Discord', hex: '#4f545c' }
  ];

  // Preset Templates
  const templates = [
    {
      name: 'Code Game (Honkai / WuWa)',
      content: '@everyone Mã quà tặng game mới nhất nè!',
      title: 'Code Livestream Mới Nhất!',
      description: 'Phiên bản 4.5 – Tìm thấy 1 mã code nhận quà!\n\n**Mã Code:**\n`2TKRKAR6YG2X`\n\n**Phần thưởng:** 100 Stellar Jade, 50,000 Credit',
      url: 'https://hsr.hoyoverse.com/',
      color: '#5865f2',
      imageUrl: 'https://i.imgur.com/wSTFkRM.png',
      authorName: 'Anna Game Watcher',
      footerText: 'Hệ thống tự động • Cập nhật vừa xong'
    },
    {
      name: 'Thông Báo Server',
      content: '📌 **THÔNG BÁO TỪ BQT SERVER**',
      title: 'BẢO TRÌ HỆ THỐNG ĐỊNH KỲ',
      description: 'Xin chào toàn thể thành viên,\n\nHệ thống sẽ tiến hành bảo trì định kỳ để nâng cấp máy chủ.\nThời gian dự kiến: **00:00 - 02:00**.\n\nRất mong các bạn thông cảm!',
      url: '',
      color: '#f59e0b',
      imageUrl: '',
      authorName: 'Anna Admin',
      footerText: 'Ban Quản Trị Server'
    }
  ];

  // Form State
  const [formData, setFormData] = useState({
    channelId: '',
    content: '@everyone Mã quà tặng game mới!',
    title: 'Code livestream Honkai: Star Rail',
    description: 'Phiên bản 4.5 – Tìm thấy 1 code!\n\n**Code 1**\n`2TKRKAR6YG2X`\nPhần thưởng: Stellar Jade, 50,000 Credit ×100',
    url: 'https://hsr.hoyoverse.com/',
    color: '#5865f2',
    imageUrl: 'https://i.imgur.com/wSTFkRM.png',
    thumbnailUrl: '',
    authorName: 'Anna Bot',
    authorIcon: 'https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
    footerText: 'Hệ thống thông báo tự động',
    footerIcon: '',
    fields: [
      { name: '► Official Livestream', value: 'Watch on YouTube', inline: true }
    ]
  });

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

  // Handle Discord OAuth2 Redirect Callback (?code=...)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
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
            setStatusMsg(null); // Clear error message on successful login
            localStorage.setItem('anna_user', JSON.stringify({ user: data.user, isAdmin: data.isAdmin }));
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setStatusMsg({ type: 'error', text: data.error || 'Đăng nhập thất bại!' });
          }
        })
        .catch(() => {
          setStatusMsg({ type: 'error', text: 'Lỗi kết nối tới Server API Đăng Nhập!' });
        })
        .finally(() => {
          setAuthLoading(false);
        });
    }
  }, [backendUrl]);

  // Fetch channels if user is logged in
  const fetchChannels = async () => {
    setLoadingChannels(true);
    try {
      const res = await fetch(`${backendUrl}/api/channels`);
      const data = await res.json();
      if (data.success && data.channels) {
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

  useEffect(() => {
    if (user) {
      fetchChannels();
    }
  }, [user, backendUrl]);

  // Handle Login with Discord Redirect
  const handleDiscordLogin = async () => {
    setAuthLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`${backendUrl}/api/auth/url`);
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Vui lòng cấu hình CLIENT_ID trong file .env Backend!' });
        setAuthLoading(false);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Không kết nối được với Server Backend!' });
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setStatusMsg(null);
    localStorage.removeItem('anna_user');
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...formData.fields];
    updatedFields[index][key] = value;
    setFormData((prev) => ({ ...prev, fields: updatedFields }));
  };

  const addField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, { name: '', value: '', inline: false }]
    }));
  };

  const removeField = (index) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const applyTemplate = (tmpl) => {
    setFormData((prev) => ({
      ...prev,
      content: tmpl.content || '',
      title: tmpl.title,
      description: tmpl.description,
      url: tmpl.url || '',
      color: tmpl.color,
      imageUrl: tmpl.imageUrl || '',
      authorName: tmpl.authorName || 'Anna Bot',
      footerText: tmpl.footerText || ''
    }));
  };

  // Group channels by Server
  const groupedChannels = channels.reduce((acc, ch) => {
    const guild = ch.guildName || 'Khác';
    if (!acc[guild]) acc[guild] = [];
    acc[guild].push(ch);
    return acc;
  }, {});

  const handleSendEmbed = async (e) => {
    e.preventDefault();
    if (!formData.channelId) {
      setStatusMsg({ type: 'error', text: 'Vui lòng chọn Kênh Discord!' });
      return;
    }

    setSending(true);
    setStatusMsg(null);

    try {
      const res = await fetch(`${backendUrl}/api/send-embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setStatusMsg({ type: 'success', text: data.message || 'Đã gửi bài thành công!' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Lỗi gửi tin nhắn.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Không thể kết nối Backend server!' });
    } finally {
      setSending(false);
    }
  };

  // SCREEN 1: LOGIN SCREEN IF NOT LOGGED IN
  if (!user) {
    return (
      <div className="min-h-screen bg-[#1e1f22] text-[#dbdee1] flex items-center justify-center p-4">
        <div className="bg-[#2b2d31] border border-[#383a40] p-8 rounded-2xl max-w-md w-full shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#5865f2] rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white leading-tight">Anna Dashboard</h1>
            <p className="text-sm text-[#949ba4] mt-1.5">
              Đăng nhập bằng tài khoản Discord của bạn để quản lý và gửi tin nhắn Embed vào Server.
            </p>
          </div>

          {statusMsg && (
            <div className={`p-3 rounded text-xs flex items-center space-x-2 text-left ${statusMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'}`}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{statusMsg.text}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleDiscordLogin}
              disabled={authLoading}
              className="w-full bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-3 shadow-lg transition duration-200 cursor-pointer"
            >
              {authLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  <span>ĐĂNG NHẬP BẰNG DISCORD</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-4 border-t border-[#383a40]">
            <div className="flex items-center justify-between text-xs text-[#949ba4] bg-[#1e1f22] p-2.5 rounded-lg border border-[#383a40]">
              <span>API Backend:</span>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                className="bg-transparent text-xs text-white outline-none w-44 font-mono text-right"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 2: MAIN DASHBOARD WHEN LOGGED IN
  return (
    <div className="min-h-screen bg-[#1e1f22] text-[#dbdee1] font-sans antialiased">
      {/* Header Bar */}
      <header className="bg-[#2b2d31] border-b border-[#383a40] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#5865f2] flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Anna Dashboard</h1>
            <p className="text-xs text-[#949ba4]">Discord Embed Message Builder</p>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-[#1e1f22] px-3 py-1.5 rounded-lg border border-[#383a40]">
            <img src={user.avatar} alt="avatar" className="w-7 h-7 rounded-full border border-[#5865f2]" />
            <div className="text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>{user.globalName || user.username}</span>
                {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Admin Verified" />}
              </div>
              <span className="text-[10px] text-[#949ba4] font-mono">@{user.username}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs bg-[#1e1f22] hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 p-2 rounded-lg border border-[#383a40] transition flex items-center gap-1 cursor-pointer"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-[#2b2d31] rounded-lg border border-[#383a40] p-6 space-y-6 shadow-sm">
          
          <div className="flex items-center justify-between border-b border-[#383a40] pb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-[#5865f2]" /> Soạn bài đăng Embed
            </h2>

            {/* Quick Templates */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#949ba4] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Mẫu nhanh:
              </span>
              {templates.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => applyTemplate(t)}
                  type="button"
                  className="text-xs bg-[#1e1f22] hover:bg-[#35373c] text-white px-2.5 py-1 rounded border border-[#383a40] transition cursor-pointer"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {statusMsg && (
            <div className={`p-3 rounded text-sm flex items-center space-x-2 ${statusMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'}`}>
              {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSendEmbed} className="space-y-4">
            
            {/* Channel Selection Header & Toggle */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold uppercase text-[#949ba4]">
                  Kênh Discord đăng bài <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setUseManualChannel(!useManualChannel)}
                  className="text-xs text-[#5865f2] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {useManualChannel ? <ListFilter className="w-3 h-3" /> : <Hash className="w-3 h-3" />}
                  <span>{useManualChannel ? 'Dùng Dropdown danh sách' : 'Nhập Channel ID thủ công'}</span>
                </button>
              </div>

              {!useManualChannel && channels.length > 0 ? (
                <select
                  value={formData.channelId}
                  onChange={(e) => handleChange('channelId', e.target.value)}
                  className="w-full bg-[#1e1f22] border border-[#383a40] text-white text-sm rounded p-2.5 outline-none focus:border-[#5865f2] cursor-pointer"
                >
                  {Object.keys(groupedChannels).map((guildName) => (
                    <optgroup key={guildName} label={`🏰 Server: ${guildName}`}>
                      {groupedChannels[guildName].map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          #{ch.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Nhập Channel ID thủ công"
                  value={formData.channelId}
                  onChange={(e) => handleChange('channelId', e.target.value)}
                  className="w-full bg-[#1e1f22] border border-[#383a40] text-white text-sm rounded p-2.5 outline-none focus:border-[#5865f2]"
                />
              )}
            </div>

            {/* Regular Message Content Outside Embed */}
            <div className="bg-[#1e1f22] p-3 rounded border border-[#383a40] space-y-1">
              <label className="block text-xs font-semibold uppercase text-[#949ba4] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#5865f2]" /> Tin nhắn thường ngoài Embed (Tùy chọn)
              </label>
              <input
                type="text"
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Ví dụ: @everyone Mã quà tặng hot hôm nay!"
                className="w-full bg-[#2b2d31] border border-[#383a40] text-white text-sm rounded p-2 outline-none focus:border-[#5865f2]"
              />
              <p className="text-[11px] text-[#949ba4]">Nội dung này hiển thị phía trên khung Embed (Có thể dùng tag @everyone, role...)</p>
            </div>

            {/* Title & Color Swatches */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <label className="block text-xs font-semibold uppercase text-[#949ba4] mb-1">Tiêu đề (Title)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Tiêu đề bài viết..."
                  className="w-full bg-[#1e1f22] border border-[#383a40] text-white text-sm rounded p-2.5 outline-none focus:border-[#5865f2]"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold uppercase text-[#949ba4] mb-1 flex items-center justify-between">
                  <span>Màu thanh viền</span>
                  <span className="font-mono text-[10px] text-white">{formData.color}</span>
                </label>
                <div className="flex items-center space-x-1.5 pt-1">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => handleChange('color', preset.hex)}
                      className={`w-6 h-6 rounded-full border-2 transition ${formData.color === preset.hex ? 'border-white scale-110' : 'border-transparent opacity-80 hover:opacity-100'}`}
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                    title="Tự chọn màu tùy chỉnh"
                  />
                </div>
              </div>
            </div>

            {/* Title Link URL */}
            <div>
              <label className="block text-xs font-semibold uppercase text-[#949ba4] mb-1 flex items-center gap-1">
                <Link className="w-3.5 h-3.5" /> Đường dẫn liên kết tiêu đề (URL)
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#1e1f22] border border-[#383a40] text-white text-sm rounded p-2.5 outline-none focus:border-[#5865f2]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase text-[#949ba4] mb-1">
                Nội dung bài viết Embed (Description)
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Nhập nội dung tin nhắn (Hỗ trợ Markdown: **in đậm**, `mã code`, link...)"
                className="w-full bg-[#1e1f22] border border-[#383a40] text-white text-sm rounded p-2.5 outline-none focus:border-[#5865f2] font-mono leading-relaxed"
              ></textarea>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#949ba4] mb-1 flex items-center gap-1">
                  <Image className="w-3.5 h-3.5" /> Link Ảnh Banner Lớn (Image URL)
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="https://i.imgur.com/..."
                  className="w-full bg-[#1e1f22] border border-[#383a40] text-white text-sm rounded p-2.5 outline-none focus:border-[#5865f2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#949ba4] mb-1 flex items-center gap-1">
                  <Image className="w-3.5 h-3.5" /> Link Thumbnail Nhỏ (Góc phải)
                </label>
                <input
                  type="text"
                  value={formData.thumbnailUrl}
                  onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#1e1f22] border border-[#383a40] text-white text-sm rounded p-2.5 outline-none focus:border-[#5865f2]"
                />
              </div>
            </div>

            {/* Fields List */}
            <div className="border-t border-[#383a40] pt-4">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-semibold uppercase text-[#949ba4]">Các ô thông tin phụ (Fields)</label>
                <button
                  type="button"
                  onClick={addField}
                  className="text-xs bg-[#1e1f22] hover:bg-[#35373c] text-white px-2.5 py-1 rounded border border-[#383a40] flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm ô mới
                </button>
              </div>

              <div className="space-y-2.5">
                {formData.fields.map((field, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-[#1e1f22] p-2 rounded border border-[#383a40]">
                    <input
                      type="text"
                      placeholder="Tên ô"
                      value={field.name}
                      onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                      className="w-1/3 bg-[#2b2d31] text-white text-xs rounded p-2 outline-none border border-[#383a40]"
                    />
                    <input
                      type="text"
                      placeholder="Giá trị"
                      value={field.value}
                      onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                      className="w-1/2 bg-[#2b2d31] text-white text-xs rounded p-2 outline-none border border-[#383a40]"
                    />
                    <label className="flex items-center space-x-1 text-xs text-[#949ba4] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.inline}
                        onChange={(e) => handleFieldChange(idx, 'inline', e.target.checked)}
                        className="rounded bg-[#2b2d31]"
                      />
                      <span>Cùng hàng</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeField(idx)}
                      className="text-[#949ba4] hover:text-rose-400 p-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Author & Footer Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#383a40] pt-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#949ba4] mb-1">Tên Tác Giả (Author Name)</label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => handleChange('authorName', e.target.value)}
                  placeholder="Anna Bot"
                  className="w-full bg-[#1e1f22] border border-[#383a40] text-white text-sm rounded p-2.5 outline-none focus:border-[#5865f2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#949ba4] mb-1">Dòng Chân Trang (Footer Text)</label>
                <input
                  type="text"
                  value={formData.footerText}
                  onChange={(e) => handleChange('footerText', e.target.value)}
                  placeholder="Hệ thống tự động..."
                  className="w-full bg-[#1e1f22] border border-[#383a40] text-white text-sm rounded p-2.5 outline-none focus:border-[#5865f2]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#383a40]">
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white font-semibold py-3 rounded flex items-center justify-center space-x-2 transition duration-150 shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Đang gửi tới Discord...' : 'Gửi bài viết vào Discord'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Embed Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase text-[#949ba4] tracking-wider">
              XEM TRƯỚC BÀI ĐĂNG (LIVE PREVIEW)
            </h2>
            <span className="text-xs text-[#22c55e] font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span> Chuẩn Discord
            </span>
          </div>

          <div className="sticky top-20">
            <DiscordEmbedPreview embedData={formData} />
          </div>
        </div>

      </main>
    </div>
  );
}
