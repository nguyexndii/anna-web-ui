import React, { useState, useRef, useEffect } from 'react';
import DiscordEmbedPreview from './DiscordEmbedPreview';
import {
  Layers, MessageSquare, Sparkles, ChevronDown, Check, ListFilter, Hash, Plus, Trash2, Link, Image, Info, Send, Eye
} from 'lucide-react';

export default function EmbedBuilderTab({
  channels = [],
  selectedGuildId,
  formData,
  setFormData,
  msgMode,
  setMsgMode,
  sending,
  onPreSubmit,
  previewRef,
  scrollToPreview
}) {
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [useManualChannel, setUseManualChannel] = useState(false);

  const templateRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (templateRef.current && !templateRef.current.contains(event.target)) {
        setTemplateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colorPresets = [
    { name: 'Blurple', hex: '#5865f2' },
    { name: 'Xanh lá', hex: '#22c55e' },
    { name: 'Vàng cam', hex: '#f59e0b' },
    { name: 'Đỏ', hex: '#ef4444' },
    { name: 'Xanh lam', hex: '#06b6d4' },
    { name: 'Tím', hex: '#a855f7' },
    { name: 'Xám', hex: '#4f545c' }
  ];

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

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
  const activeGuildChannels = (channels || []).filter((ch) => ch && (!selectedGuildId || ch.guildId === selectedGuildId));

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
        setFormData((prev) => ({ ...prev, content: tmpl.content || '' }));
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

  return (
    <main className="p-6 max-w-4xl space-y-6">
      
      {/* UNIFIED FORM CONTAINER */}
      <div className="bg-discord-card border border-[#383a40] rounded-lg p-6 space-y-5">
        
        <div className="flex flex-wrap items-center justify-between border-b border-[#383a40] pb-4 gap-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              {msgMode === 'embed' ? <Layers className="w-4 h-4 text-discord-accent" /> : <MessageSquare className="w-4 h-4 text-discord-accent" />}
              {msgMode === 'embed' ? 'Soạn Bài Đăng Embed Card' : 'Soạn Tin Nhắn Thường (Văn Bản Thuần)'}
            </h2>
            <p className="text-xs text-discord-muted mt-0.5">
              Chọn Mẫu Nhanh ở bên phải để thay đổi nhanh định dạng bài viết bên dưới
            </p>
          </div>

          {/* Unified Template Selector */}
          <div className="relative flex items-center space-x-2" ref={templateRef}>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-discord-muted">Mẫu nhanh:</span>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setTemplateMenuOpen(!templateMenuOpen)}
                className="bg-discord-dark hover:bg-discord-cardHover border border-[#383a40] text-white text-xs rounded px-3 py-1.5 outline-none flex items-center justify-between min-w-[220px] transition cursor-pointer shadow-sm"
              >
                <span className="truncate">{selectedTemplate ? selectedTemplate.name : '-- Chọn mẫu bài đăng --'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-discord-muted ml-2 transition-transform duration-200 ${templateMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {templateMenuOpen && (
                <div className="absolute right-0 mt-1 w-72 bg-discord-card border border-[#383a40] rounded shadow-2xl py-1 z-50 text-left space-y-1 animate-in fade-in duration-100">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => applyTemplateById(t.id)}
                      className={`w-full px-3 py-2 text-xs text-left flex items-center justify-between transition cursor-pointer hover:bg-discord-cardHover ${selectedTemplateId === t.id ? 'bg-discord-cardHover text-discord-accent font-semibold' : 'text-discord-text'}`}
                    >
                      <span className="truncate">{t.name}</span>
                      {selectedTemplateId === t.id && <Check className="w-3.5 h-3.5 text-discord-accent flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mode Toggle Checkbox */}
        <div className="bg-discord-dark p-2.5 rounded border border-[#383a40] flex items-center justify-between">
          <span className="text-xs text-discord-text font-medium">Định dạng hiển thị bài viết:</span>
          <div className="flex items-center space-x-3 text-xs">
            <button
              type="button"
              onClick={() => setMsgMode('embed')}
              className={`px-3 py-1 rounded transition cursor-pointer font-semibold ${msgMode === 'embed' ? 'bg-discord-accent text-white' : 'text-discord-muted hover:text-white'}`}
            >
              📌 Embed Card
            </button>
            <button
              type="button"
              onClick={() => setMsgMode('plain')}
              className={`px-3 py-1 rounded transition cursor-pointer font-semibold ${msgMode === 'plain' ? 'bg-discord-accent text-white' : 'text-discord-muted hover:text-white'}`}
            >
              💬 Tin Nhắn Thường
            </button>
          </div>
        </div>

        <form onSubmit={onPreSubmit} className="space-y-4">
          
          {/* Channel Selector */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-discord-muted">
                Kênh Discord Nhận Bài <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setUseManualChannel(!useManualChannel)}
                className="text-xs text-discord-accent hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                {useManualChannel ? <ListFilter className="w-3 h-3" /> : <Hash className="w-3 h-3" />}
                <span>{useManualChannel ? 'Dùng Dropdown Danh Sách Kênh' : 'Nhập Channel ID thủ công'}</span>
              </button>
            </div>

            {!useManualChannel && activeGuildChannels.length > 0 ? (
              <select
                value={formData.channelId}
                onChange={(e) => handleChange('channelId', e.target.value)}
                className="w-full bg-discord-dark border border-[#383a40] text-white text-xs rounded p-2.5 outline-none focus:border-discord-accent cursor-pointer"
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
                className="w-full bg-discord-dark border border-[#383a40] text-white text-xs rounded p-2.5 outline-none focus:border-discord-accent"
              />
            )}
          </div>

          {/* MODE 1: PLAIN TEXT MESSAGE INTERFACE */}
          {msgMode === 'plain' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold uppercase tracking-wider text-discord-muted">
                  Nội dung Tin Nhắn Văn Bản Thuần Túy <span className="text-rose-400">*</span>
                </label>

                <div className="flex items-center space-x-1 bg-discord-dark px-2 py-0.5 rounded border border-[#383a40] text-xs">
                  <button type="button" onClick={() => insertMarkdown('**', '**')} className="hover:bg-discord-cardHover text-white px-1.5 py-0.5 rounded font-bold" title="In đậm">B</button>
                  <button type="button" onClick={() => insertMarkdown('*', '*')} className="hover:bg-discord-cardHover text-white px-1.5 py-0.5 rounded italic" title="In nghiêng">I</button>
                  <button type="button" onClick={() => insertMarkdown('`', '`')} className="hover:bg-discord-cardHover text-white px-1.5 py-0.5 rounded font-mono" title="Code">Code</button>
                  <button type="button" onClick={() => insertMarkdown('> ')} className="hover:bg-discord-cardHover text-white px-1.5 py-0.5 rounded" title="Trích dẫn">&gt; Quote</button>
                </div>
              </div>

              <textarea
                id="plain-msg-textarea"
                rows={6}
                value={formData.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Nhập nội dung tin nhắn thường tại đây... Dùng Shift + Enter để xuống dòng mượt mà!"
                className="w-full bg-discord-dark border border-[#383a40] text-white text-xs rounded p-3 outline-none focus:border-discord-accent font-sans leading-relaxed resize-y"
              ></textarea>

              <p className="text-[11px] text-discord-muted">💡 Ở chế độ này, bài đăng sẽ chỉ là tin nhắn chữ thường chuẩn Discord, hoàn toàn không kèm theo bất cứ khung Embed hay dải viền nào.</p>
            </div>
          )}

          {/* MODE 2: FULL EMBED CARD INTERFACE */}
          {msgMode === 'embed' && (
            <>
              <div className="bg-discord-dark p-3 rounded border border-[#383a40] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-discord-muted flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-discord-accent" /> Tin nhắn ngoài Embed (Nơi đính kèm Tag @everyone, @role)
                  </label>
                </div>

                <input
                  type="text"
                  value={formData.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Ví dụ: @everyone Thông báo bảo trì hệ thống!"
                  className="w-full bg-discord-card border border-[#383a40] text-white text-xs rounded p-2 outline-none focus:border-discord-accent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-discord-muted mb-1">
                    Tiêu đề Embed Card (Title)
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Tiêu đề chính của Embed..."
                    className="w-full bg-discord-dark border border-[#383a40] text-white text-xs rounded p-2.5 outline-none focus:border-discord-accent"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-discord-muted mb-1 flex items-center justify-between">
                    <span>Màu viền Embed</span>
                    <span className="font-mono text-[10px] text-discord-text">{formData.color}</span>
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-discord-muted mb-1 flex items-center gap-1">
                  <Link className="w-3.5 h-3.5 text-discord-accent" /> Đường dẫn liên kết tiêu đề (URL)
                </label>
                <input
                  type="text"
                  value={formData.url || ''}
                  onChange={(e) => handleChange('url', e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-discord-dark border border-[#383a40] text-white text-xs rounded p-2.5 outline-none focus:border-discord-accent"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-discord-muted">
                    Nội dung bài viết Embed (Description)
                  </label>

                  <div className="flex items-center space-x-1 bg-discord-dark px-2 py-0.5 rounded border border-[#383a40] text-xs">
                    <button type="button" onClick={() => insertMarkdown('**', '**')} className="hover:bg-discord-cardHover text-white px-1.5 py-0.5 rounded font-bold" title="In đậm">B</button>
                    <button type="button" onClick={() => insertMarkdown('*', '*')} className="hover:bg-discord-cardHover text-white px-1.5 py-0.5 rounded italic" title="In nghiêng">I</button>
                    <button type="button" onClick={() => insertMarkdown('`', '`')} className="hover:bg-discord-cardHover text-white px-1.5 py-0.5 rounded font-mono" title="Code">Code</button>
                    <button type="button" onClick={() => insertMarkdown('> ')} className="hover:bg-discord-cardHover text-white px-1.5 py-0.5 rounded" title="Trích dẫn">&gt; Quote</button>
                    <button type="button" onClick={() => insertMarkdown('[Tên Link](', ')')} className="hover:bg-discord-cardHover text-white px-1.5 py-0.5 rounded" title="Link">Link</button>
                  </div>
                </div>

                <textarea
                  id="desc-textarea"
                  rows={7}
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Nhập nội dung bài viết..."
                  className="w-full bg-discord-dark border border-[#383a40] text-white text-xs rounded p-3 outline-none focus:border-discord-accent font-mono leading-relaxed resize-y"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-discord-muted mb-1 flex items-center gap-1">
                    <Image className="w-3.5 h-3.5 text-discord-accent" /> Link Ảnh Banner Lớn (Image URL)
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    placeholder="https://i.imgur.com/..."
                    className="w-full bg-discord-dark border border-[#383a40] text-white text-xs rounded p-2.5 outline-none focus:border-discord-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-discord-muted mb-1 flex items-center gap-1">
                    <Image className="w-3.5 h-3.5 text-discord-accent" /> Link Thumbnail Nhỏ (Góc phải)
                  </label>
                  <input
                    type="text"
                    value={formData.thumbnailUrl || ''}
                    onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-discord-dark border border-[#383a40] text-white text-xs rounded p-2.5 outline-none focus:border-discord-accent"
                  />
                </div>
              </div>

              <div className="border-t border-[#383a40] pt-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-discord-muted">Các ô thông tin phụ (Fields)</label>
                  </div>
                  <button
                    type="button"
                    onClick={addField}
                    className="text-xs bg-discord-dark hover:bg-discord-cardHover text-white px-2.5 py-1 rounded border border-[#383a40] flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-discord-accent" /> Thêm ô mới
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.fields || []).map((field, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 bg-discord-dark p-2 rounded border border-[#383a40]">
                      <input
                        type="text"
                        placeholder="Tên ô"
                        value={field.name || ''}
                        onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                        className="w-full md:w-1/3 bg-discord-card text-white text-xs rounded p-2 outline-none border border-[#383a40]"
                      />
                      <input
                        type="text"
                        placeholder="Giá trị ô"
                        value={field.value || ''}
                        onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                        className="w-full md:w-5/12 bg-discord-card text-white text-xs rounded p-2 outline-none border border-[#383a40]"
                      />
                      <label className="flex items-center space-x-1.5 text-xs text-discord-text cursor-pointer bg-discord-card px-2.5 py-1.5 rounded border border-[#383a40]" title="Nếu tích chọn, ô này sẽ xếp nằm ngang trên cùng 1 hàng với ô bên cạnh">
                        <input
                          type="checkbox"
                          checked={!!field.inline}
                          onChange={(e) => handleFieldChange(idx, 'inline', e.target.checked)}
                          className="rounded bg-discord-dark text-discord-accent"
                        />
                        <span>Xếp cùng 1 hàng ngang (Inline)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeField(idx)}
                        className="text-discord-muted hover:text-rose-400 p-1.5 transition cursor-pointer ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#383a40] pt-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-discord-muted mb-1">
                    Tên Tác Giả (Để trống nếu không dùng Dòng Tác Giả nhỏ)
                  </label>
                  <input
                    type="text"
                    value={formData.authorName || ''}
                    onChange={(e) => handleChange('authorName', e.target.value)}
                    placeholder="Để trống nếu không muốn dùng..."
                    className="w-full bg-discord-dark border border-[#383a40] text-white text-xs rounded p-2.5 outline-none focus:border-discord-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-discord-muted mb-1">
                    Dòng Chân Trang (Footer Text)
                  </label>
                  <input
                    type="text"
                    value={formData.footerText || ''}
                    onChange={(e) => handleChange('footerText', e.target.value)}
                    placeholder="Hệ thống tự động..."
                    className="w-full bg-discord-dark border border-[#383a40] text-white text-xs rounded p-2.5 outline-none focus:border-discord-accent"
                  />
                </div>
              </div>
            </>
          )}

          {/* ONE SINGLE UNIFIED HELP BOX COMBINING ALL FORMATTING RULES */}
          <div className="bg-discord-dark p-3 rounded border border-[#383a40] space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Info className="w-4 h-4 text-discord-accent" /> Cụm Hướng Dẫn Định Dạng & Tag Discord Chuẩn:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <div><span className="text-white font-bold">**in đậm**</span> ➔ <strong>in đậm</strong></div>
              <div><span className="text-white font-bold">*in nghiêng*</span> ➔ <em>in nghiêng</em></div>
              <div><span className="text-white font-bold">`code`</span> ➔ <code className="bg-discord-card px-1 rounded text-zinc-200">code</code></div>
              <div><span className="text-white font-bold">&gt; trích dẫn</span> ➔ Trích dẫn</div>
              <div><span className="text-emerald-400 font-bold">&lt;@ID_USER&gt;</span> ➔ Tag User</div>
              <div><span className="text-amber-400 font-bold">&lt;@&amp;ID_ROLE&gt;</span> ➔ Tag Role</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#383a40] flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={sending}
              className="flex-1 bg-discord-accent hover:bg-discord-hover disabled:opacity-50 text-white font-bold py-3 px-5 rounded flex items-center justify-center space-x-2 transition duration-150 shadow-lg cursor-pointer text-xs uppercase tracking-wider"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Đang đăng bài...' : 'ĐĂNG BÀI VIẾT NÀY'}</span>
            </button>

            <button
              type="button"
              onClick={scrollToPreview}
              className="bg-discord-dark hover:bg-discord-cardHover text-white font-medium py-3 px-4 rounded border border-[#383a40] flex items-center justify-center space-x-1.5 transition cursor-pointer text-xs"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Xem Preview</span>
            </button>
          </div>
        </form>
      </div>

      {/* LIVE PREVIEW CONTAINER AT THE BOTTOM */}
      <div ref={previewRef} className="space-y-2 pt-2 border-t border-[#383a40]">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-discord-muted flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-emerald-400" /> XEM TRƯỚC BÀI ĐĂNG (LIVE PREVIEW DISCORD)
          </h2>
          <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Giao diện Discord
          </span>
        </div>

        <DiscordEmbedPreview embedData={msgMode === 'plain' ? { content: formData.content } : formData} />
      </div>

    </main>
  );
}
