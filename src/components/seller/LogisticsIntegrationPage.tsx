import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const LogisticsIntegrationPage: React.FC = () => {
  const { couriers, toggleCourier } = useApp();
  
  // Tracking form states
  const [resiInput, setResiInput] = useState('');
  const [resiCourier, setResiCourier] = useState('JNE');
  const [trackResult, setTrackResult] = useState<{
    stages: string[];
    activeStageIdx: number;
    resiNumber: string;
    courierName: string;
  } | null>(null);

  const handleCekResi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resiInput.trim()) return;

    const stages = ['Order Dibuat', 'Paket Diambil', 'Sortasi', 'Dalam Perjalanan', 'Di Kota Tujuan'];
    const randomIdx = Math.floor(Math.random() * stages.length);

    setTrackResult({
      stages,
      activeStageIdx: randomIdx,
      resiNumber: resiInput.trim(),
      courierName: resiCourier,
    });
  };

  const courierList = [
    { key: 'jne' as const, name: 'JNE Express', status: 'Terkoneksi via API v2', cls: 'cl-jne', lbl: 'JNE' },
    { key: 'jnt' as const, name: 'J&T Express', status: 'Terkoneksi via API v3', cls: 'cl-jnt', lbl: 'J&T' },
  ];

  return (
    <div className="page active" id="page-logistik">
      <div className="page-header">
        <h1>Integrasi Logistik</h1>
        <p>Kelola kurir pengiriman dan lacak resi pengiriman barang</p>
      </div>

      <div className="courier-grid" id="courier-grid">
        {courierList.map((c) => (
          <div className="courier-card" key={c.key}>
            <div className={`c-logo ${c.cls}`}>{c.lbl}</div>
            <div className="c-info">
              <div className="c-name">{c.name}</div>
              <div className="c-status">{c.status}</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={couriers[c.key]}
                onChange={(e) => toggleCourier(c.key, e.target.checked)}
              />
              <span className="t-slider"></span>
            </label>
          </div>
        ))}
      </div>

      <div className="track-panel">
        <h3>
          <svg width="18" height="18">
            <use href="#ic-truck" />
          </svg>
          Lacak Resi Pengiriman
        </h3>
        <form onSubmit={handleCekResi} style={{ marginBottom: '20px' }}>
          <div className="track-row">
            <select
              className="form-select"
              id="resi-courier"
              style={{ flex: '0 0 160px', width: 'auto' }}
              value={resiCourier}
              onChange={(e) => setResiCourier(e.target.value)}
            >
              <option value="JNE">JNE Express</option>
              <option value="J&amp;T">J&amp;T Express</option>
            </select>
            <input
              type="text"
              className="form-input"
              id="resi-input"
              placeholder="Masukkan nomor resi..."
              style={{ flex: '1', minWidth: '150px' }}
              value={resiInput}
              onChange={(e) => setResiInput(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" id="btn-resi">
              Lacak
            </button>
          </div>
        </form>

        <div id="resi-result" style={{ display: trackResult ? 'block' : 'none' }}>
          {trackResult && (
            <div style={{ background: 'var(--bg-2)', borderRadius: 'var(--r-md)', padding: '20px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                <strong style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>{trackResult.resiNumber}</strong>
                <span className="sbadge s-dikirim">{trackResult.courierName}</span>
              </div>
              <div style={{ display: 'flex', position: 'relative', overflowX: 'auto', paddingBottom: '10px' }}>
                {trackResult.stages.map((s, i) => {
                  const isCompleted = i <= trackResult.activeStageIdx;
                  return (
                    <div style={{ flex: '1', minWidth: '70px', textAlign: 'center', position: 'relative' }} key={i}>
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          margin: '0 auto',
                          background: isCompleted ? 'var(--primary)' : 'var(--border)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          zIndex: 1,
                          position: 'relative',
                        }}
                      >
                        {isCompleted ? (
                          <svg
                            width="12"
                            height="12"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <span style={{ color: 'var(--text-3)', fontSize: '0.7rem' }}>·</span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '0.69rem',
                          marginTop: '7px',
                          color: isCompleted ? 'var(--text-1)' : 'var(--text-3)',
                          lineHeight: 1.35,
                          padding: '0 2px',
                        }}
                      >
                        {s}
                      </div>
                      {i < trackResult.stages.length - 1 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '13px',
                            left: '50%',
                            width: '100%',
                            height: '2px',
                            background: i < trackResult.activeStageIdx ? 'var(--primary)' : 'var(--border)',
                          }}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p style={{ marginTop: '16px', fontSize: '0.79rem', color: 'var(--text-3)' }}>
                Status terakhir:{' '}
                <strong style={{ color: 'var(--text-1)' }}>
                  {trackResult.stages[trackResult.activeStageIdx]}
                </strong>{' '}
                &middot; {new Date().toLocaleDateString('id-ID')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
