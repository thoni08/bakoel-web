import React from 'react';
import { useApp } from '../../context/AppContext';

export const DashboardPage: React.FC = () => {
  const { products, orders } = useApp();

  const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const revenue = orders
    .filter((o) => o.status === 'Selesai')
    .reduce((s, o) => s + o.total, 0);

  const activeProductsCount = products.filter((p) => p.status === 'Aktif').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Menunggu').length;

  const statsData = [
    {
      label: 'Total Produk',
      value: products.length,
      sub: `${activeProductsCount} aktif`,
      ic: 'ic-box',
      bg: 'var(--primary-light)',
      fg: 'var(--primary)',
    },
    {
      label: 'Total Order',
      value: orders.length,
      sub: `${pendingOrdersCount} menunggu`,
      ic: 'ic-receipt',
      bg: 'oklch(93% 0.08 60)',
      fg: 'oklch(42% 0.14 55)',
    },
    {
      label: 'Pendapatan',
      value: formatRupiah(revenue),
      sub: 'Order selesai',
      ic: 'ic-dollar',
      bg: 'var(--green-light)',
      fg: 'var(--green)',
      small: true,
    },
    {
      label: 'Rating Toko',
      value: '4.7 / 5',
      sub: '128 ulasan',
      ic: 'ic-star',
      bg: 'oklch(93% 0.1 70)',
      fg: 'oklch(48% 0.15 65)',
    },
  ];

  const weeklyData = [2.4, 3.1, 1.8, 4.2, 3.6, 5.1, 4.8];
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const maxVal = Math.max(...weeklyData);

  const recentOrders = orders.slice(0, 4);

  return (
    <div className="page active" id="page-dashboard">
      <div className="page-header">
        <h1>Dashboard Toko</h1>
        <p>Ringkasan performa penjualan Bakoel Anda</p>
      </div>

      <div className="stats-grid" id="seller-stats">
        {statsData.map((s, idx) => (
          <div className="stat-card" key={idx}>
            <div className="stat-icon-wrap" style={{ background: s.bg, color: s.fg }}>
              <svg width="20" height="20">
                <use href={`#${s.ic}`} />
              </svg>
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={s.small ? { fontSize: '1.35rem' } : undefined}>
              {s.value}
            </div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="chart-wrap">
        <div className="chart-title">
          <svg width="18" height="18">
            <use href="#ic-trending" />
          </svg>
          Grafik Penjualan Mingguan
        </div>
        <div className="bar-chart" id="weekly-chart">
          {weeklyData.map((v, i) => (
            <div className="bar-col" key={i}>
              <div className="bar-val">{v}jt</div>
              <div className="bar-in" style={{ height: `${(v / maxVal) * 100}%` }}></div>
              <div className="bar-lbl">{days[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="page-header mt16">
        <h3>Order Terbaru</h3>
      </div>
      
      <div id="recent-orders-dash">
        {recentOrders.length > 0 ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Pembeli</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="fw7">#{o.id}</td>
                    <td>{o.buyer}</td>
                    <td>{formatRupiah(o.total)}</td>
                    <td>
                      <span className={`sbadge s-${o.status.toLowerCase()}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '20px' }}>
            Belum ada order
          </p>
        )}
      </div>
    </div>
  );
};
