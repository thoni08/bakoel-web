export interface Product {
  id: number;
  name: string;
  cat: 'Makanan' | 'Fashion' | 'Kerajinan' | 'Elektronik';
  icon: string;
  price: number;
  stock: number;
  status: 'Aktif' | 'Nonaktif';
  seller: string;
  desc: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Menunggu' | 'Diproses' | 'Dikirim' | 'Selesai';
  buyer: string;
}

export interface CartItem {
  id: number;
  qty: number;
}

export interface CourierSettings {
  jne: boolean;
  jnt: boolean;
  sc: boolean;
}
