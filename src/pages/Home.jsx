import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ user, onLogin }) {
  return (
    <div className="min-h-screen bg-anna-dark text-anna-text selection:bg-anna-accent selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6">
        
        {/* Badge */}
        <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-anna-card border border-anna-border text-xs font-semibold text-indigo-300 shadow-sm">
          Bảng Điều Khiển Quản Lý Discord Bot
        </div>

        {/* Hero Title & Description */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Quản Lý & Tự Động Hóa Server Với <span className="text-indigo-400">Anna Bot</span>
          </h1>
          <p className="text-sm sm:text-base text-anna-muted leading-relaxed font-normal">
            Công cụ soạn thảo Embed Card chuyên nghiệp, tự động hóa trò chuyện, quản lý minigame giải trí Nối Từ & Sắp Xếp Từ, cùng hệ thống săn code game Wuthering Waves tự động.
          </p>
        </div>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/invite"
            className="w-full sm:w-auto bg-anna-accent hover:bg-anna-hover text-white font-bold py-3.5 px-7 rounded-xl transition duration-200 shadow-lg flex items-center justify-center text-sm cursor-pointer"
          >
            Mời Bot Vào Server
          </Link>

          {user ? (
            <Link
              to="/servers"
              className="w-full sm:w-auto bg-anna-card hover:bg-slate-800 text-white font-bold py-3.5 px-7 rounded-xl border border-anna-border transition duration-200 flex items-center justify-center text-sm cursor-pointer"
            >
              Vào Dashboard Quản Lý
            </Link>
          ) : (
            <button
              onClick={onLogin}
              className="w-full sm:w-auto bg-anna-card hover:bg-slate-800 text-white font-bold py-3.5 px-7 rounded-xl border border-anna-border transition duration-200 flex items-center justify-center text-sm cursor-pointer"
            >
              Đăng Nhập Với Discord
            </button>
          )}
        </div>

      </section>

      {/* FEATURE SHOWCASE GRID */}
      <section className="py-10 px-6 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Tính Năng Nổi Bật</h2>
          <p className="text-xs text-anna-muted">Được thiết kế chỉn chu giúp ban quản trị vận hành Discord mượt mà</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1 */}
          <div className="bg-anna-card border border-anna-border rounded-2xl p-6 space-y-2.5 hover:border-indigo-500/50 transition duration-200">
            <h3 className="text-base font-bold text-white">Soạn Bài & Đăng Tin Embed</h3>
            <p className="text-xs text-anna-muted leading-relaxed">
              Tạo bài viết thông báo, sự kiện, nội quy bằng khung Embed card màu sắc rực rỡ hoặc tin nhắn chữ thường. Hỗ trợ đầy đủ định dạng Markdown và Xem trước trực quan.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-anna-card border border-anna-border rounded-2xl p-6 space-y-2.5 hover:border-indigo-500/50 transition duration-200">
            <h3 className="text-base font-bold text-white">Minigame Nối Từ Tiếng Việt</h3>
            <p className="text-xs text-anna-muted leading-relaxed">
              Trò chơi giải trí nối từ tự động kiểm tra từ vựng tiếng Việt, lưu trữ điểm thắng trực tiếp trên cơ sở dữ liệu MongoDB Atlas và hiển thị Bảng xếp hạng thành viên.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-anna-card border border-anna-border rounded-2xl p-6 space-y-2.5 hover:border-indigo-500/50 transition duration-200">
            <h3 className="text-base font-bold text-white">Minigame Sắp Xếp Từ</h3>
            <p className="text-xs text-anna-muted leading-relaxed">
              Đố chữ xáo trộn chữ cái tiếng Việt thú vị. Tự động cộng điểm thưởng cho người đoán đúng nhanh nhất trong kênh giải trí của Server.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-anna-card border border-anna-border rounded-2xl p-6 space-y-2.5 hover:border-indigo-500/50 transition duration-200">
            <h3 className="text-base font-bold text-white">Tự Động Săn Code Game</h3>
            <p className="text-xs text-anna-muted leading-relaxed">
              Hệ thống tự động theo dõi giftcode mới nhất từ game Wuthering Waves và gửi thông báo kèm nút sao chép nhanh vào kênh thông báo của Server.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-anna-border/50 text-center text-xs text-anna-muted">
        <p>© 2026 Anna Bot. Bảng điều khiển quản lý Discord Bot chuyên nghiệp.</p>
      </footer>

    </div>
  );
}
