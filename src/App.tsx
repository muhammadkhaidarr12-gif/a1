import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Star, 
  Check, 
  ArrowRight,
  CreditCard,
  User,
  Mail,
  MapPin,
  Utensils
} from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  specs: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

const productsData: Product[] = [
  {
    id: 1,
    title: 'Truffle Wagyu Burger',
    price: 145000,
    category: 'Makanan Utama',
    rating: 4.9,
    reviewsCount: 168,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
    description: 'Patty Daging Sapi Wagyu Premium seberat 150g dipanggang sempurna, disajikan dengan saus Truffle Aioli hitam kustom, keju cheddar meleleh, bawang bombay karamel, di dalam roti Brioche panggang yang lembut.',
    specs: ['Daging: 100% Wagyu Beef Grade MB5', 'Saus: Black Truffle Aioli kustom', 'Roti: Artisanal Brioche Bun', 'Penyajian: Hangat & Segar']
  },
  {
    id: 2,
    title: 'Indomie Soto Mie',
    price: 3500,
    category: 'Makanan Instan',
    rating: 4.8,
    reviewsCount: 146,
    image: '/indomie_soto_mie.png',
    description: 'Mi instan kuah rasa soto mie khas Bogor dengan kuah segar gurih beraroma jeruk nipis, seledri, dan daun bawang segar.',
    specs: ['Rasa: Soto Mie Gurih', 'Isi: 1 Bungkus Standard', 'Kemasan: Mie Instan Kuah', 'Penyajian: Panas & Nikmat']
  },
  {
    id: 3,
    title: 'Indomie Goreng',
    price: 3500,
    category: 'Makanan Instan',
    rating: 4.9,
    reviewsCount: 320,
    image: '/indomie_goreng_original.png',
    description: 'Mi instan goreng legendaris Indomie dengan cita rasa gurih khas Indonesia, lengkap dengan kecap manis, saus cabai, minyak bumbu, dan taburan bawang goreng renyah.',
    specs: ['Porsi: Standard', 'Rasa: Original Klasik', 'Kemasan: Mie Instan Goreng', 'Penyajian: Taburan bawang goreng renyah']
  },
  {
    id: 4,
    title: 'Nasi Goreng Wagyu Kecombrang',
    price: 95000,
    category: 'Makanan Utama',
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500&auto=format&fit=crop&q=60',
    description: 'Nasi goreng premium dengan potongan daging sapi wagyu MB5, wewangian kecombrang segar yang aromatik, telur mata sapi organik, acar segar, dan kerupuk udang premium.',
    specs: ['Daging: Sapi Wagyu Premium MB5', 'Aroma: Irisan Kecombrang Segar', 'Telur: Telur Mata Sapi Organik', 'Porsi: Kenyang & Memuaskan']
  },
  {
    id: 5,
    title: 'Sate Maranggi Angus Beef',
    price: 115000,
    category: 'Makanan Utama',
    rating: 4.9,
    reviewsCount: 118,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60',
    description: 'Sate khas Purwakarta dari potongan daging sapi Angus pilihan yang empuk, dibakar dengan bumbu ketumbar madu harum, disajikan dengan sambal tomat segar pedas manis.',
    specs: ['Daging: Potongan Angus Beef Tenderloin', 'Bumbu: Ketumbar & Madu Alami', 'Pelengkap: Sambal Tomat & Cabai Rawit', 'Porsi: 10 tusuk sate tebal']
  },
  {
    id: 6,
    title: 'Mie Ayam Truffle Premium',
    price: 78000,
    category: 'Makanan Utama',
    rating: 4.8,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60',
    description: 'Mie buatan tangan kenyal dengan potongan ayam kampung bumbu kecap gurih, jamur shitake, disiram minyak truffle harum dan kuah kaldu hangat terpisah.',
    specs: ['Mie: Handmade kenyal alami', 'Aroma: Minyak Truffle Hitam Asli', 'Topping: Ayam Kampung & Jamur Shitake', 'Penyajian: Kuah kaldu disajikan terpisah']
  },
  {
    id: 7,
    title: 'Pop Spageti Spicy Bolognese',
    price: 4000,
    category: 'Makanan Instan',
    rating: 4.7,
    reviewsCount: 154,
    image: '/pop_spageti_bolognese.png',
    description: 'Spageti instan praktis dengan saus bolognese daging sapi gurih berpadu rasa pedas yang membakar selera khas Pop Spageti.',
    specs: ['Varian: Spicy Bolognese', 'Jenis: Pasta Instan', 'Waktu Masak: 3 Menit Siap Saji', 'Sajian: Saus daging pedas melimpah']
  },
  {
    id: 8,
    title: 'Wow Spageti Creamy Carbonara',
    price: 4000,
    category: 'Makanan Instan',
    rating: 4.8,
    reviewsCount: 198,
    image: '/wow_spageti_carbonara.png',
    description: 'Spageti instan premium dengan saus krim carbonara keju gurih melimpah, dilengkapi taburan topping krispi daging sapi panggang dan bubuk cabai.',
    specs: ['Varian: Creamy Carbonara', 'Topping: Daging Krispi Panggang', 'Jenis: Pasta Instan Premium', 'Rasa: Gurih & Creamy Manis']
  },
  {
    id: 9,
    title: 'Indomie Goreng Aceh',
    price: 3500,
    category: 'Makanan Instan',
    rating: 4.8,
    reviewsCount: 198,
    image: '/indomie_goreng_aceh.png',
    description: 'Mi instan goreng dengan cita rasa kuliner khas Aceh yang kaya akan rempah-rempah pilihan dan tingkat kepedasan yang pas.',
    specs: ['Berat: 90 gram', 'Jenis: Mi Goreng Instan', 'Rasa: Khas Mie Aceh Pedas Rempah', 'Produksi: PT Indofood CBP Sukses Makmur']
  },
  {
    id: 10,
    title: 'Indomie Goreng Rendang',
    price: 3500,
    category: 'Makanan Instan',
    rating: 4.9,
    reviewsCount: 250,
    image: '/indomie_goreng.png',
    description: 'Mi instan goreng rasa rendang khas Padang yang gurih dan pedas nikmat. Bumbu rendang autentik dengan aroma rempah yang kaya dan menggugah selera.',
    specs: ['Berat: 91 gram', 'Jenis: Mi Goreng Instan', 'Rasa: Rendang Pedas Gurih', 'Produksi: PT Indofood CBP Sukses Makmur']
  },
  {
    id: 11,
    title: 'Gudang Garam Signature',
    price: 27000,
    category: 'Rokok',
    rating: 4.8,
    reviewsCount: 165,
    image: '/gudang_garam_signature.png',
    description: 'Rokok kretek filter premium Gudang Garam Signature dengan cita rasa cengkeh khas dan tembakau gurih mantap, isi 12 batang.',
    specs: ['Isi: 12 Batang', 'Jenis: Kretek Filter', 'Rasa: Gurih & Mantap', 'Kategori: Rokok Premium']
  },
  {
    id: 12,
    title: 'Sampoerna A Mild',
    price: 35000,
    category: 'Rokok',
    rating: 4.9,
    reviewsCount: 210,
    image: '/sampoerna_a_mild.png',
    description: 'Rokok LTLN (Low Tar Low Nicotine) terpopuler dengan tarikan halus, aroma cengkeh yang lembut dan seimbang, isi 16 batang.',
    specs: ['Isi: 16 Batang', 'Jenis: LTLN (Low Tar Low Nicotine)', 'Tar: 14 mg, Nikotin: 1.0 mg', 'Rasa: Halus & Ringan']
  },
  {
    id: 13,
    title: 'Magnum Filter',
    price: 25000,
    category: 'Rokok',
    rating: 4.7,
    reviewsCount: 94,
    image: '/magnum_filter.png',
    description: 'Rokok filter premium dengan rasa mantap berlapis aroma khas kretek tradisional sejati, isi 12 batang.',
    specs: ['Isi: 12 Batang', 'Jenis: Kretek Filter', 'Kemasan: Box Hitam Elegan', 'Rasa: Mantap & Nikmat']
  },
  {
    id: 14,
    title: 'Gudang Garam Surya 16',
    price: 34000,
    category: 'Rokok',
    rating: 4.9,
    reviewsCount: 185,
    image: '/gudang_garam_surya_16.png',
    description: 'Rokok kretek filter legendaris Surya Kediri dengan racikan saus cengkeh harum manis berkarakter tebal.',
    specs: ['Isi: 16 Batang', 'Jenis: Kretek Filter', 'Tar: 30 mg, Nikotin: 1.9 mg', 'Rasa: Harum & Gurih Manis']
  },
  {
    id: 15,
    title: 'Good Day Cappuccino',
    price: 3000,
    category: 'Minuman',
    rating: 4.8,
    reviewsCount: 245,
    image: '/good_day_cappuccino.png',
    description: 'Kopi instan cappuccino sachet legendaris dengan tambahan cokelat granul (cocoa granule) di atasnya, manis gurih mantap.',
    specs: ['Jenis: Kopi Instan Sachet', 'Rasa: Cappuccino & Cokelat Granul', 'Penyajian: Panas / Dingin', 'Berat: 25 gram']
  },
  {
    id: 16,
    title: 'Kopi Kapal Api Special Mix',
    price: 3000,
    category: 'Minuman',
    rating: 4.9,
    reviewsCount: 312,
    image: '/kapal_api.png',
    description: 'Kopi hitam instan legendaris Kapal Api dengan perpaduan kopi bubuk murni aroma mantap dan gula manis yang pas.',
    specs: ['Jenis: Kopi Hitam + Gula', 'Rasa: Kopi Hitam Mantap', 'Penyajian: Panas', 'Berat: 24 gram']
  },
  {
    id: 17,
    title: 'Kopi Susu ABC',
    price: 3000,
    category: 'Minuman',
    rating: 4.8,
    reviewsCount: 189,
    image: '/kopi_susu_abc.png',
    description: 'Kopi instan perpaduan kopi bubuk mantap, gula manis, dan susu lembut yang gurih khas kopi susu ABC.',
    specs: ['Jenis: Kopi + Gula + Susu', 'Rasa: Kopi Susu Lembut', 'Penyajian: Panas / Dingin', 'Berat: 31 gram']
  },
  {
    id: 18,
    title: 'Djarum Coklat',
    price: 18000,
    category: 'Rokok',
    rating: 4.8,
    reviewsCount: 95,
    image: '/djarum_coklat.png',
    description: 'Rokok kretek tanpa filter legendaris Djarum Coklat dengan rajangan tembakau Srintil pilihan yang harum dan gurih alami.',
    specs: ['Isi: 12 Batang', 'Jenis: Kretek Tanpa Filter', 'Rasa: Gurih Alami Klasik', 'Produksi: PT Djarum Kudus']
  },
  {
    id: 19,
    title: 'Teh Tarik',
    price: 5000,
    category: 'Minuman',
    rating: 4.8,
    reviewsCount: 156,
    image: '/teh_tarik_saset.png',
    description: 'Teh tarik khas warung dengan racikan teh hitam pekat dan kental manis gurih, ditarik hingga menghasilkan busa melimpah dan rasa yang lembut.',
    specs: ['Bahan: Teh hitam & Kental manis', 'Penyajian: Hangat / Dingin dengan Es', 'Kelebihan: Busa melimpah & creamy', 'Volume: Gelas ukuran 300ml']
  }
];

