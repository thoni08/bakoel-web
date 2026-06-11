import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductIcon } from '../common/ProductIcon';

export const CatalogPage: React.FC = () => {
  const { products, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Semua' || p.cat === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seller.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && p.status === 'Aktif';
  });

  const categories = ['Semua', 'Makanan', 'Fashion', 'Kerajinan', 'Elektronik'];

  return (
    <div className="page active" id="page-katalog">
      <div className="page-header-row">
        <div className="page-header">
          <h1>Katalog Produk</h1>
          <p>Temukan produk lokal terbaik dari penjual UMKM</p>
        </div>
      </div>
      
      <div className="search-filter-bar">
        <div className="search-wrap">
          <span className="sicon">
            <svg width="16" height="16">
              <use href="#ic-search" />
            </svg>
          </span>
          <input
            type="text"
            className="search-input"
            id="search-input"
            placeholder="Cari produk atau penjual..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="chips" id="filter-chips">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="product-grid" id="product-grid">
        {filteredProducts.length === 0 ? (
          <div className="empty" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-ico">
              <svg width="48" height="48">
                <use href="#ic-search" />
              </svg>
            </div>
            <h3>Produk tidak ditemukan</h3>
            <p>Coba kata kunci lain atau ubah filter kategori</p>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isOutOfStock = p.stock === 0;
            const stockClass = p.stock > 20 ? 'sb-ok' : p.stock > 0 ? 'sb-low' : 'sb-out';
            const stockLabel = p.stock > 20 ? 'Tersedia' : p.stock > 0 ? `Sisa ${p.stock}` : 'Habis';

            return (
              <div className="product-card" key={p.id}>
                <div className="product-img">
                  <div className="pat"></div>
                  <div className="pico">
                    <ProductIcon icon={p.icon} cat={p.cat} size={72} />
                  </div>
                  <span className={`stock-badge ${stockClass}`}>{stockLabel}</span>
                </div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div className="product-seller">
                    <svg width="12" height="12">
                      <use href="#ic-store" />
                    </svg>{' '}
                    {p.seller}
                  </div>
                  <div className="product-price">{formatRupiah(p.price)}</div>
                </div>
                <div className="product-actions">
                  <button
                    className="btn btn-primary btn-atc"
                    onClick={() => !isOutOfStock && addToCart(p.id)}
                    disabled={isOutOfStock}
                    style={isOutOfStock ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
                  >
                    <svg width="14" height="14">
                      <use href="#ic-cart" />
                    </svg>
                    {isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
