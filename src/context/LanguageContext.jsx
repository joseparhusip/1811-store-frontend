// src/context/LanguageContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Kamus terjemahan
const translations = {
  id: {
    // Navbar
    navbar: {
      home: 'Beranda',
      shop: 'Toko',
      about: 'Tentang',
      contact: 'Kontak',
      help: 'Bantuan & FAQ',
      account: 'Akun Saya',
      tagline: 'PAKAIAN BAGUS DIBUAT DARI TANGAN YANG BAIK'
    },
    
    // Home Page
    home: {
      newArrivals: 'KOLEKSI TERBARU',
      menCollection: 'Koleksi Pria dari 1811',
      shopNow: 'BELANJA SEKARANG',
      designTshirt: 'Desain Kaos Anda',
      women: 'WANITA',
      men: 'PRIA',
      style: 'gaya 1811',
      productOverview: 'IKHTISAR PRODUK',
      allProducts: 'Semua Produk',
      category: 'Kategori',
      loadMore: 'MUAT LEBIH BANYAK',
      noProducts: 'Tidak ada produk dalam kategori ini.',
      videoTitle: 'Gaya Kami Bergerak'
    },

    // Product
    product: {
      size: 'Ukuran',
      color: 'Warna',
      addToCart: 'TAMBAH KE KERANJANG',
      price: 'Harga',
      description: 'Kaos 1811 yang memiliki bahan baju yang lembut dan nyaman untuk dipakai kemana saja.',
      notFound: 'Produk tidak ditemukan!',
      backToShop: 'Silakan kembali ke halaman',
      addedToCart: 'Kaos Berhasil Ditambahkan ke Keranjang'
    },

    // Cart
    cart: {
      title: 'Keranjang Belanja',
      product: 'PRODUK',
      size: 'UKURAN', 
      quantity: 'JUMLAH',
      total: 'TOTAL',
      remove: 'Hapus',
      cartTotal: 'TOTAL KERANJANG',
      subtotal: 'Subtotal',
      checkout: 'CHECKOUT',
      empty: 'Keranjang Anda kosong.',
      emptyDesc: 'Sepertinya Anda belum menambahkan apapun ke keranjang.',
      startShopping: 'Mulai Belanja'
    },

    // Checkout
    checkout: {
      title: 'CHECKOUT',
      orderDetails: 'DETAIL PESANAN',
      fullName: 'Nama Lengkap',
      email: 'Email/Nomor telepon',
      province: 'Provinsi',
      city: 'Kota',
      district: 'Kecamatan',
      postalCode: 'Kode Pos',
      fullAddress: 'Alamat lengkap',
      notes: 'Catatan (opsional)',
      paymentMethod: 'Metode Pembayaran',
      placeOrder: 'BUAT PESANAN',
      shipping: 'Ongkos kirim',
      otherFees: 'Biaya Lain-lain'
    },

    // Payment
    payment: {
      title: 'PEMBAYARAN',
      virtualAccount: 'No. Rec/Virtual Account',
      uploadProof: 'Unggah Bukti Pembayaran',
      totalPayment: 'Total Pembayaran',
      finish: 'SELESAI',
      thankYou: 'Terima Kasih!',
      paymentMessage: 'Pembayaran Anda akan segera kami verifikasi. Silakan menunggu informasi selanjutnya.',
      backToHome: 'Kembali ke Beranda'
    },

    // About
    about: {
      ourStory: 'CERITA KAMI',
      ourMission: 'MISI KAMI',
      storyText1: 'Nama 1811 berasal dari tahun lahirnya Raden Saleh, seorang seniman besar Indonesia. Kami terinspirasi oleh keyakinan bahwa seni adalah cara manusia untuk mengekspresikan perasaan mereka dengan bebas.',
      storyText2: 'Dengan nama 1811, kami ingin membawa semangat itu ke dalam setiap karya kami. Kami percaya bahwa setiap orang memiliki perasaan, dan berhak untuk mengekspresikannya—salah satunya melalui apa yang mereka kenakan.',
      storyText3: 'Kami tidak hanya membuat pakaian; Anda bisa menciptakan desain yang bermakna, yang bisa menjadi bagian dari cerita dan gaya hidup Anda.',
      storyText4: 'Dengan demikian, Pakaian Bagus Dibuat Dari Tangan Yang Baik.',
      missionText1: 'Misi kami di 1811 adalah membawa semangat seni ke dalam kehidupan sehari-hari melalui desain yang bermakna dan unik.',
      missionTitle: 'Kami bertujuan untuk:',
      mission1: 'Menciptakan pakaian yang tidak hanya nyaman tetapi juga menceritakan kisah.',
      mission2: 'Menyediakan ruang bagi setiap orang untuk mengekspresikan diri dengan bebas.',
      mission3: 'Mengangkat seni dan budaya Indonesia ke dalam gaya kontemporer.',
      missionText2: 'Kami percaya bahwa setiap orang itu unik, dan pakaian bisa menjadi cara untuk menunjukkan siapa kita sebenarnya. Setiap produk 1811 dibuat dengan perhatian, detail, dan pesan yang ingin disampaikan.'
    },

    // Contact
    contact: {
      sendMessage: 'Kirim Pesan',
      yourEmail: 'Alamat Email Anda',
      howCanHelp: 'Bagaimana Kami Bisa Membantu?',
      submit: 'KIRIM',
      thankYou: 'Terima Kasih!',
      messageSuccess: 'Pesan Anda telah berhasil terkirim. Kami akan segera menghubungi Anda kembali.',
      address: 'Alamat',
      letsTalk: 'Mari Bicara',
      saleSupport: 'Dukungan Penjualan'
    },

    // Auth
    auth: {
      login: 'MASUK',
      signup: 'DAFTAR',
      email: 'Email',
      password: 'Kata Sandi',
      username: 'Nama Pengguna',
      phone: 'Nomor Handphone',
      enterEmail: 'Masukkan email Anda',
      enterPassword: 'Masukkan kata sandi Anda',
      enterUsername: 'Masukkan nama pengguna Anda',
      enterPhone: 'Masukkan nomor handphone Anda',
      forgetPassword: 'Lupa Kata Sandi?',
      noAccount: 'Belum punya akun?',
      haveAccount: 'Sudah punya akun?',
      loginSuccess: '🎉 Login Berhasil! Selamat Datang Kembali.'
    },

    // Shop
    shop: {
      showing: 'Menampilkan',
      of: 'dari',
      products: 'produk',
      filteredBy: 'Difilter berdasarkan:',
      noProducts: 'Tidak ada produk ditemukan',
      tryDifferent: 'Coba pilih kategori yang berbeda atau periksa kembali nanti.'
    },

    // Footer
    footer: {
      categories: 'KATEGORI',
      help: 'BANTUAN',
      trackOrder: 'Lacak Pesanan',
      returns: 'Pengembalian',
      faqs: 'FAQ',
      getInTouch: 'HUBUNGI KAMI',
      contactText: 'Ada pertanyaan? Beritahu kami di toko 1811, Jl. Sariasih No.54, Sarijadi, Kec. Sukasari, Kota Bandung, Jawa Barat 40151',
      callUs: 'Hubungi kami di',
      newsletter: 'NEWSLETTER',
      copyright: 'Hak Cipta © 1811 2025 Semua hak dilindungi'
    }
  },

  en: {
    // Navbar
    navbar: {
      home: 'Home',
      shop: 'Shop',
      about: 'About',
      contact: 'Contact',
      help: 'Help & FAQs',
      account: 'My Account',
      tagline: 'GOOD CLOTHES MADE FROM GOOD HAND'
    },

    // Home Page
    home: {
      newArrivals: 'NEW ARRIVALS',
      menCollection: 'Men Collection from 1811',
      shopNow: 'SHOP NOW',
      designTshirt: 'Design Your T-Shirt',
      women: 'WOMEN',
      men: 'MEN',
      style: '1811 style',
      productOverview: 'PRODUCT OVERVIEW',
      allProducts: 'All Products',
      category: 'Category',
      loadMore: 'LOAD MORE',
      noProducts: 'No products in this category.',
      videoTitle: 'Our Style in Motion'
    },

    // Product
    product: {
      size: 'Size',
      color: 'Color',
      addToCart: 'ADD TO CART',
      price: 'Price',
      description: '1811 T-shirt with soft and comfortable fabric for wearing anywhere.',
      notFound: 'Product not found!',
      backToShop: 'Please return to',
      addedToCart: 'T-Shirt Successfully Added to Cart'
    },

    // Cart
    cart: {
      title: 'Shopping Cart',
      product: 'PRODUCT',
      size: 'SIZE',
      quantity: 'QUANTITY',
      total: 'TOTAL',
      remove: 'Remove',
      cartTotal: 'CART TOTAL',
      subtotal: 'Subtotal',
      checkout: 'CHECKOUT',
      empty: 'Your cart is empty.',
      emptyDesc: 'Looks like you haven\'t added anything to your cart yet.',
      startShopping: 'Start Shopping'
    },

    // Checkout
    checkout: {
      title: 'CHECKOUT',
      orderDetails: 'ORDER DETAILS',
      fullName: 'Full Name',
      email: 'Email/Phone Number',
      province: 'Province',
      city: 'City',
      district: 'District',
      postalCode: 'Postal Code',
      fullAddress: 'Full Address',
      notes: 'Notes (optional)',
      paymentMethod: 'Payment Method',
      placeOrder: 'PLACE ORDER',
      shipping: 'Shipping',
      otherFees: 'Other Fees'
    },

    // Payment
    payment: {
      title: 'PAYMENT',
      virtualAccount: 'Virtual Account No.',
      uploadProof: 'Upload Payment Proof',
      totalPayment: 'Total Payment',
      finish: 'FINISH',
      thankYou: 'Thank You!',
      paymentMessage: 'Your payment will be verified shortly. Please wait for further information.',
      backToHome: 'Back to Home'
    },

    // About
    about: {
      ourStory: 'OUR STORY',
      ourMission: 'OUR MISSION',
      storyText1: 'The name 1811 from the year of birth of Raden Saleh, a great Indonesian artist. We are inspired by the belief that art is a way for humans to freely express their feelings.',
      storyText2: 'In the name 1811, we want to bring that spirit into each of our works. We believe that everyone has feelings, and has the right to express them—one way being through what they wear.',
      storyText3: 'We don\'t just make clothes; you can create designs that hold meaning, that can become part of your story and lifestyle.',
      storyText4: 'Thus, Good Clothes Made From Good Hand.',
      missionText1: 'Our mission at 1811 is to bring the spirit of art into everyday life through meaningful and unique designs.',
      missionTitle: 'We aim to:',
      mission1: 'Create clothing that is not only comfortable but also tells a story.',
      mission2: 'Provide a space for everyone to express themselves freely.',
      mission3: 'Elevate Indonesian art and culture into contemporary style.',
      missionText2: 'We believe that everyone is unique, and clothing can be a way to show who we truly are. Every 1811 product is crafted with care, attention to detail, and a message to convey.'
    },

    // Contact
    contact: {
      sendMessage: 'Send Us A Message',
      yourEmail: 'Your Email Address',
      howCanHelp: 'How Can We Help?',
      submit: 'SUBMIT',
      thankYou: 'Thank You!',
      messageSuccess: 'Your message has been sent successfully. We will contact you back soon.',
      address: 'Address',
      letsTalk: 'Lets Talk',
      saleSupport: 'Sale Support'
    },

    // Auth
    auth: {
      login: 'LOGIN',
      signup: 'SIGNUP',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      phone: 'Phone Number',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      enterUsername: 'Enter your username',
      enterPhone: 'Enter your phone number',
      forgetPassword: 'Forget Password?',
      noAccount: 'Don\'t have an account?',
      haveAccount: 'Already have an account?',
      loginSuccess: '🎉 Login Successful! Welcome Back.'
    },

    // Shop
    shop: {
      showing: 'Showing',
      of: 'of',
      products: 'products',
      filteredBy: 'Filtered by:',
      noProducts: 'No products found',
      tryDifferent: 'Try selecting a different category or check back later.'
    },

    // Footer
    footer: {
      categories: 'CATEGORIES',
      help: 'HELP',
      trackOrder: 'Track Order',
      returns: 'Returns',
      faqs: 'FAQs',
      getInTouch: 'GET IN TOUCH',
      contactText: 'Any questions? Let us know in store 1811, Jl. Sariasih No.54, Sarijadi, Kec. Sukasari, Kota Bandung, Jawa Barat 40151',
      callUs: 'Call us on',
      newsletter: 'NEWSLETTER',
      copyright: 'Copyright © 1811 2025 All rights reserved'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  // Ambil bahasa dari localStorage atau default ke 'id'
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('selectedLanguage');
    return savedLang || 'id';
  });

  // Simpan pilihan bahasa ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('selectedLanguage', language);
  }, [language]);

  // Fungsi untuk mengganti bahasa
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Fungsi untuk mendapatkan teks terjemahan
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (let k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key jika terjemahan tidak ditemukan
      }
    }
    
    return value || key;
  };

  const value = {
    language,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};