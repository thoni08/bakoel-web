import React from 'react';
import { useApp } from '../context/AppContext';
import { CatalogPage } from './buyer/CatalogPage';
import { CartPage } from './buyer/CartPage';
import { CheckoutPage } from './buyer/CheckoutPage';
import { OrderHistoryPage } from './buyer/OrderHistoryPage';
import { DashboardPage } from './seller/DashboardPage';
import { ProductManagementPage } from './seller/ProductManagementPage';
import { OrderManagementPage } from './seller/OrderManagementPage';
import { LogisticsIntegrationPage } from './seller/LogisticsIntegrationPage';

export const MainLayout: React.FC = () => {
  const { currentRole, currentPage, navigateTo, setRole, cart } = useApp();

  const totalCartQty = cart.reduce((s, i) => s + i.qty, 0);

  const renderActivePage = () => {
    switch (currentPage) {
      // Buyer pages
      case 'katalog':
        return <CatalogPage />;
      case 'keranjang':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'riwayat':
        return <OrderHistoryPage />;
      
      // Seller pages
      case 'dashboard':
        return <DashboardPage />;
      case 'produk':
        return <ProductManagementPage />;
      case 'order-seller':
        return <OrderManagementPage />;
      case 'logistik':
        return <LogisticsIntegrationPage />;
        
      default:
        return <CatalogPage />;
    }
  };

  interface NavItem {
    page: string;
    icon: string;
    label: string;
    badge?: number;
  }

  const buyerNavItems: NavItem[] = [
    { page: 'katalog', icon: 'ic-store', label: 'Katalog Produk' },
    { page: 'keranjang', icon: 'ic-cart', label: 'Keranjang', badge: totalCartQty },
    { page: 'checkout', icon: 'ic-credit', label: 'Checkout' },
    { page: 'riwayat', icon: 'ic-list', label: 'Riwayat Order' },
  ];

  const sellerNavItems: NavItem[] = [
    { page: 'dashboard', icon: 'ic-chart', label: 'Dashboard' },
    { page: 'produk', icon: 'ic-box', label: 'Manajemen Produk' },
    { page: 'order-seller', icon: 'ic-receipt', label: 'Manajemen Order' },
    { page: 'logistik', icon: 'ic-truck', label: 'Integrasi Logistik' },
  ];

  const navItems = currentRole === 'buyer' ? buyerNavItems : sellerNavItems;

  return (
    <div id="app-shell" className="visible">
      {/* Topbar */}
      <nav className="topbar">
        <div className="topbar-brand">
          <div className="tl">
            <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
              <path d="M18 4L32 12V24L18 32L4 24V12L18 4Z" fill="white" opacity={0.92} />
              <circle cx="18" cy="18.5" r="3" fill="white" opacity={0.65} />
            </svg>
          </div>
          <span>Bakoel</span>
        </div>
        <div className="topbar-right">
          <div className={`role-badge ${currentRole}`}>
            <span className="dot"></span>
            <span id="role-label">{currentRole === 'buyer' ? 'Pembeli' : 'Penjual'}</span>
          </div>
          <button className="btn-ganti" onClick={() => setRole(null)}>
            <svg width="14" height="14">
              <use href="#ic-swap" />
            </svg>
            Ganti Role
          </button>
          {currentRole === 'buyer' && (
            <button className="cart-topbtn" id="cart-top-btn" onClick={() => navigateTo('keranjang')}>
              <svg width="16" height="16">
                <use href="#ic-cart" />
              </svg>
              <span className="cart-badge" id="cart-badge-top">
                {totalCartQty}
              </span>
            </button>
          )}
        </div>
      </nav>

      <div className="app-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <div>
            <div className="sidebar-label">
              {currentRole === 'buyer' ? 'Belanja' : 'Toko Saya'}
            </div>
            {navItems.map((item) => (
              <div
                key={item.page}
                className={`nav-item ${currentPage === item.page ? 'active' : ''}`}
                data-page={item.page}
                onClick={() => navigateTo(item.page)}
              >
                <span className="ni">
                  <svg width="17" height="17">
                    <use href={`#${item.icon}`} />
                  </svg>
                </span>{' '}
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    id="cart-badge-sidebar"
                    style={{
                      background: 'var(--accent)',
                      color: 'white',
                      borderRadius: '10px',
                      padding: '1px 7px',
                      fontSize: '0.7rem',
                      marginLeft: 'auto',
                      fontWeight: 700,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">{renderActivePage()}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="bottom-nav">
        <div className="bnav-items" id="bnav-items">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                className={`bnav-item ${isActive ? 'active' : ''}`}
                data-page={item.page}
                onClick={() => navigateTo(item.page)}
              >
                <svg width="20" height="20" style={{ stroke: isActive ? 'var(--accent)' : '' }}>
                  <use href={`#${item.icon}`} />
                </svg>
                {item.page === 'order-seller' ? 'Order' : item.page === 'riwayat' ? 'Riwayat' : item.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
