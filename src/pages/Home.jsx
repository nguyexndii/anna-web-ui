import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Plus, LayoutDashboard, Sparkles, MessageSquare, Gamepad2, Gift, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function Home({ user, onLogin }) {
  return (
    <div className="min-h-screen bg-anna-dark text-anna-text selection:bg-anna-accent selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 max-w-5xl mx-auto text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-anna-card border border-anna-border text-xs font-semibold text-anna-accent shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Hệ Thống Dashboard Quản Lý Bot Discord Thế Hệ Mới</span>
        </div>

        {/* Hero Title & Description */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Quản Lý & Tự Động Hóa Server Với <span className="bg-gradient-to-r from-anna-accent via-anna-purple to-pink-500 bg-clip-text text-transparent">Anna Manager</span>
          </h1>
          <p className="text-base text-anna-muted leading-relaxed font-normal">
            Công cụ soạn thảo Embed Card chuyên nghiệp, tự động hóa trò chuyện, quản lý minigame giải trí Nối Từ & Sắp Xếp Từ, cùng hệ thống săn code game Wuthering Waves tự động.
          </p>
        </div>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/invite"
            className="w-full sm:w-auto bg-gradient-to-r from-anna-accent to-anna-purple hover:opacity-95 text-white font-bold py-3.5 px-7 rounded-xl transition duration-200 shadow-xl flex items-center justify-center space-x-2 text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Mời Bot Vào Server</span>
          </Link>

          {user ? (
            <Link
              to="/servers"
              className="w-full sm:w-auto bg-anna-card hover:bg-slate-700 text-white font-bold py-3.5 px-7 rounded-xl border border-anna-border transition duration-200 flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-anna-accent" />
              <span>Vào Dashboard Quản Lý</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={onLogin}
              className="w-full sm:w-auto bg-anna-card hover:bg-slate-700 text-white font-bold py-3.5 px-7 rounded-xl border border-anna-border transition duration-200 flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <span>Đăng Nhập Với Discord</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Highlights Bar */}
        <div className="pt-8 border-t border-anna-border/50 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs text-anna-muted font-medium">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Bảo mật Session JWT Cookie</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Scope theo từng Server</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Xem trước Embed Realtime</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Giao diện dễ nhìn 100%</span>
          </div>
        </div>

      </section>

      {/* FEATURE SHOWCASE GRID */}
      <section className="py-12 px-6 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Tính Năng Nổi Bật Nâng Tầm Server</h2>
          <p className="text-xs text-anna-muted">Được thiết kế chỉn chu giúp ban quản trị vận hành Discord mượt mà</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1 */}
          <div className="bg-anna-card border border-anna-border rounded-2xl p-6 space-y-3 hover:border-anna-accent/50 transition duration-200">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Soạn Bài & Đăng Tin Embed</h3>
            <p className="text-xs text-anna-muted leading-relaxed">
              Tạo bài viết thông báo, sự kiện, nội quy bằng khung Embed card màu sắc rực rỡ hoặc tin nhắn chữ thường. Hỗ trợ đầy đủ định dạng Markdown và Live Preview trực quan.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-anna-card border border-anna-border rounded-2xl p-6 space-y-3 hover:border-anna-accent/50 transition duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Minigame Nối Từ Tiếng Việt</h3>
            <p className="text-xs text-anna-muted leading-relaxed">
              Trò chơi giải trí nối từ tự động kiểm tra từ vựng tiếng Việt, lưu trữ điểm thắng trực tiếp trên cơ sở dữ liệu MongoDB Atlas và hiển thị Bảng xếp hạng thành viên.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-anna-card border border-anna-border rounded-2xl p-6 space-y-3 hover:border-anna-accent/50 transition duration-200">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Minigame Sắp Xếp Từ</h3>
            <p className="text-xs text-anna-muted leading-relaxed">
              Đố chữ xáo trộn chữ cái tiếng Việt thú vị. Tự động cộng điểm thưởng cho người đoán đúng nhanh nhất trong kênh giải trí của Server.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-anna-card border border-anna-border rounded-2xl p-6 space-y-3 hover:border-anna-accent/50 transition duration-200">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Tự Động Săn Code Game</h3>
            <p className="text-xs text-anna-muted leading-relaxed">
              Hệ thống tự động theo dõi giftcode mới nhất từ game Wuthering Waves và gửi thông báo kèm nút sao chép nhanh vào kênh thông báo của Server.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-anna-border/50 text-center text-xs text-anna-muted">
        <p>© 2026 Anna Manager. Bảng điều khiển quản lý Discord Bot chuyên nghiệp.</p>
      </footer>

    </div>
  );
}
