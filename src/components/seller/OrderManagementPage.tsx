import React from 'react';
import { useApp } from '../../context/AppContext';
import type { Order } from '../../types';

export const OrderManagementPage: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();

  const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePrintInvoice = (order: Order) => {
    const win = window.open('', '_blank', 'width=600,height=700');
    if (!win) {
      alert('Gagal membuka popup cetak invoice. Pastikan popup blocker tidak aktif.');
      return;
    }

    win.document.write(`
      <html>
        <head>
          <title>Invoice #${order.id}</title>
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'DM Sans', sans-serif; padding: 40px; color: #1a1a1a }
            h1 { font-family: 'DM Sans', sans-serif; font-weight: bold; color: oklch(52% 0.19 232); margin-bottom: 5px; }
            .line { border-top: 1px solid #eee; margin: 16px 0 }
            .total { font-size: 1.3rem; font-weight: 700; color: oklch(68% 0.19 38) }
            .item-row { display: flex; justify-content: space-between; font-size: 0.9rem; padding: 4px 0; }
          </style>
        </head>
        <body>
          <h1>Bakoel</h1>
          <p style="color:#aaa;font-size:0.8rem">Belanja Lokal, Bangga Nasional</p>
          <div class="line"></div>
          <p><strong>Invoice:</strong> #${order.id}</p>
          <p><strong>Tanggal:</strong> ${formatDate(order.date)}</p>
          <p><strong>Pembeli:</strong> ${order.buyer}</p>
          <div class="line"></div>
          <div>
            <strong>Daftar Item:</strong>
            ${order.items.map(item => `
              <div class="item-row">
                <span>${item.name} &times;${item.qty}</span>
                <span>Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
              </div>
            `).join('')}
          </div>
          <div class="line"></div>
          <div class="total">Total: ${formatRupiah(order.total)}</div>
          <div class="line"></div>
          <p style="font-size:0.8rem;color:#aaa">Terima kasih telah berbelanja di Bakoel!</p>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  if (orders.length === 0) {
    return (
      <div className="page active" id="page-order-seller">
        <div className="page-header">
          <h1>Manajemen Order</h1>
          <p>Kelola pesanan masuk dan status pengiriman barang</p>
        </div>
        <div className="empty">
          <div className="empty-ico">
            <svg width="48" height="48">
              <use href="#ic-receipt" />
            </svg>
          </div>
          <h3>Belum ada order masuk</h3>
          <p>Daftar pesanan baru akan muncul di sini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page active" id="page-order-seller">
      <div className="page-header">
        <h1>Manajemen Order</h1>
        <p>Kelola pesanan masuk dan status pengiriman barang</p>
      </div>

      <div id="seller-orders-list">
        {orders.map((o) => (
          <div className="so-card" key={o.id}>
            <div className="so-head">
              <div>
                <div className="so-buyer">
                  <svg width="14" height="14" style={{ marginRight: '4px', verticalAlign: '-2px' }}>
                    <use href="#ic-user" />
                  </svg>
                  {o.buyer}
                </div>
                <div className="so-meta">
                  #{o.id} &middot; {formatDate(o.date)}
                </div>
              </div>
              <div className="flex-row">
                <span className={`sbadge s-${o.status.toLowerCase()}`}>{o.status}</span>
                <select
                  className="status-sel"
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                >
                  <option value="Menunggu">Menunggu</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Dikirim">Dikirim</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>
            <div className="so-items">
              {o.items.map((item, idx) => (
                <div className="so-item-tag" key={idx}>
                  <svg width="13" height="13">
                    <use href="#ic-package" />
                  </svg>{' '}
                  {item.name} <strong>&times;{item.qty}</strong>
                </div>
              ))}
            </div>
            <div className="so-foot">
              <span style={{ fontSize: '0.84rem', color: 'var(--text-2)' }}>
                Total: <strong style={{ color: 'var(--accent)' }}>{formatRupiah(o.total)}</strong>
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => handlePrintInvoice(o)}>
                <svg width="13" height="13">
                  <use href="#ic-print" />
                </svg>{' '}
                Cetak Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
