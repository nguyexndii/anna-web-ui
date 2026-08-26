import React, { useState, useEffect } from 'react';
import DiscordEmbedPreview from './components/DiscordEmbedPreview';
import { Send, Image, Link, Type, Palette, Plus, Trash2, Radio, CheckCircle, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function App() {
  const [backendUrl, setBackendUrl] = useState('http://localhost:3000');
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

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

  // Preset Template Quick Fills (Ví dụ: Code Game, Thông báo Server)
  const templates = [
    {
      name: 'Code Game (Honkai / Genshin / WuWa)',
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
      title: '📢 THÔNG BÁO BẢO TRÌ HỆ THỐNG',
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
      console.log("Chưa kết nối được Backend API:", backendUrl);
    } finally {
      setLoadingChannels(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [backendUrl]);

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
      title: tmpl.title,
      description: tmpl.description,
      url: tmpl.url || '',
      color: tmpl.color,
      imageUrl: tmpl.imageUrl || '',
      authorName: tmpl.authorName || 'Anna Bot',
      footerText: tmpl.footerText || ''
    }));
  };

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

  return (
    <div className="min-h-screen bg-[#1e1f22] text-[#dbdee1] font-sans antialiased">
      {/* Navbar */}
      <header className="bg-[#2b2d31] border-b border-[#383a40] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#5865f2] flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Anna Dashboard</h1>
            <p className="text-xs text-[#949ba4]">Discord Embed Message Builder</p>
          </div>
        </div>

        {/* Backend Endpoint Input */}
        <div className="flex items-center space-x-2 bg-[#1e1f22] px-3 py-1.5 rounded border border-[#383a40]">
          <span className="text-xs text-[#949ba4] font-medium">Server API:</span>
          <input
            type="text"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            className="bg-transparent text-xs text-white outline-none w-48 font-mono"
            placeholder="http://localhost:3000"
          />
          <button
            onClick={fetchChannels}
            className="text-[#949ba4] hover:text-white transition p-0.5"
            title="Kiểm tra kết nối & Tải lại Kênh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingChannels ? 'animate-spin' : ''}`} />
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
                <Sparkles className="w-3 h-3" /> Mẫu nhanh:
              </span>
              {templates.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => applyTemplate(t)}
                  type="button"
                  className="text-xs bg-[#1e1f22] hover:bg-[#35373c] text-white px-2.5 py-1 rounded border border-[#383a40] transition"
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
            
            {/* Channel Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase text-[#949ba4] mb-1">
                Kênh Discord đăng bài <span className="text-rose-400">*</span>
              </label>
              {channels.length > 0 ? (
                <select
                  value={formData.channelId}
                  onChange={(e) => handleChange('channelId', e.target.value)}
                  className="w-full bg-[#1e1f22] border border-[#383a40] text-white text-sm rounded p-2.5 outline-none focus:border-[#5865f2]"
                >
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      #{ch.name} ({ch.guildName})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Nhập Channel ID (vd: 1450073214620405903)"
                  value={formData.channelId}
                  onChange={(e) => handleChange('channelId', e.target.value)}
                  className="w-full bg-[#1e1f22] border border-[#383a40] text-white text-sm rounded p-2.5 outline-none focus:border-[#5865f2]"
                />
              )}
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
                Nội dung bài viết (Description)
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
                  className="text-xs bg-[#1e1f22] hover:bg-[#35373c] text-white px-2.5 py-1 rounded border border-[#383a40] flex items-center gap-1 transition"
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
                      className="text-[#949ba4] hover:text-rose-400 p-1 transition"
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
                className="w-full bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white font-semibold py-3 rounded flex items-center justify-center space-x-2 transition duration-150"
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

          <div className="sticky top-6">
            <DiscordEmbedPreview embedData={formData} />
          </div>
        </div>

      </main>
    </div>
  );
}
