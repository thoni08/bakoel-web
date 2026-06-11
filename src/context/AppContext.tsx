import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Order, CartItem, CourierSettings } from '../types';

export interface ToastMessage {
  id: number;
  message: string;
}

interface AppContextType {
  currentRole: 'buyer' | 'seller' | null;
  currentPage: string;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  couriers: CourierSettings;
  toasts: ToastMessage[];
  
  setRole: (role: 'buyer' | 'seller' | null) => void;
  navigateTo: (page: string) => void;
  showToast: (msg: string) => void;
  removeToast: (id: number) => void;
  
  // Cart actions
  addToCart: (productId: number) => void;
  updateCartQty: (productId: number, delta: number) => void;
  removeFromCart: (productId: number) => void;
  
  // Checkout actions
  processCheckout: (
    name: string,
    phone: string,
    address: string,
    city: string,
    zip: string,
    courier: string,
    paymentMethod: string
  ) => string | null;
  
  // Product actions (Seller)
  addProduct: (product: Omit<Product, 'id' | 'seller'>) => void;
  updateProduct: (id: number, product: Omit<Product, 'id' | 'seller'>) => void;
  deleteProduct: (id: number) => void;
  
  // Order actions (Seller)
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  toggleCourier: (key: keyof CourierSettings, val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultProducts: Product[] = [
  { id: 1, name: 'Rendang Daging Sapi Premium', cat: 'Makanan', icon: 'RD', price: 85000, stock: 50, status: 'Aktif', seller: 'Dapur Bu Sari', desc: 'Rendang asli Minang dengan daging sapi pilihan' },
  { id: 2, name: 'Batik Tulis Motif Kawung', cat: 'Fashion', icon: 'BT', price: 350000, stock: 12, status: 'Aktif', seller: 'Batik Nusantara', desc: 'Batik tulis tangan dengan motif kawung' },
  { id: 3, name: 'Keramik Gerabah Plered', cat: 'Kerajinan', icon: 'KG', price: 125000, stock: 30, status: 'Aktif', seller: 'Seni Plered', desc: 'Gerabah tradisional dari pengrajin Plered' },
  { id: 4, name: 'Kopi Arabika Gayo 250gr', cat: 'Makanan', icon: 'KA', price: 65000, stock: 80, status: 'Aktif', seller: 'Kopi Gayo Asli', desc: 'Kopi arabika single origin dari Gayo Aceh' },
  { id: 5, name: 'Sandal Kulit Yogya', cat: 'Fashion', icon: 'SK', price: 195000, stock: 25, status: 'Aktif', seller: 'Kulit Craft YK', desc: 'Sandal kulit sapi asli buatan tangan' },
  { id: 6, name: 'Tas Anyaman Rattan', cat: 'Kerajinan', icon: 'TA', price: 280000, stock: 18, status: 'Aktif', seller: 'Rattan Borneo', desc: 'Tas anyaman rotan dengan desain modern' },
  { id: 7, name: 'Tempe Gembus Organik', cat: 'Makanan', icon: 'TG', price: 15000, stock: 100, status: 'Aktif', seller: 'Tempe Bu Lastri', desc: 'Tempe gembus organik tanpa pengawet' },
  { id: 8, name: 'Sarung Tenun Mandar', cat: 'Fashion', icon: 'ST', price: 420000, stock: 8, status: 'Nonaktif', seller: 'Tenun Mandar', desc: 'Sarung tenun sutra Mandar original' },
  { id: 9, name: 'Speaker Bluetooth Lokal', cat: 'Elektronik', icon: 'SB', price: 150000, stock: 35, status: 'Aktif', seller: 'Elektronik Lokal', desc: 'Speaker bluetooth portable produk lokal' },
  { id: 10, name: 'Wayang Kulit Pakem', cat: 'Kerajinan', icon: 'WK', price: 750000, stock: 5, status: 'Aktif', seller: 'Dalang Karya', desc: 'Wayang kulit buatan pengrajin Solo' },
  { id: 11, name: 'Dendeng Sapi Balado', cat: 'Makanan', icon: 'DS', price: 95000, stock: 45, status: 'Aktif', seller: 'Dapur Bu Sari', desc: 'Dendeng balado dengan resep turun temurun' },
  { id: 12, name: 'Kaos Lurik Jogja', cat: 'Fashion', icon: 'KL', price: 85000, stock: 60, status: 'Aktif', seller: 'Lurik Jogja', desc: 'Kaos berbahan kain lurik motif garis' }
];

const defaultOrders: Order[] = [
  { id: 'PL-241201', date: '2024-12-01', items: [{ name: 'Rendang Daging Sapi Premium', qty: 2, price: 85000 }], total: 185000, status: 'Selesai', buyer: 'Andi Pratama' },
  { id: 'PL-241215', date: '2024-12-15', items: [{ name: 'Batik Tulis Motif Kawung', qty: 1, price: 350000 }, { name: 'Sandal Kulit Yogya', qty: 1, price: 195000 }], total: 560000, status: 'Dikirim', buyer: 'Andi Pratama' },
  { id: 'PL-250101', date: '2025-01-01', items: [{ name: 'Kopi Arabika Gayo 250gr', qty: 3, price: 65000 }], total: 210000, status: 'Diproses', buyer: 'Andi Pratama' },
  { id: 'PL-250110', date: '2025-01-10', items: [{ name: 'Tas Anyaman Rattan', qty: 1, price: 280000 }], total: 295000, status: 'Menunggu', buyer: 'Andi Pratama' }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<'buyer' | 'seller' | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('login');
  
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('bakoel_products');
    return local ? JSON.parse(local) : defaultProducts;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('bakoel_cart');
    return local ? JSON.parse(local) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const local = localStorage.getItem('bakoel_orders');
    return local ? JSON.parse(local) : defaultOrders;
  });

