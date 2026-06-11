import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './components/LoginScreen';
import { MainLayout } from './components/MainLayout';
import { SvgLibrary } from './components/common/SvgLibrary';
import { ToastContainer } from './components/common/ToastContainer';

const AppContent: React.FC = () => {
  const { currentRole, toasts, removeToast } = useApp();

  return (
    <div className="batik-bg" style={{ minHeight: '100vh' }}>
      <SvgLibrary />
      
      {currentRole === null ? <LoginScreen /> : <MainLayout />}
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
