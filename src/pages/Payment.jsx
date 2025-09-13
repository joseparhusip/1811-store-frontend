// src/pages/Payment.jsx

import React, { useState, useEffect } from 'react'; // <-- MODIFIKASI
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentInstructions } from '../data/paymentData';
import { useCart } from '../context/CartContext';
import '../css/Payment.css';
import LoadingSpinner from '../components/common/LoadingSpinner'; // <-- BARU

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // --- BARU: State dan Effect untuk loading ---
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  // ------------------------------------------

  const [paymentProof, setPaymentProof] = useState(null);
  const [fileError, setFileError] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const { orderDetails } = location.state || {};

  // --- BARU: Render loading spinner ---
  if (isLoading) {
    return <LoadingSpinner />;
  }
  // ---------------------------------

  if (!orderDetails) {
    return (
      <div className="payment-container">
        <p>Detail pesanan tidak ditemukan. Silakan kembali ke keranjang.</p>
        <button onClick={() => navigate('/cart')}>Kembali ke Keranjang</button>
      </div>
    );
  }

  const paymentData = paymentInstructions[orderDetails.paymentMethod];
  const virtualAccount = '8801' + Math.floor(100000000 + Math.random() * 900000000);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];
    setPaymentProof(null);
    setFileError('');
    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) { setFileError('Tipe file tidak valid. Harap unggah gambar (jpg, png, webp, svg).'); return; }
      if (file.size > MAX_FILE_SIZE) { setFileError('Ukuran file terlalu besar. Maksimal 5 MB.'); return; }
      setPaymentProof(file);
    }
  };

  const handleFinish = () => {
    if (!paymentProof) { setFileError('Harap unggah bukti pembayaran Anda.'); return; }
    console.log("Order Details:", orderDetails);
    console.log("Bukti Pembayaran:", paymentProof);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };
  
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="payment-container">
      <div className="payment-header">
        <button onClick={() => navigate(-1)} className="back-button">&#x2190;</button>
        <h2>PEMBAYARAN</h2>
      </div>

      <div className="payment-content">
        <div className="payment-details-card">
          <img src={paymentData.logo} alt={`${paymentData.name} logo`} className="bank-logo" />
          <p className="va-label">No. Rec/Virtual Account</p>
          <p className="va-number">{virtualAccount}</p>
          <div className="payment-info">
            <p>Proses verifikasi kurang dari 10 menit setelah pembayaran berhasil.</p>
            <p>Bayar pesanan ke Virtual Account di atas sebelum membuat pesanan kembali.</p>
          </div>
          
          <div className="upload-section">
            <label htmlFor="payment-proof-input" className="upload-label">Unggah Bukti Pembayaran</label>
            <input id="payment-proof-input" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml" />
            {paymentProof && <p className="file-name">File: {paymentProof.name}</p>}
            <p className="file-info-text"><b>Batas 5 MB untuk gambar</b></p>
            {fileError && <p className="file-error-text">{fileError}</p>}
          </div>

          <div className="total-payment">
            <span>Total Pembayaran</span>
            <span className="total-amount">{formatPrice(orderDetails.totalPrice)}</span>
          </div>
        </div>

        <div className="payment-instructions">
          {paymentData.instructions.map((instr, index) => (
            <div key={index} className="instruction-group">
              <h4>{instr.title}</h4>
              <ol>{instr.steps.map((step, stepIndex) => (<li key={stepIndex}>{step}</li>))}</ol>
            </div>
          ))}
        </div>
      </div>
      
      <div className="payment-footer">
        <button onClick={handleFinish} className="finish-button">SELESAI</button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">✅</div>
            <h3>Terima Kasih!</h3>
            <p>Pembayaran Anda akan segera kami verifikasi. Silakan menunggu informasi selanjutnya.</p>
            <button onClick={handleCloseModal} className="modal-button">Kembali ke Beranda</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;