import React from 'react';
import { useApp } from '../../context/AppContext';

export const OrderHistoryPage: React.FC = () => {
  const { orders } = useApp();

  const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  
  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (orders.length === 0) {
    return (
      <div className="page active" id="page-riwayat">
        <div className="page-header">
          <h1>Riwayat Order</h1>
          <p>Daftar pesanan yang telah Anda lakukan</p>
        </div>
        <div className="orders-list">
          <div className="empty">
            <div className="empty-ico">
              <svg width="48" height="48">
                <use href="#ic-list" />
              </svg>
            </div>
            <h3>Belum ada order</h3>
            <p>Mulai belanja di katalog untuk membuat pesanan pertama</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page active" id="page-riwayat">
      <div className="page-header">
        <h1>Riwayat Order</h1>
        <p>Daftar pesanan yang telah Anda lakukan</p>
      </div>

      <div className="orders-list" id="orders-list">
        {orders.map((o) => (
          <div className="order-card" key={o.id}>
            <div className="order-head">
              <div>
                <div className="order-id">#{o.id}</div>
                <div className="order-dt">{formatDate(o.date)}</div>
              </div>
              <span className={`sbadge s-${o.status.toLowerCase()}`}>{o.status}</span>
            </div>
            <div className="order-preview">
              {o.items.map((i) => `${i.name} ×${i.qty}`).join(' · ')}
            </div>
            <div className="order-foot">
              <span style={{ fontSize: '0.81rem', color: 'var(--text-3)' }}>Total Pembayaran</span>
              <span className="order-amt">{formatRupiah(o.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
