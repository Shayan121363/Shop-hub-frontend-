import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, selectCartItems } from '../auth/cartslice'
import { selectIsAuthenticated } from '../auth/authSlice';
import { ShoppingCart } from 'lucide-react';
import '../App.css';

const Product = ({ onProductSelect, onLoginRedirect }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please login to view your cart');
      if (onLoginRedirect) {
        onLoginRedirect(); 
      }
      return;
    }

    dispatch(addItem({ product, quantity: 1 }));
  };

  const isInCart = (id) => cartItems.some((item) => item.id === id);
  const getQuantity = (id) => cartItems.find((item) => item.id === id)?.quantity || 0;

  
  useEffect(() => {
    setLoading(true);

    axios.get('https://fakestoreapi.com/products',{
      headers: {
        'Authorization':`Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => {
        setData(res.data);
        setFilteredData(res.data);
        const uniqueCategories = [...new Set(res.data.map(product => product.category))];
        setCategories(uniqueCategories);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const normalizeSearchTerm = (term) => {
    const normalizedTerm = term.toLowerCase().trim();
    const spellingVariations = {
      'jewelry': 'jewelery',
      'jewelary': 'jewelery',
      'jewellery': 'jewelery',
      'electronic': 'electronics',
      'electronics': 'electronic',
      'clothes': 'clothing',
      'clothing': 'clothes',
    };
    return spellingVariations[normalizedTerm] || normalizedTerm;
  };

  const searchInText = (searchTerm, text) => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const normalizedText = text.toLowerCase();

    if (normalizedText.includes(normalizedSearch)) {
      return true;
    }

    const alternativeSearch = normalizeSearchTerm(normalizedSearch);
    if (normalizedText.includes(alternativeSearch)) {
      return true;
    }

    const searchWords = normalizedSearch.split(' ').filter(word => word.length > 2);
    return searchWords.some(word => {
      const alternativeWord = normalizeSearchTerm(word);
      return normalizedText.includes(word) || normalizedText.includes(alternativeWord);
    });
  };


  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        searchInText(searchTerm, product.title) ||
        searchInText(searchTerm, product.description) ||
        searchInText(searchTerm, product.category)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedCategory, data]);

  const handleProductClick = (product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  return (
    <div className="products-page">

      <div className="search-filter-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="products-container">
        {loading && (
          <div className="loading-container">
            <h1>Loading...</h1>
          </div>
        )}

        {!loading && filteredData.length === 0 && (
          <div className="no-products">
            <h2>No products found</h2>
            <p>Try adjusting your search terms or category filter.</p>
          </div>
        )}

        {filteredData.map((product) => {
          const inCart = isInCart(product.id);
          const quantity = getQuantity(product.id);

          return (
            <div
              key={product.id}
              className={`card ${inCart ? 'in-cart' : ''}`}
              onClick={() => handleProductClick(product)}
            >
              <div className="card-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="card-description">
                <h6>{product.title}</h6>
                <h6>{`Price: $${product.price}`}</h6>
                <h6>{`Category: ${product.category}`}</h6>
                <p className="product-description-preview">
                  {product.description.length > 100
                    ? `${product.description.substring(0, 100)}...`
                    : product.description
                  }
                </p>
                <div className="card-actions">
                  <button
                    className={`add-to-cart-btn ${inCart ? 'in-cart' : ''}`}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingCart className="cart-icon" />
                    {inCart ? `In Cart (${quantity})` : 'Add to Cart'}
                  </button>
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Product;