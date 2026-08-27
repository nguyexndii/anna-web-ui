import React, { useState, useEffect } from 'react';
import { RefreshCw, Save, CheckCircle2 } from 'lucide-react';

export default function Features({
  channels = [],
  guildId,
  backendUrl = 'http://localhost:3000',
  handleApiError
}) {
  const [config, setConfig] = useState({
    wordchainEnabled: false,
    wordchainChannelId: '',
    wordchainHintCooldownMin: 2,
    wordchainAutoPlaySec: 60,
    wordscrambleEnabled: false,
    wordscrambleChannelId: '',
    wordscrambleRoundSec: 60,
    wuwaEnabled: false,
    wuwaChannelId: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resultMsg, setResultMsg] = useState({ open: false, type: 'success', text: '' });

  const activeGuildChannels = (channels || []).filter((ch) => ch && ch.guildId === guildId);

  // Load Config for current guildId
  useEffect(() => {
    if (!guildId) return;
    setLoading(true);
    fetch(`${backendUrl}/api/guilds/${guildId}/config`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          const cfg = data.config;
          setConfig({
            wordchainEnabled: !!cfg.wordchainEnabled,
            wordchainChannelId: cfg.wordchainChannelId || '',
            wordchainHintCooldownMin: Math.round((cfg.wordchainHintCooldownMs || 120000) / 60000),
            wordchainAutoPlaySec: cfg.wordchainAutoPlaySec || 60,
            wordscrambleEnabled: !!cfg.wordscrambleEnabled,
            wordscrambleChannelId: cfg.wordscrambleChannelId || '',
            wordscrambleRoundSec: cfg.wordscrambleRoundSec || 60,
            wuwaEnabled: !!cfg.wuwaEnabled,
            wuwaChannelId: cfg.wuwaChannelId || ''
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [guildId, backendUrl]);

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setResultMsg({ open: false, type: 'success', text: '' });

    const payload = {
      wordchainEnabled: config.wordchainEnabled,
      wordchainChannelId: config.wordchainChannelId,
      wordchainHintCooldownMs: (Number(config.wordchainHintCooldownMin) || 2) * 60000,
      wordchainAutoPlaySec: Number(config.wordchainAutoPlaySec) || 60,
      wordscrambleEnabled: config.wordscrambleEnabled,
      wordscrambleChannelId: config.wordscrambleChannelId,
      wordscrambleRoundSec: Number(config.wordscrambleRoundSec) || 60,
      wuwaEnabled: config.wuwaEnabled,
      wuwaChannelId: config.wuwaChannelId
    };

    try {
      const res = await fetch(`${backendUrl}/api/guilds/${guildId}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (handleApiError && handleApiError(res, data)) return;

      if (data.success) {
        setResultMsg({
          open: true,
          type: 'success',
          text: 'Lưu cấu hình tính năng cho Server thành công!'
        });
      } else {
        setResultMsg({
          open: true,
          type: 'error',
          text: data.error || 'Lỗi lưu cấu hình tính năng!'
        });
      }
    } catch (err) {
      setResultMsg({ open: true, type: 'error', text: 'Không thể kết nối tới Backend Server!' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-anna-card border border-anna-border p-8 rounded-2xl text-center space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-anna-accent mx-auto" />
        <p className="text-sm text-anna-muted font-medium">Đang tải cấu hình tính năng của Server...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Cấu Hình Tính Năng Tự Động</h2>
        <p className="text-sm text-anna-muted font-medium mt-1">Tùy chỉnh chọn kênh phát game và cài đặt các tính năng tự động theo ý muốn</p>
      </div>

      {resultMsg.open && (
        <div className={`p-4 rounded-2xl border text-sm font-semibold flex items-center gap-2 ${
          resultMsg.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{resultMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* PANEL 1: MINIGAME NỐI TỪ */}
        <div className="bg-anna-card border border-anna-border rounded-2xl p-7 space-y-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between border-b border-anna-border pb-4 gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">1. Minigame Nối Từ (WordChain)</h3>
              <p className="text-xs text-anna-muted font-normal mt-0.5">Tự động nhận diện từ nối tiếng Việt và tính điểm xếp hạng</p>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.wordchainEnabled}
                onChange={(e) => handleChange('wordchainEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-anna-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-anna-accent"></div>
              <span className="ml-3 text-xs font-bold text-white">
                {config.wordchainEnabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Choose Channel */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted">
                Kênh Discord Nhận Tin Nhắn Nối Từ
              </label>
              {activeGuildChannels.length > 0 ? (
                <select
                  value={config.wordchainChannelId}
                  onChange={(e) => handleChange('wordchainChannelId', e.target.value)}
                  className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent font-medium cursor-pointer"
                >
                  <option value="">-- Chọn kênh chat Nối Từ --</option>
                  {activeGuildChannels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      #{ch.name} (ID: {ch.id})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Nhập Channel ID thủ công (vd: 1450073214620405903)"
                  value={config.wordchainChannelId}
                  onChange={(e) => handleChange('wordchainChannelId', e.target.value)}
                  className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent font-mono"
                />
              )}
            </div>

            {/* Hint Cooldown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted">
                Thời Gian Chờ Cho Phép Xin Gợi Ý (Phút)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={config.wordchainHintCooldownMin}
                onChange={(e) => handleChange('wordchainHintCooldownMin', e.target.value)}
                className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent font-medium"
              />
            </div>

            {/* Auto Play Time */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted">
                Thời Gian Chờ Trước Khi Bot Tự Nối Tiếp (Giây)
              </label>
              <input
                type="number"
                min={10}
                max={300}
                value={config.wordchainAutoPlaySec}
                onChange={(e) => handleChange('wordchainAutoPlaySec', e.target.value)}
                className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent font-medium"
              />
            </div>

          </div>
        </div>

        {/* PANEL 2: MINIGAME SẮP XẾP TỪ */}
        <div className="bg-anna-card border border-anna-border rounded-2xl p-7 space-y-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between border-b border-anna-border pb-4 gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">2. Minigame Sắp Xếp Từ (WordScramble)</h3>
              <p className="text-xs text-anna-muted font-normal mt-0.5">Đố xáo trộn chữ cái tiếng Việt giải trí trong server</p>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.wordscrambleEnabled}
                onChange={(e) => handleChange('wordscrambleEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-anna-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-anna-accent"></div>
              <span className="ml-3 text-xs font-bold text-white">
                {config.wordscrambleEnabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Choose Channel */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted">
                Kênh Discord Nhận Tin Nhắn Đố Chữ
              </label>
              {activeGuildChannels.length > 0 ? (
                <select
                  value={config.wordscrambleChannelId}
                  onChange={(e) => handleChange('wordscrambleChannelId', e.target.value)}
                  className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent font-medium cursor-pointer"
                >
                  <option value="">-- Chọn kênh chat Sắp Xếp Từ --</option>
                  {activeGuildChannels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      #{ch.name} (ID: {ch.id})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Nhập Channel ID thủ công (vd: 1535705241620717720)"
                  value={config.wordscrambleChannelId}
                  onChange={(e) => handleChange('wordscrambleChannelId', e.target.value)}
                  className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent font-mono"
                />
              )}
            </div>

            {/* Round Time */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted">
                Thời Gian Tối Đa Mỗi Vòng Đố Chữ (Giây)
              </label>
              <input
                type="number"
                min={15}
                max={300}
                value={config.wordscrambleRoundSec}
                onChange={(e) => handleChange('wordscrambleRoundSec', e.target.value)}
                className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent font-medium"
              />
            </div>

          </div>
        </div>

        {/* PANEL 3: TỰ ĐỘNG SẮN CODE WUTHERING WAVES */}
        <div className="bg-anna-card border border-anna-border rounded-2xl p-7 space-y-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between border-b border-anna-border pb-4 gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">3. Tự Động Săn Code Game Wuthering Waves</h3>
              <p className="text-xs text-anna-muted font-normal mt-0.5">Tự động cào giftcode mới và gửi thông báo vào kênh Discord của Server</p>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.wuwaEnabled}
                onChange={(e) => handleChange('wuwaEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-anna-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-anna-accent"></div>
              <span className="ml-3 text-xs font-bold text-white">
                {config.wuwaEnabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
              </span>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-anna-muted">
              Kênh Discord Nhận Thông Báo Giftcode Mới
            </label>
            {activeGuildChannels.length > 0 ? (
              <select
                value={config.wuwaChannelId}
                onChange={(e) => handleChange('wuwaChannelId', e.target.value)}
                className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent font-medium cursor-pointer"
              >
                <option value="">-- Chọn kênh nhận thông báo Giftcode --</option>
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
                value={config.wuwaChannelId}
                onChange={(e) => handleChange('wuwaChannelId', e.target.value)}
                className="w-full bg-anna-dark border border-anna-border text-white text-sm rounded-xl p-3 outline-none focus:border-anna-accent font-mono"
              />
            )}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-anna-accent hover:bg-anna-hover disabled:opacity-50 text-white font-bold py-3.5 px-8 rounded-2xl transition duration-150 shadow-xl cursor-pointer text-sm flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang lưu cấu hình...' : 'LƯU TẤT CẢ CẤU HÌNH'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
