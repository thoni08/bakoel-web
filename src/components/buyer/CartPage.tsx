import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductIcon } from '../common/ProductIcon';

export const CartPage: React.FC = () => {
  const { cart, products, updateCartQty, removeFromCart, navigateTo } = useApp();

  const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  if (cart.length === 0) {
    return (
      <div className="page active" id="page-keranjang">
        <div className="page-header">
          <h1>Keranjang Belanja</h1>
          <p>Review pesanan sebelum checkout</p>
        </div>
        <div className="cart-container">
          <div className="empty">
            <div className="empty-ico">
              <svg width="48" height="48">
                <use href="#ic-cart" />
              </svg>
            </div>
            <h3>Keranjang kosong</h3>
            <p>Tambahkan produk dari katalog untuk mulai berbelanja</p>
            <button className="btn btn-primary mt16" onClick={() => navigateTo('katalog')}>
              <svg width="14" height="14">
                <use href="#ic-store" />
              </svg>{' '}
              Lihat Katalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  let subtotal = 0;
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="page active" id="page-keranjang">
      <div className="page-header">
        <h1>Keranjang Belanja</h1>
        <p>Review pesanan sebelum checkout</p>
      </div>
      <div className="cart-container" id="cart-items-container">
        {cart.map((item) => {
          const p = products.find((x) => x.id === item.id);
          if (!p) return null;
          
          const itemTotal = p.price * item.qty;
          subtotal += itemTotal;

          return (
            <div className="cart-item" key={item.id}>
              <ProductIcon icon={p.icon} cat={p.cat} size={64} />
              <div className="cart-info">
                <div className="cart-name">{p.name}</div>
                <div className="cart-seller">
                  <svg width="12" height="12">
                    <use href="#ic-store" />
                  </svg>{' '}
                  {p.seller}
                </div>
                <div className="qty-row">
                  <button className="qty-btn" onClick={() => updateCartQty(p.id, -1)}>
                    −
                  </button>
                  <span className="qty-n">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateCartQty(p.id, 1)}>
                    +
                  </button>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginLeft: '4px' }}>
                    Stok: {p.stock}
                  </span>
                </div>
              </div>
              <div className="cart-price-col">
                <div className="cart-unit">{formatRupiah(p.price)} / pcs</div>
                <div className="cart-total">{formatRupiah(itemTotal)}</div>
                <button
                  className="cart-rm"
                  onClick={() => removeFromCart(p.id)}
                  title="Hapus"
                >
                  <svg width="15" height="15">
                    <use href="#ic-trash" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}

        <div className="cart-summary">
          <div className="sum-row">
            <span>Subtotal ({totalQty} item)</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="sum-row">
            <span>Ongkos Kirim (est.)</span>
            <span>Rp 15.000</span>
          </div>
          <div className="sum-row total">
            <span className="fw7">Total</span>
            <span className="sum-total-val">{formatRupiah(subtotal + 15000)}</span>
          </div>
          <button
            className="btn btn-accent mt16"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => navigateTo('checkout')}
          >
            <svg width="15" height="15">
              <use href="#ic-credit" />
            </svg>
            Lanjut ke Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
