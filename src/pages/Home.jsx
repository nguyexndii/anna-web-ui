import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ user, onLogin }) {
  return (
    <div className="min-h-screen bg-anna-dark text-anna-text selection:bg-anna-accent selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 max-w-5xl mx-auto text-center space-y-8">
        
        {/* Avatar Image */}
        <div className="flex items-center justify-center">
          <img
            src="/logo.jpg"
            alt="Anna Bot Avatar"
            className="w-28 h-28 rounded-3xl object-cover border-4 border-anna-accent shadow-2xl hover:scale-105 transition duration-200"
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-anna-card border border-anna-border text-sm font-semibold text-indigo-300 shadow-md">
          Bảng Điều Khiển Quản Lý Discord Bot
        </div>

        {/* Hero Title & Description */}
        <div className="space-y-5 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Quản Lý & Tự Động Hóa Server Với <span className="text-indigo-400">Anna Bot</span>
          </h1>
          <p className="text-base sm:text-lg text-anna-muted leading-relaxed font-normal">
            Công cụ soạn thảo Embed Card chuyên nghiệp, tự động hóa trò chuyện, quản lý minigame giải trí Nối Từ & Sắp Xếp Từ, cùng hệ thống săn code game Wuthering Waves tự động.
          </p>
        </div>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/invite"
            className="w-full sm:w-auto bg-anna-accent hover:bg-anna-hover text-white font-bold py-4 px-8 rounded-2xl transition duration-200 shadow-xl flex items-center justify-center text-base cursor-pointer"
          >
            Mời Bot Vào Server
          </Link>

          {user ? (
            <Link
              to="/servers"
              className="w-full sm:w-auto bg-anna-card hover:bg-anna-cardHover text-white font-bold py-4 px-8 rounded-2xl border border-anna-border transition duration-200 flex items-center justify-center text-base cursor-pointer shadow-md"
            >
              Vào Dashboard Quản Lý
            </Link>
          ) : (
            <button
              onClick={onLogin}
              className="w-full sm:w-auto bg-anna-card hover:bg-anna-cardHover text-white font-bold py-4 px-8 rounded-2xl border border-anna-border transition duration-200 flex items-center justify-center text-base cursor-pointer shadow-md"
            >
              Đăng Nhập Với Discord
            </button>
          )}
        </div>

      </section>

      {/* FEATURE SHOWCASE GRID */}
      <section className="py-16 px-6 max-w-5xl mx-auto space-y-10 border-t border-anna-border/40">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Tính Năng Nổi Bật</h2>
          <p className="text-sm text-anna-muted font-medium">Được thiết kế chỉn chu giúp ban quản trị vận hành Discord mượt mà</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1 */}
          <div className="bg-anna-card border border-anna-border rounded-2xl p-7 space-y-3 hover:border-indigo-500/50 hover:bg-anna-cardHover transition duration-200 shadow-lg">
            <h3 className="text-lg font-bold text-white">Soạn Bài & Đăng Tin Embed</h3>
            <p className="text-sm text-anna-muted leading-relaxed font-normal">
              Tạo bài viết thông báo, sự kiện, nội quy bằng khung Embed card màu sắc rực rỡ hoặc tin nhắn chữ thường. Hỗ trợ đầy đủ định dạng Markdown và Xem trước trực quan.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-anna-card border border-anna-border rounded-2xl p-7 space-y-3 hover:border-indigo-500/50 hover:bg-anna-cardHover transition duration-200 shadow-lg">
            <h3 className="text-lg font-bold text-white">Minigame Nối Từ Tiếng Việt</h3>
            <p className="text-sm text-anna-muted leading-relaxed font-normal">
              Trò chơi giải trí nối từ tự động kiểm tra từ vựng tiếng Việt, lưu trữ điểm thắng trực tiếp trên cơ sở dữ liệu MongoDB Atlas và hiển thị Bảng xếp hạng thành viên.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-anna-card border border-anna-border rounded-2xl p-7 space-y-3 hover:border-indigo-500/50 hover:bg-anna-cardHover transition duration-200 shadow-lg">
            <h3 className="text-lg font-bold text-white">Minigame Sắp Xếp Từ</h3>
            <p className="text-sm text-anna-muted leading-relaxed font-normal">
              Đố chữ xáo trộn chữ cái tiếng Việt thú vị. Tự động cộng điểm thưởng cho người đoán đúng nhanh nhất trong kênh giải trí của Server.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-anna-card border border-anna-border rounded-2xl p-7 space-y-3 hover:border-indigo-500/50 hover:bg-anna-cardHover transition duration-200 shadow-lg">
            <h3 className="text-lg font-bold text-white">Tự Động Săn Code Game</h3>
            <p className="text-sm text-anna-muted leading-relaxed font-normal">
              Hệ thống tự động theo dõi giftcode mới nhất từ game Wuthering Waves và gửi thông báo kèm nút sao chép nhanh vào kênh thông báo của Server.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t border-anna-border/40 text-center text-xs text-anna-muted font-medium">
        <p>© 2026 Anna Bot. Bảng điều khiển quản lý Discord Bot chuyên nghiệp.</p>
      </footer>

    </div>
  );
}
