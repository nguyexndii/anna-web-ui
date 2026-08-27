import React from 'react';

export default function LogoutModal({ showLogoutModal, onClose, onConfirmLogout }) {
  if (!showLogoutModal) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-discord-card border border-[#383a40] rounded-lg max-w-sm w-full p-6 text-center space-y-4 shadow-2xl"
      >
        <div>
          <h3 className="text-base font-bold text-white">Xác nhận đăng xuất?</h3>
          <p className="text-xs text-discord-muted mt-1">Bạn sẽ cần đăng nhập lại tài khoản Discord để tiếp tục quản lý.</p>
        </div>
        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            onClick={onClose}
            className="w-1/2 bg-discord-dark hover:bg-discord-cardHover text-white text-xs font-semibold py-2 rounded border border-[#383a40] transition cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirmLogout}
            className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2 rounded transition cursor-pointer shadow"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