  const [couriers, setCouriers] = useState<CourierSettings>(() => {
    const local = localStorage.getItem('bakoel_couriers');
    return local ? JSON.parse(local) : { jne: true, jnt: true, sc: false };
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bakoel_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bakoel_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bakoel_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bakoel_couriers', JSON.stringify(couriers));
  }, [couriers]);

  // Toast Helpers
  const showToast = (message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (role: 'buyer' | 'seller' | null) => {
    setCurrentRole(role);
    if (role === null) {
      setCurrentPage('login');
    } else {
      setCurrentPage(role === 'buyer' ? 'katalog' : 'dashboard');
    }
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  // Cart Actions
  const addToCart = (productId: number) => {
    const p = products.find((x) => x.id === productId);
    if (!p || p.stock === 0) return;
    
    const existing = cart.find((i) => i.id === productId);
    if (existing) {
      if (existing.qty < p.stock) {
        showToast(`${p.name} ditambahkan ke keranjang`);
        setCart((prevCart) =>
          prevCart.map((i) => (i.id === productId ? { ...i, qty: i.qty + 1 } : i))
        );
      } else {
        showToast('Stok tidak mencukupi');
      }
    } else {
      showToast(`${p.name} ditambahkan ke keranjang`);
      setCart((prevCart) => [...prevCart, { id: productId, qty: 1 }]);
    }
  };

  const updateCartQty = (productId: number, delta: number) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;

    const existing = cart.find((i) => i.id === productId);
    if (!existing) return;

    const newQty = existing.qty + delta;
    if (newQty <= 0) {
      showToast('Item dihapus dari keranjang');
      setCart((prevCart) => prevCart.filter((i) => i.id !== productId));
    } else if (newQty > p.stock) {
      showToast(`Stok maksimal ${p.stock}`);
      setCart((prevCart) =>
        prevCart.map((i) => (i.id === productId ? { ...i, qty: p.stock } : i))
      );
    } else {
      setCart((prevCart) =>
        prevCart.map((i) => (i.id === productId ? { ...i, qty: newQty } : i))
      );
    }
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== productId));
    showToast('Item dihapus dari keranjang');
  };

  // Checkout Processing
  const processCheckout = (
    name: string,
    phone: string,
    address: string,
    city: string,
    zip: string,
    courier: string,
    paymentMethod: string
  ): string | null => {
    if (!name || !phone || !address || !city || !zip || !courier || !paymentMethod) {
      showToast('Lengkapi data pengiriman dan pembayaran');
      return null;
    }

    if (cart.length === 0) {
      showToast('Keranjang masih kosong');
      return null;
    }

    const orderId = 'PL-' + Math.floor(100000 + Math.random() * 900000).toString();
    const items = cart.map((item) => {
      const p = products.find((x) => x.id === item.id)!;
      return {
        name: p.name,
        qty: item.qty,
        price: p.price,
      };
    });

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shippingFee = 15000;
    const total = subtotal + shippingFee;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      items,
      total,
      status: 'Menunggu',
      buyer: name,
    };

    // Deduct stock
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const cartItem = cart.find((c) => c.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
        }
        return p;
      })
    );

    // Save order
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    
    // Clear cart
    setCart([]);

    return orderId;
  };

  // Product Actions (Seller CRUD)
  const addProduct = (pData: Omit<Product, 'id' | 'seller'>) => {
    const newId = Date.now();
    const newProduct: Product = {
      ...pData,
      id: newId,
      seller: 'Toko Saya',
      icon: (pData.icon || pData.name.slice(0, 2)).toUpperCase(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Produk baru berhasil ditambahkan');
  };

  const updateProduct = (id: number, pData: Omit<Product, 'id' | 'seller'>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...pData,
              icon: (pData.icon || pData.name.slice(0, 2)).toUpperCase(),
            }
          : p
      )
    );
    showToast('Produk berhasil diperbarui');
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Produk dihapus');
  };

  // Order Actions (Seller status updates)
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Status order diperbarui: ${status}`);
  };

  const toggleCourier = (key: keyof CourierSettings, val: boolean) => {
    setCouriers((prev) => ({ ...prev, [key]: val }));
    showToast(`${key.toUpperCase()} ${val ? 'diaktifkan' : 'dinonaktifkan'}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentPage,
        products,
        cart,
        orders,
        couriers,
        toasts,
        setRole,
        navigateTo,
        showToast,
        removeToast,
        addToCart,
        updateCartQty,
        removeFromCart,
        processCheckout,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        toggleCourier,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
