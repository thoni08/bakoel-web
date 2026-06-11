import React from 'react';

export interface ToastMessage {
  id: number;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="toast-container" id="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: number) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    // Start fade out animation slightly before 2.8s
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, 2500);

    // Completely remove toast after 2.8s
    const removeTimer = setTimeout(() => {
      onRemove(toast.id);
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, onRemove]);

  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateX(0)' : 'translateX(16px)',
    transition: 'all 0.28s ease',
  };

  return (
    <div className="toast" style={style}>
      {toast.message}
    </div>
  );
};
