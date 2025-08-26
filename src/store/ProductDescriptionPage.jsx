import React from 'react';
import { ArrowLeft } from 'lucide-react';

const ProductDescriptionPage = ({ product, onBackToProducts }) => { 
  if (!product) {
    return (
      <div className="description-page">
        <h2>No product selected</h2>
        <button onClick={onBackToProducts} className="back-btn">
          <ArrowLeft size={20} />
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="description-page">

      <button onClick={onBackToProducts} className="back-btn">
        <ArrowLeft size={20} />
         Back to Product List
      </button>

      <div className="product-description-container">
        <div className="product-header">
          <div className="product-image-large">
            <img src={product.image} alt={product.title} />
          </div>
          
          <div className="product-basic-info">
            <h1 className="product-title-large">{product.title}</h1>
            <p className="product-price-large">${product.price}</p>
            <p className="product-category-large">
              Category: <span>{product.category}</span>
            </p>
            {product.rating && (
              <p className="product-rating">
                Rating: {product.rating.rate}/5 ({product.rating.count} reviews)
              </p>
            )}
          </div>
        </div>

        <div className="product-full-description">
          <h2>Product Description</h2>
          <div className="description-content">
            <p>{product.description}</p>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default ProductDescriptionPage;