const categories = ['Semua', 'Makanan Utama', 'Makanan Instan', 'Rokok', 'Minuman'];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/warung_madura_logo.png');

  // Dynamic canvas process to make solid black background transparent on image load
  useEffect(() => {
    const img = new Image();
    img.src = '/warung_madura_logo.png';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          const maxVal = Math.max(r, g, b);
          if (maxVal < 85) {
            data[i+3] = 0; // set alpha 0 to make it transparent
          }
        }
        ctx.putImageData(imgData, 0, 0);
        setLogoUrl(canvas.toDataURL());
      }
    };
  }, []);
  
  // Intro Loading Splash state
  const [showIntro, setShowIntro] = useState(true);
  const [isIntroFading, setIsIntroFading] = useState(false);
  
  // Checkout flow states
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    card: ''
  });
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState('');

  const handleStartShopping = () => {
    setIsIntroFading(true);
    setTimeout(() => {
      setShowIntro(false);
    }, 800); // wait for fade-out translation
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('warung_aa_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save cart to localStorage on changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('warung_aa_cart', JSON.stringify(newCart));
  };

  // Add Product to Cart
  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      saveCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      saveCart([...cart, { product, quantity: 1 }]);
    }
    showToast(`Berhasil menambahkan ${product.title} ke keranjang!`);
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (productId: number, delta: number) => {
    const newCart = cart.map(item => {
      if (item.product.id === productId) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];
    saveCart(newCart);
  };

  // Remove Item from Cart
  const handleRemoveItem = (productId: number) => {
    saveCart(cart.filter(item => item.product.id !== productId));
  };

  // Calculate Cart Subtotal
  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Format currency to Rupiah style
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Show sliding toast alert
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Handle Checkout Submit
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingOrder(true);
    setTimeout(() => {
      setIsProcessingOrder(false);
      setIsCheckingOut(false);
      setIsCartOpen(false);
      saveCart([]);
      setToastMessage('Terima kasih! Pesanan Anda sedang diproses.');
      setTimeout(() => setToastMessage(''), 4000);
    }, 2000);
  };

  // Filter products based on search and category
  const filteredProducts = productsData.filter(product => {
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app-container">
      {/* Intro Splash Screen */}
      {showIntro && (
        <div className={`intro-splash ${isIntroFading ? 'fade-out' : ''}`}>
          <div className="intro-content">
            <div className="intro-logo-box" style={{ background: '#000000', borderRadius: '50%', padding: '1.25rem', width: '170px', height: '170px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <img 
                src={logoUrl} 
                alt="Angkringan Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'contrast(1.1) brightness(1.0)' }}
              />
            </div>
            <h1 className="intro-title" style={{ color: '#10b981' }}>
              SELAMAT DATANG DI WARUNG AA
            </h1>
            <button 
              onClick={handleStartShopping} 
              className="btn-start-shopping"
              id="btn-start-shopping"
            >
              Mulai Belanja <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Navbar Navigation Header */}
      <nav className="navbar">
        <div className="brand" onClick={() => { setSelectedCategory('Semua'); setSearchQuery(''); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: '#000000', borderRadius: '50%', padding: '4px', width: '42px', height: '42px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <img src={logoUrl} alt="Angkringan Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'contrast(1.15)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#10b981' }}>
            WARUNG AA
          </span>
        </div>

        <div className="search-bar-container">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Cari hidangan kuliner lezat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            id="product-search-input"
          />
        </div>

        <div className="nav-actions">
          <button 
            className="cart-icon-btn" 
            onClick={() => { setIsCartOpen(true); setIsCheckingOut(false); }}
            id="cart-drawer-trigger"
          >
            <ShoppingBag size={22} />
            {cart.length > 0 && (
              <span className="cart-badge" id="cart-item-count">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Category Filter Bar */}
      <div className="categories-container">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
            id={`category-pill-${cat.toLowerCase().replace(' ', '-')}`}
          >
            {cat}
          </button>
        ))}
      </div>



      {/* Main Catalog Area */}
      <main className="main-content">
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
          {selectedCategory === 'Semua' ? 'Menu Kuliner Unggulan' : `Menu Kategori: ${selectedCategory}`}
        </h2>
        
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--text-secondary)' }}>
            <h3>Tidak ditemukan makanan yang cocok dengan pencarian Anda.</h3>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => setSelectedProduct(product)}
                id={`product-card-${product.id}`}
              >
                <div className="product-image-box">
                  <img src={product.image} alt={product.title} className="product-image" />
                  <span className="product-category-tag" style={{ color: 'var(--accent-gold)' }}>
                    {product.category}
                  </span>
                </div>
                
                <div className="product-info">
                  <div>
                    <h3 className="product-title">{product.title}</h3>
                    <div className="rating-row">
                      <Star size={14} className="rating-star" />
                      <span className="rating-value">{product.rating}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({product.reviewsCount})</span>
                    </div>
                  </div>
                  
                  <div className="price-row">
                    <span className="price-tag">{formatRupiah(product.price)}</span>
                    <button 
                      className="btn-add-cart"
                      onClick={(e) => handleAddToCart(product, e)}
                      title="Tambahkan ke Pesanan"
                      id={`btn-add-cart-${product.id}`}
                      style={{ background: 'var(--accent-gold)', color: '#020617' }}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart sliding drawer overlay & panel */}
      <div 
        className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={() => setIsCartOpen(false)}
        id="cart-overlay"
      ></div>

      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`} id="cart-drawer-container">
        <div className="cart-header">
          <h3 className="cart-title">
            <Utensils size={20} style={{ color: 'var(--accent-gold)' }} />
            {isCheckingOut ? 'Konfirmasi Pemesanan' : 'Daftar Pesanan Menu'}
          </h3>
          <button className="btn-close" onClick={() => setIsCartOpen(false)} id="btn-close-cart">
            <X size={20} />
          </button>
        </div>

        {/* Cart items list or checkout forms */}
        {!isCheckingOut ? (
          <>
            <div className="cart-items-list">
              {cart.length === 0 ? (
                <div className="cart-empty-message">
                  <Utensils size={48} style={{ color: 'var(--text-muted)' }} />
                  <p>Keranjang pesanan makanan Anda masih kosong.</p>
                  <button className="btn btn-secondary" onClick={() => setIsCartOpen(false)} style={{ fontSize: '0.85rem' }}>
                    Lihat Daftar Menu
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="cart-item" id={`cart-item-${item.product.id}`}>
                    <img src={item.product.image} alt={item.product.title} className="cart-item-image" />
                    
                    <div className="cart-item-info">
                      <h4 className="cart-item-title">{item.product.title}</h4>
                      <span className="cart-item-price">{formatRupiah(item.product.price)}</span>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                        <div className="cart-item-controls">
                          <button 
                            className="btn-qty" 
                            onClick={() => handleUpdateQuantity(item.product.id, -1)}
                            id={`btn-qty-minus-${item.product.id}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="cart-item-qty">{item.quantity}</span>
                          <button 
                            className="btn-qty" 
                            onClick={() => handleUpdateQuantity(item.product.id, 1)}
                            id={`btn-qty-plus-${item.product.id}`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        
                        <button 
                          className="btn-remove-item"
                          onClick={() => handleRemoveItem(item.product.id)}
                          id={`btn-remove-${item.product.id}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span id="cart-subtotal">{formatRupiah(getSubtotal())}</span>
                </div>
                <button 
                  className="btn-checkout" 
                  onClick={() => setIsCheckingOut(true)}
                  id="btn-go-to-checkout"
                >
                  Pesan & Antar Hidangan <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleCheckoutSubmit} className="cart-items-list checkout-panel" id="checkout-form">
            <div className="form-group">
              <label className="form-label"><User size={13} style={{ marginRight: 4 }} /> Nama Penerima / Pemesan</label>
              <input 
                type="text" 
                required
                placeholder="cth: Khaidar"
                value={checkoutForm.name}
                onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})}
                className="form-input"
                id="checkout-name-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Mail size={13} style={{ marginRight: 4 }} /> Alamat Email</label>
              <input 
                type="email" 
                required
                placeholder="cth: khaidar@example.com"
                value={checkoutForm.email}
                onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})}
                className="form-input"
                id="checkout-email-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label"><MapPin size={13} style={{ marginRight: 4 }} /> Alamat Pengiriman (Meja / Kamar / Rumah)</label>
              <input 
                type="text" 
                required
                placeholder="Jalan, Nomor Rumah, Nomor Meja / Kamar"
                value={checkoutForm.address}
                onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})}
                className="form-input"
                id="checkout-address-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Catatan Tambahan (cth: Sendok, Pedas)</label>
              <input 
                type="text" 
                required
                placeholder="cth: Tanpa bawang bombay / extra keju"
                value={checkoutForm.city}
                onChange={e => setCheckoutForm({...checkoutForm, city: e.target.value})}
                className="form-input"
                id="checkout-city-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label"><CreditCard size={13} style={{ marginRight: 4 }} /> Metode Pembayaran (Nomor e-Wallet/Kartu)</label>
              <input 
                type="text" 
                required
                placeholder="cth: GO-PAY / OVO / Mandiri Transfer"
                value={checkoutForm.card}
                onChange={e => setCheckoutForm({...checkoutForm, card: e.target.value})}
                className="form-input"
                id="checkout-card-input"
              />
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div className="cart-summary-row" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                <span>Total Belanja</span>
                <span style={{ color: 'var(--accent-gold)' }}>{formatRupiah(getSubtotal())}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsCheckingOut(false)}
                  style={{ flex: 1 }}
                >
                  Kembali
                </button>
                <button 
                  type="submit" 
                  className="btn-checkout" 
                  disabled={isProcessingOrder}
                  style={{ flex: 1.5 }}
                  id="btn-submit-order"
                >
                  {isProcessingOrder ? 'Memproses Dapur...' : 'Bayar & Proses Antar'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Product Detail Popup Modal */}
      {selectedProduct && (
        <div 
          className="modal-overlay" 
          onClick={() => setSelectedProduct(null)}
          id="product-detail-modal"
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-corner" onClick={() => setSelectedProduct(null)} id="btn-close-modal">
              <X size={16} />
            </button>
            
            <div className="modal-grid">
              <div className="modal-image-box">
                <img src={selectedProduct.image} alt={selectedProduct.title} className="modal-image" />
              </div>
              
              <div className="modal-body">
                <div>
                  <span className="modal-category" style={{ color: 'var(--accent-gold)' }}>{selectedProduct.category}</span>
                  <h2 className="modal-title" style={{ marginTop: '0.25rem' }}>{selectedProduct.title}</h2>
                  <div className="rating-row">
                    <Star size={14} className="rating-star" />
                    <span className="rating-value">{selectedProduct.rating}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>({selectedProduct.reviewsCount} Ulasan Kuliner)</span>
                  </div>
                </div>

                <p className="modal-desc">{selectedProduct.description}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Detail Hidangan:</h4>
                  <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {selectedProduct.specs.map((spec, i) => (
                      <li key={i} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Check size={12} style={{ color: 'var(--accent-emerald)' }} />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="modal-price-btn-row">
                  <span className="modal-price">{formatRupiah(selectedProduct.price)}</span>
                  <button 
                    className="btn-modal-add"
                    onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                    id="btn-modal-add-to-cart"
                    style={{ background: 'var(--accent-gold)', color: '#020617' }}
                  >
                    Masukkan ke Pesanan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating sliding toast notification */}
      {toastMessage && (
        <div className="toast" id="toast-notification">
          <Check size={18} style={{ strokeWidth: 3 }} />
          {toastMessage}
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} <strong>Warung Aa | Kuliner & Cemilan</strong>. Dibuat dengan cinta menggunakan bahan terbaik. All rights reserved.</p>
      </footer>
    </div>
  );
}
