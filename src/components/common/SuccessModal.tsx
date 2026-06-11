import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  orderId: string;
  onClose: () => void;
  onNavigateToHistory: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  orderId,
  onClose,
  onNavigateToHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'open' : ''}`}
      id="success-modal-overlay"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'success-modal-overlay') {
          onClose();
        }
      }}
    >
      <div className="modal">
        <div className="success-modal">
          <div className="success-icon">
            <svg
              width="36"
              height="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2>Pesanan Berhasil!</h2>
          <p>Terima kasih telah berbelanja di Bakoel. Pesanan Anda telah diterima dan sedang diproses.</p>
          <div className="order-ref" id="success-order-ref">
            #{orderId}
          </div>
          <button
            className="btn btn-primary"
            style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}
            onClick={() => {
              onClose();
              onNavigateToHistory();
            }}
          >
            Lihat Riwayat Order
          </button>
        </div>
      </div>
    </div>
  );
};
