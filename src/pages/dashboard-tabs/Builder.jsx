import React, { useState } from 'react';
import DiscordEmbedPreview from '../../components/DiscordEmbedPreview';
import { Plus, Trash2 } from 'lucide-react';

export default function Builder({
  channels = [],
  guildId,
  formData,
  setFormData,
  msgMode,
  setMsgMode,
  sending,
  onPreSubmit,
  previewRef,
  scrollToPreview
}) {
  const [useManualChannel, setUseManualChannel] = useState(false);

  const colorPresets = [
    { name: 'Blurple', hex: '#5865f2' },
    { name: 'Xanh lá', hex: '#22c55e' },
    { name: 'Vàng cam', hex: '#f59e0b' },
    { name: 'Đỏ', hex: '#ef4444' },
    { name: 'Xanh lam', hex: '#06b6d4' },
    { name: 'Tím', hex: '#a855f7' },
    { name: 'Xám', hex: '#4f545c' }
  ];

  const activeGuildChannels = (channels || []).filter((ch) => ch && (!guildId || ch.guildId === guildId));

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
    <div className="space-y-8">
      
      {/* UNIFIED FORM CONTAINER */}
      <div className="bg-anna-card border border-anna-border rounded-2xl p-7 space-y-6 shadow-xl">
        
        <div className="flex flex-wrap items-center justify-between border-b border-anna-border pb-4 gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {msgMode === 'embed' ? 'Soạn Bài Đăng Embed Card' : 'Soạn Tin Nhắn Thường (Văn Bản Thuần)'}
            </h2>
            <p className="text-xs text-anna-muted mt-1 font-normal">
              Soạn nội dung bài viết và xem trước giao diện hiển thị trên Discord
            </p>
          </div>

          {/* Mode Toggle Checkbox */}
          <div className="flex items-center space-x-2 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setMsgMode('embed')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer ${msgMode === 'embed' ? 'bg-anna-accent text-white shadow-md' : 'bg-anna-dark text-anna-muted hover:text-white'}`}
            >
              Embed Card
            </button>
            <button
              type="button"
              onClick={() => setMsgMode('plain')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer ${msgMode === 'plain' ? 'bg-anna-accent text-white shadow-md' : 'bg-anna-dark text-anna-muted hover:text-white'}`}
            >
              Tin Nhắn Thường
            </button>
          </div>
        </div>

        <form onSubmit={onPreSubmit} className="space-y-5">
          
          {/* Channel Selector */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted">
                Kênh Discord Nhận Bài <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setUseManualChannel(!useManualChannel)}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <span>{useManualChannel ? 'Dùng Dropdown Danh Sách Kênh' : 'Nhập Channel ID thủ công'}</span>
              </button>
            </div>

            {!useManualChannel && activeGuildChannels.length > 0 ? (
              <select
                value={formData.channelId}
                onChange={(e) => handleChange('channelId', e.target.value)}
                className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent cursor-pointer font-medium"
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
                className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent font-mono"
              />
            )}
          </div>

          {/* MODE 1: PLAIN TEXT MESSAGE INTERFACE */}
          {msgMode === 'plain' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted">
                  Nội dung Tin Nhắn Văn Bản Thuần Túy <span className="text-rose-400">*</span>
                </label>

                <div className="flex items-center space-x-1 bg-anna-dark px-2.5 py-1 rounded-lg border border-anna-border text-xs">
                  <button type="button" onClick={() => insertMarkdown('**', '**')} className="hover:bg-slate-800 text-white px-2 py-0.5 rounded font-bold" title="In đậm">B</button>
                  <button type="button" onClick={() => insertMarkdown('*', '*')} className="hover:bg-slate-800 text-white px-2 py-0.5 rounded italic" title="In nghiêng">I</button>
                  <button type="button" onClick={() => insertMarkdown('`', '`')} className="hover:bg-slate-800 text-white px-2 py-0.5 rounded font-mono" title="Code">Code</button>
                  <button type="button" onClick={() => insertMarkdown('> ')} className="hover:bg-slate-800 text-white px-2 py-0.5 rounded" title="Trích dẫn">&gt; Quote</button>
                </div>
              </div>

              <textarea
                id="plain-msg-textarea"
                rows={6}
                value={formData.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Nhập nội dung tin nhắn thường tại đây..."
                className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3.5 outline-none focus:border-anna-accent font-sans leading-relaxed resize-y"
              ></textarea>
            </div>
          )}

          {/* MODE 2: FULL EMBED CARD INTERFACE */}
          {msgMode === 'embed' && (
            <>
              <div className="bg-anna-dark p-4 rounded-xl border border-anna-border space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted">
                  Tin nhắn ngoài Embed (Tag @everyone, @role)
                </label>

                <input
                  type="text"
                  value={formData.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Ví dụ: @everyone Thông báo bảo trì hệ thống!"
                  className="w-full bg-anna-card border border-anna-border text-white text-sm rounded-xl p-2.5 outline-none focus:border-anna-accent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-8">
                  <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted mb-1.5">
                    Tiêu đề Embed Card (Title)
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Tiêu đề chính của Embed..."
                    className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent font-semibold"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted mb-1.5 flex items-center justify-between">
                    <span>Màu viền Embed</span>
                    <span className="font-mono text-xs text-anna-text">{formData.color}</span>
                  </label>
                  <div className="flex items-center space-x-2 pt-1">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => handleChange('color', preset.hex)}
                        className={`w-7 h-7 rounded-full border-2 transition ${formData.color === preset.hex ? 'border-white scale-110 ring-2 ring-white shadow-lg' : 'border-transparent opacity-75 hover:opacity-100'}`}
                        style={{ backgroundColor: preset.hex }}
                        title={preset.name}
                      />
                    ))}
                    <input
                      type="color"
                      value={formData.color || '#5865f2'}
                      onChange={(e) => handleChange('color', e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
                      title="Màu tùy chỉnh"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted mb-1.5">
                  Đường dẫn liên kết tiêu đề (URL)
                </label>
                <input
                  type="text"
                  value={formData.url || ''}
                  onChange={(e) => handleChange('url', e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted">
                    Nội dung bài viết Embed (Description)
                  </label>

                  <div className="flex items-center space-x-1 bg-anna-dark px-2.5 py-1 rounded-lg border border-anna-border text-xs">
                    <button type="button" onClick={() => insertMarkdown('**', '**')} className="hover:bg-slate-800 text-white px-2 py-0.5 rounded font-bold" title="In đậm">B</button>
                    <button type="button" onClick={() => insertMarkdown('*', '*')} className="hover:bg-slate-800 text-white px-2 py-0.5 rounded italic" title="In nghiêng">I</button>
                    <button type="button" onClick={() => insertMarkdown('`', '`')} className="hover:bg-slate-800 text-white px-2 py-0.5 rounded font-mono" title="Code">Code</button>
                    <button type="button" onClick={() => insertMarkdown('> ')} className="hover:bg-slate-800 text-white px-2 py-0.5 rounded" title="Trích dẫn">&gt; Quote</button>
                    <button type="button" onClick={() => insertMarkdown('[Tên Link](', ')')} className="hover:bg-slate-800 text-white px-2 py-0.5 rounded" title="Link">Link</button>
                  </div>
                </div>

                <textarea
                  id="desc-textarea"
                  rows={7}
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Nhập nội dung bài viết..."
                  className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3.5 outline-none focus:border-anna-accent font-mono leading-relaxed resize-y"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted mb-1.5">
                    Link Ảnh Banner Lớn (Image URL)
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    placeholder="https://i.imgur.com/..."
                    className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted mb-1.5">
                    Link Thumbnail Nhỏ (Góc phải)
                  </label>
                  <input
                    type="text"
                    value={formData.thumbnailUrl || ''}
                    onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent"
                  />
                </div>
              </div>

              <div className="border-t border-anna-border pt-5">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-anna-muted">Các ô thông tin phụ (Fields)</label>
                  </div>
                  <button
                    type="button"
                    onClick={addField}
                    className="text-xs bg-anna-dark hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl border border-anna-border flex items-center gap-1 transition cursor-pointer font-bold"
                  >
                    <Plus className="w-4 h-4 text-anna-accent" /> Thêm ô mới
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.fields || []).map((field, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-3 bg-anna-dark p-3 rounded-xl border border-anna-border">
                      <input
                        type="text"
                        placeholder="Tên ô"
                        value={field.name || ''}
                        onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                        className="w-full md:w-1/3 bg-anna-card text-white text-sm rounded-xl p-2.5 outline-none border border-anna-border font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Giá trị ô"
                        value={field.value || ''}
                        onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                        className="w-full md:w-5/12 bg-anna-card text-white text-sm rounded-xl p-2.5 outline-none border border-anna-border font-medium"
                      />
                      <label className="flex items-center space-x-2 text-xs font-semibold text-anna-text cursor-pointer bg-anna-card px-3 py-2 rounded-xl border border-anna-border">
                        <input
                          type="checkbox"
                          checked={!!field.inline}
                          onChange={(e) => handleFieldChange(idx, 'inline', e.target.checked)}
                          className="rounded bg-anna-dark text-anna-accent"
                        />
                        <span>Xếp cùng 1 hàng ngang (Inline)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeField(idx)}
                        className="text-anna-muted hover:text-rose-400 p-2 transition cursor-pointer ml-auto"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-anna-border pt-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted mb-1.5">
                    Tên Tác Giả
                  </label>
                  <input
                    type="text"
                    value={formData.authorName || ''}
                    onChange={(e) => handleChange('authorName', e.target.value)}
                    placeholder="Để trống nếu không muốn dùng..."
                    className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted mb-1.5">
                    Dòng Chân Trang (Footer Text)
                  </label>
                  <input
                    type="text"
                    value={formData.footerText || ''}
                    onChange={(e) => handleChange('footerText', e.target.value)}
                    placeholder="Hệ thống tự động..."
                    className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-5 border-t border-anna-border flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={sending}
              className="flex-1 bg-anna-accent hover:bg-anna-hover disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center transition duration-150 shadow-xl cursor-pointer text-sm uppercase tracking-wider"
            >
              <span>{sending ? 'Đang đăng bài...' : 'ĐĂNG BÀI VIẾT NÀY'}</span>
            </button>

            <button
              type="button"
              onClick={scrollToPreview}
              className="bg-anna-dark hover:bg-anna-cardHover text-white font-bold py-4 px-6 rounded-2xl border border-anna-border flex items-center justify-center transition cursor-pointer text-sm shadow-md"
            >
              <span>Xem Preview</span>
            </button>
          </div>
        </form>
      </div>

      {/* LIVE PREVIEW CONTAINER AT THE BOTTOM */}
      <div ref={previewRef} className="space-y-3 pt-3 border-t border-anna-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-anna-muted">
            XEM TRƯỚC BÀI ĐĂNG (LIVE PREVIEW DISCORD)
          </h2>
          <span className="text-xs text-emerald-400 font-bold">
            Giao diện Discord
          </span>
        </div>

        <DiscordEmbedPreview embedData={msgMode === 'plain' ? { content: formData.content } : formData} />
      </div>

    </div>
  );
}
