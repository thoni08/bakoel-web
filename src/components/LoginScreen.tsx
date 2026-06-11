import React from 'react';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC = () => {
  const { setRole } = useApp();

  return (
    <div id="login-screen">
      <div className="login-logo">
        <div className="logo-mark">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M18 4L32 12V24L18 32L4 24V12L18 4Z" fill="white" opacity={0.92} />
            <path d="M18 10L26 15V22L18 27L10 22V15L18 10Z" fill="none" stroke="white" strokeWidth="1.4" opacity={0.65} />
            <circle cx="18" cy="18.5" r="3" fill="white" opacity={0.65} />
          </svg>
        </div>
        <h1>Bakoel</h1>
        <p>Belanja Lokal, Bangga Nasional</p>
      </div>
      <div className="role-cards">
        <div className="role-card buyer" onClick={() => setRole('buyer')}>
          <div className="role-icon">
            <svg width="36" height="36">
              <use href="#ic-cart" />
            </svg>
          </div>
          <h2>Saya Pembeli</h2>
          <p>Temukan produk lokal terbaik dari ribuan penjual UMKM terpercaya</p>
          <button className="role-btn">Masuk sebagai Pembeli</button>
        </div>
        <div className="role-card seller" onClick={() => setRole('seller')}>
          <div className="role-icon">
            <svg width="36" height="36">
              <use href="#ic-store" />
            </svg>
          </div>
          <h2>Saya Penjual</h2>
          <p>Kelola toko, produk, dan pesanan Anda dengan mudah dan efisien</p>
          <button className="role-btn">Masuk sebagai Penjual</button>
        </div>
      </div>
    </div>
  );
};
