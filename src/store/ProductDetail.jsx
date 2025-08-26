import React from 'react';
import '../App.css';

const ProductDetail = ({ product, onBack }) => {
  if (!product) {
    return (
      <div className="product-detail-container">
        <h2>Product not found</h2>
        <button onClick={onBackToProducts} className="back-btn">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <button onClick={onBackToProducts} className="back-btn">
        Back to Products
      </button>
      
      <div className="product-detail-content">
        <div className="product-detail-image">
          <img src={product.image} alt={product.title} />
        </div>
        
        <div className="product-detail-info">
          <h1 className="product-title">{product.title}</h1>
          <div className="product-price">${product.price}</div>
          <div className="product-category">
            <span className="category-label">Category: </span>
            <span className="category-value">{product.category}</span>
          </div>
          
          <div className="product-rating">
            <span className="rating-label">Rating: </span>
            <span className="rating-value">
              {product.rating?.rate}/5 ({product.rating?.count} reviews)
            </span>
          </div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-actions">
            <button className="add-to-cart-btn">Add to Cart</button>
            <button className="buy-now-btn">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;