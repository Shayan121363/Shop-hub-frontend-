import React from 'react';

const ProductCard = ({ product, onProductSelect }) => { 
  
  const handleCardClick = () => {
    onProductSelect(product); 
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">${product.price}</p>
        <p className="product-category">{product.category}</p>
        <p className="product-description-preview">
          {product.description.length > 80 
            ? `${product.description.substring(0, 80)}...` 
            : product.description
          }
        </p>
        <button className="view-description-btn">
          View Full Description
        </button>
      </div>
    </div>
  );
};

export default ProductCard;