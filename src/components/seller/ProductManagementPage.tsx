import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductIcon, catColors } from '../common/ProductIcon';
import type { Product } from '../../types';

export const ProductManagementPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [cat, setCat] = useState<Product['cat']>('Makanan');
  const [icon, setIcon] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState<Product['status']>('Aktif');
  const [desc, setDesc] = useState('');

  const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const openAddModal = () => {
    setEditingProductId(null);
    setName('');
    setCat('Makanan');
    setIcon('');
    setPrice('');
    setStock('');
    setStatus('Aktif');
    setDesc('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setName(p.name);
    setCat(p.cat);
    setIcon(p.icon || '');
    setPrice(p.price.toString());
    setStock(p.stock.toString());
    setStatus(p.status);
    setDesc(p.desc || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    const pData = {
      name,
      cat,
      icon: icon.trim(),
      price: parseInt(price) || 0,
      stock: parseInt(stock) || 0,
      status,
      desc,
    };

    if (editingProductId) {
      updateProduct(editingProductId, pData);
    } else {
      addProduct(pData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Hapus produk ini?')) {
      deleteProduct(id);
    }
  };

  const getCategoryTag = (category: Product['cat']) => {
    const c = catColors[category] || { bg: 'var(--bg-2)', fg: 'var(--text-2)' };
    return (
      <span
        style={{
          background: c.bg,
          color: c.fg,
          borderRadius: '6px',
          padding: '2px 8px',
          fontSize: '0.72rem',
          fontWeight: 700,
        }}
      >
        {category}
      </span>
    );
  };

  return (
    <div className="page active" id="page-produk">
      <div className="page-header-row">
        <div className="page-header">
          <h1>Manajemen Produk</h1>
          <p>Kelola katalog produk yang Anda jual di toko</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Produk
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody id="products-table-body">
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <ProductIcon icon={p.icon} cat={p.cat} size={42} />
                </td>
                <td>
                  <div className="fw7" style={{ fontSize: '0.86rem' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-3)', marginTop: '2px' }}>
                    {p.desc || ''}
                  </div>
                </td>
                <td>{getCategoryTag(p.cat)}</td>
                <td>{formatRupiah(p.price)}</td>
                <td>
                  <span className="fw7">{p.stock}</span>
                </td>
                <td>
                  <span className={`sbadge s-${p.status.toLowerCase()}`}>{p.status}</span>
                </td>
                <td>
                  <div className="act-cell">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(p)}>
                      <svg width="13" height="13">
                        <use href="#ic-edit" />
                      </svg>{' '}
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                      <svg width="13" height="13">
                        <use href="#ic-trash" />
                      </svg>{' '}
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Editor Modal */}
      {isModalOpen && (
        <div
          className="modal-overlay open"
          id="product-modal-overlay"
          onClick={(e) => {
            if ((e.target as HTMLElement).id === 'product-modal-overlay') {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="modal">
            <h2 id="pm-title">{editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Nama Produk *</label>
                <input
                  type="text"
                  className="form-input"
                  id="pm-name"
                  placeholder="e.g. Kopi Gayo Premium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select
                    className="form-select"
                    id="pm-cat"
                    value={cat}
                    onChange={(e) => setCat(e.target.value as Product['cat'])}
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Elektronik">Elektronik</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Inisial Icon (max 2 huruf)</label>
                  <input
                    type="text"
                    className="form-input"
                    id="pm-icon"
                    placeholder="e.g. KG"
                    maxLength={2}
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Harga *</label>
                  <input
                    type="number"
                    className="form-input"
                    id="pm-price"
                    placeholder="e.g. 50000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stok *</label>
                  <input
                    type="number"
                    className="form-input"
                    id="pm-stock"
                    placeholder="e.g. 25"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  id="pm-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Product['status'])}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea
                  className="form-textarea"
                  id="pm-desc"
                  rows={3}
                  placeholder="Keterangan lengkap mengenai produk..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
