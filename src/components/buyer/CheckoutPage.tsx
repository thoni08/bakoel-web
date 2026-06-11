import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SuccessModal } from '../common/SuccessModal';

export const CheckoutPage: React.FC = () => {
  const { cart, products, processCheckout, navigateTo } = useApp();
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [courier, setCourier] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Success modal state
  const [successOrderId, setSuccessOrderId] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  let subtotal = 0;
  const shippingFee = cart.length > 0 ? 15000 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = processCheckout(name, phone, address, city, zip, courier, paymentMethod);
    if (orderId) {
      setSuccessOrderId(orderId);
      setIsSuccessModalOpen(true);
    }
  };

  const handleSelectPayment = (method: string) => {
    setPaymentMethod(method);
  };

  return (
    <div className="page active" id="page-checkout">
      <div className="page-header">
        <h1>Checkout &amp; Pembayaran</h1>
      </div>

      <div className="checkout-grid">
        <form onSubmit={handleSubmit}>
          <div className="co-section">
            <h3>
              <svg width="16" height="16">
                <use href="#ic-map" />
              </svg>
              Alamat Pengiriman
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nama Penerima</label>
                <input
                  type="text"
                  className="form-input"
                  id="co-name"
                  placeholder="Nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">No. Telepon</label>
                <input
                  type="text"
                  className="form-input"
                  id="co-phone"
                  placeholder="08xx-xxxx-xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Alamat Lengkap</label>
              <textarea
                className="form-textarea"
                id="co-address"
                rows={3}
                placeholder="Jalan, Kelurahan, Kecamatan..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Kota</label>
                <input
                  type="text"
                  className="form-input"
                  id="co-city"
                  placeholder="Jakarta Selatan"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Kode Pos</label>
                <input
                  type="text"
                  className="form-input"
                  id="co-zip"
                  placeholder="12345"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Kurir Pengiriman</label>
              <select
                className="form-select"
                id="co-courier"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                required
              >
                <option value="">Pilih kurir...</option>
                <option value="JNE REG (2-3 hari)">JNE REG (2-3 hari)</option>
                <option value="J&T Express (1-2 hari)">J&T Express (1-2 hari)</option>
              </select>
            </div>
          </div>

          <div className="co-section">
            <h3>
              <svg width="16" height="16">
                <use href="#ic-credit" />
              </svg>
              Metode Pembayaran
            </h3>
            <div className="pay-options">
              <div
                className={`pay-card ${paymentMethod === 'Bank Transfer' ? 'selected' : ''}`}
                onClick={() => handleSelectPayment('Bank Transfer')}
              >
                <div className="pay-icon pi-bank">BANK</div>
                <div>
                  <div className="pay-label">Transfer Bank (Manual)</div>
                  <div className="pay-desc">Verifikasi manual via bukti transfer</div>
                </div>
              </div>

              <div
                className={`pay-card ${paymentMethod === 'Midtrans' ? 'selected' : ''}`}
                onClick={() => handleSelectPayment('Midtrans')}
              >
                <div className="pay-icon pi-mid">MID</div>
                <div>
                  <div className="pay-label">Midtrans (Virtual Account / Qris)</div>
                  <div className="pay-desc">Konfirmasi pembayaran otomatis instan</div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="order-sum-card">
          <h3>Ringkasan Order</h3>
          <div id="checkout-order-items">
            {cart.length === 0 ? (
              <p style={{ color: 'var(--text-3)', fontSize: '0.84rem' }}>Keranjang kosong</p>
            ) : (
              cart.map((item) => {
                const p = products.find((x) => x.id === item.id);
                if (!p) return null;
                const totalItem = p.price * item.qty;
                subtotal += totalItem;
                return (
                  <div className="oi-row" key={item.id}>
                    <span>
                      {p.name} &times;{item.qty}
                    </span>
                    <span>{formatRupiah(totalItem)}</span>
                  </div>
                );
              })
            )}
          </div>
          <div className="divider"></div>
          <div className="oi-row">
            <span>Subtotal</span>
            <span id="co-subtotal">{formatRupiah(subtotal)}</span>
          </div>
          <div className="oi-row">
            <span>Ongkos Kirim</span>
            <span>{formatRupiah(shippingFee)}</span>
          </div>
          <div className="divider"></div>
          <div className="oi-row" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-1)' }}>Total Pembayaran</span>
            <span id="co-total" style={{ color: 'var(--accent)' }}>
              {formatRupiah(subtotal + shippingFee)}
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-accent mt16"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={cart.length === 0}
            onClick={handleSubmit}
          >
            <svg width="15" height="15">
              <use href="#ic-check" />
            </svg>
            Bayar Sekarang
          </button>
        </div>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        orderId={successOrderId}
        onClose={() => setIsSuccessModalOpen(false)}
        onNavigateToHistory={() => navigateTo('riwayat')}
      />
    </div>
  );
};
