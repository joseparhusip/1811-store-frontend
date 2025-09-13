import React, { useState, useEffect } from 'react'; // <-- MODIFIKASI
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import '../css/ProductDetail.css';
import LoadingSpinner from '../components/common/LoadingSpinner'; // <-- BARU

const ProductDetail = () => {
  const { productId } = useParams();
  const product = products.find(p => p.id === parseInt(productId));

  // --- BARU: State dan Effect untuk loading ---
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulasi loading 1.5 detik
    return () => clearTimeout(timer);
  }, []);
  // ------------------------------------------

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('WHITE');
  
  const { addToCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  
  const [reviews, setReviews] = useState([
    { id: 1, name: "Ahmad Rizky", rating: 5, comment: "Kualitas bahan sangat bagus! Nyaman dipakai dan sesuai dengan deskripsi. Highly recommended!", date: "2024-03-15", verified: true },
    { id: 2, name: "Sarah Putri", rating: 4, comment: "Bahannya adem dan tidak mudah kusut. Cuma pengirimannya agak lama, tapi overall puas banget!", date: "2024-03-10", verified: true },
    { id: 3, name: "Budi Santoso", rating: 5, comment: "Ini pembelian kedua saya, kualitas konsisten bagus. Ukurannya pas dan warnanya tidak luntur.", date: "2024-03-05", verified: false },
    { id: 4, name: "Maya Sari", rating: 3, comment: "Bahannya oke, tapi warnanya agak berbeda dari foto. Mungkin karena lighting kamera ya.", date: "2024-02-28", verified: true },
    { id: 5, name: "Eko Prasetyo", rating: 4, comment: "Good quality for the price! Fit sesuai size chart, recommended untuk daily wear.", date: "2024-02-20", verified: true },
    { id: 6, name: "Rina Marlina", rating: 5, comment: "Suka banget sama kualitasnya! Udah dicuci berkali-kali masih bagus. Will order again!", date: "2024-02-15", verified: true }
  ]);

  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [filterRating, setFilterRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const availableSizes = ['S', 'M', 'L', 'XL'];
  const availableColors = ['BLACK', 'WHITE'];

  // --- BARU: Render loading spinner ---
  if (isLoading) {
    return <LoadingSpinner />;
  }
  // ---------------------------------

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Produk tidak ditemukan!</h2>
        <p>Silakan kembali ke halaman <Link to="/shop">Shop</Link>.</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(price);
  };
  
  const handleAddToCart = () => {
    const productToAdd = { ...product, size: selectedSize, color: selectedColor };
    addToCart(productToAdd);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingCount = (rating) => reviews.filter(review => review.rating === rating).length;
  const filteredReviews = filterRating === 0 ? reviews : reviews.filter(review => review.rating === filterRating);
  
  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`} onClick={interactive && onStarClick ? () => onStarClick(index + 1) : undefined}>★</span>
    ));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.name.trim() && newReview.comment.trim()) {
      const review = { id: reviews.length + 1, name: newReview.name, rating: newReview.rating, comment: newReview.comment, date: new Date().toISOString().split('T')[0], verified: false };
      setReviews([review, ...reviews]);
      setNewReview({ name: '', rating: 5, comment: '' });
      setShowReviewForm(false);
    }
  };

  return (
    <>
      <main className="product-detail-container">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} className="main-product-image" />
        </div>
        
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">{formatPrice(product.price)}</p>
          
          <div className="rating-summary">
            <div className="rating-display">
              <div className="stars-display">{renderStars(Math.round(calculateAverageRating()))}</div>
              <span className="rating-text">{calculateAverageRating()} ({reviews.length} reviews)</span>
            </div>
          </div>

          <p className="product-description">T-shirt 1811 yang memiliki bahan baju yang lembut dan nyaman untuk dipakai kemana saja.</p>

          <div className="product-options">
            <div className="option-group">
              <label htmlFor="size">Size</label>
              <div className="size-selector">
                {availableSizes.map((size) => (<button key={size} className={`size-btn ${selectedSize === size ? 'active' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>))}
              </div>
            </div>
            <div className="option-group">
              <label htmlFor="color">Color</label>
              <div className="color-selector">
                {availableColors.map((color) => (<button key={color} className={`color-btn ${selectedColor === color ? 'active' : ''}`} onClick={() => setSelectedColor(color)}>{color}</button>))}
              </div>
            </div>
          </div>
          
          <button className="add-to-cart-button" onClick={handleAddToCart}>ADD TO CART</button>
        </div>
      </main>

      <section className="reviews-section">
        <div className="reviews-container">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            <button className="write-review-btn" onClick={() => setShowReviewForm(!showReviewForm)}>
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          <div className="rating-breakdown">
            <div className="rating-stats">
              <div className="average-rating">
                <span className="big-rating">{calculateAverageRating()}</span>
                <div className="stars-large">{renderStars(Math.round(calculateAverageRating()))}</div>
                <span className="total-reviews">{reviews.length} reviews</span>
              </div>
              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="rating-bar-item">
                    <span className="rating-number">{rating}</span><span className="star">★</span>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${reviews.length > 0 ? (getRatingCount(rating) / reviews.length) * 100 : 0}%` }}></div></div>
                    <span className="rating-count">({getRatingCount(rating)})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {showReviewForm && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <h3>Write Your Review</h3>
              <div className="form-group"><label>Your Name</label><input type="text" value={newReview.name} onChange={(e) => setNewReview({...newReview, name: e.target.value})} placeholder="Enter your name" required /></div>
              <div className="form-group"><label>Rating</label><div className="rating-input">{renderStars(newReview.rating, true, (rating) => setNewReview({...newReview, rating}))}</div></div>
              <div className="form-group"><label>Your Review</label><textarea value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} placeholder="Share your experience..." rows="4" required /></div>
              <button type="submit" className="submit-review-btn">Submit Review</button>
            </form>
          )}

          <div className="filter-buttons">
            <button className={`filter-btn ${filterRating === 0 ? 'active' : ''}`} onClick={() => setFilterRating(0)}>All ({reviews.length})</button>
            {[5, 4, 3, 2, 1].map(rating => (
              getRatingCount(rating) > 0 && (<button key={rating} className={`filter-btn ${filterRating === rating ? 'active' : ''}`} onClick={() => setFilterRating(rating)}>{rating} ★ ({getRatingCount(rating)})</button>)
            ))}
          </div>

          <div className="reviews-list">
            {filteredReviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <span className="reviewer-name">{review.name}{review.verified && <span className="verified-badge">✓ Verified</span>}</span>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <div className="review-rating">{renderStars(review.rating)}</div>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>

          {filteredReviews.length === 0 && (<div className="no-reviews"><p>No reviews found for the selected rating.</p></div>)}
        </div>
      </section>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
            <div className="popup-icon">🛒</div>
            <p>T-Shirt Berhasil Ditambahkan ke Keranjang</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;