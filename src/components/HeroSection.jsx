import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Star, ArrowRight, Truck, Shield, Headphones, 
  Clock, RefreshCw, Gift, Award, Check, Percent, Tag 
} from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const heroSlides = [
    {
      id: 1,
      title: "Discover Amazing Products",
      subtitle: "Find everything you need in one place",
      description: "Shop from thousands of premium products with unbeatable prices and quality guarantee.",
      buttonText: "Shop Now",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      offer: "Up to 50% OFF",
      buttonLink: "/shop",
      learnMoreLink: "/about",
      bgPosition: "center center"
    },
    {
      id: 2,
      title: "Premium Fashion Collection",
      subtitle: "Style meets comfort",
      description: "Explore our curated collection of fashion items that blend style, comfort, and affordability.",
      buttonText: "Explore Fashion",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      offer: "New Arrivals",
      buttonLink: "/fashion",
      learnMoreLink: "/fashion-trends",
      bgPosition: "center 30%"
    },
    {
      id: 3,
      title: "Tech & Electronics Hub",
      subtitle: "Innovation at your fingertips",
      description: "Get the latest gadgets and electronics with cutting-edge technology and competitive prices.",
      buttonText: "Browse Tech",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80",
      offer: "Free Shipping",
      buttonLink: "/electronics",
      learnMoreLink: "/tech-guides",
      bgPosition: "center center"
    }
  ];

  useEffect(() => {
    if (isPaused) return; 
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="hero-section">
    
      <div 
        className="hero-carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
              backgroundPosition: slide.bgPosition
            }}
          >
            <div className="hero-content">
              <div className="hero-text">
                <div className="offer-badge">
                  <Star className="star-icon" />
                  {slide.offer}
                </div>
                <h1 className="hero-title">{slide.title}</h1>
                <h2 className="hero-subtitle">{slide.subtitle}</h2>
                <p className="hero-description">{slide.description}</p>
                <div className="hero-buttons">
                  <a href={slide.buttonLink} className="primary-btn">
                    <ShoppingBag className="btn-icon" />
                    {slide.buttonText}
                    <ArrowRight className="arrow-icon" />
                  </a>
                  <a href={slide.learnMoreLink} className="secondary-btn">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
        
       
        <button className="nav-arrow nav-left" onClick={prevSlide}>
          ⬅
        </button>
        <button className="nav-arrow nav-right" onClick={nextSlide}>
          ➡
        </button>
        
       
        <div className="slide-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="features-section">
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon">
              <Truck />
            </div>
            <div className="feature-text">
              <h3>Free Shipping</h3>
              <p>On orders over $50</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <Shield />
            </div>
            <div className="feature-text">
              <h3>Secure Payment</h3>
              <p>100% secure transactions</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <Headphones />
            </div>
            <div className="feature-text">
              <h3>24/7 Support</h3>
              <p>Always here to help</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <RefreshCw />
            </div>
            <div className="feature-text">
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Products</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </div>

 
      <div className="testimonials-section">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#FFD700" />)}
            </div>
            <p className="testimonial-text">
              "The quality of products exceeded my expectations. Fast shipping and excellent customer service!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <h4>Sarah Johnson</h4>
                <p>Verified Buyer</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#FFD700" />)}
            </div>
            <p className="testimonial-text">
              "I've been shopping here for years. Always find great deals on quality products."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <h4>Michael Chen</h4>
                <p>Loyal Customer</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#FFD700" />)}
              {[...Array(5 - 4)].map((_, i) => <Star key={i} size={16} />)}
            </div>
            <p className="testimonial-text">
              "Easy returns process and responsive support team. Will definitely shop again!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <h4>Emily Rodriguez</h4>
                <p>New Customer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-text">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get the latest updates, deals, and exclusive offers straight to your inbox.</p>
          </div>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Your email address" 
              required 
            />
            <button type="submit">
              Subscribe <ArrowRight size={18} />
            </button>
          </form>
          <div className="newsletter-benefits">
            <div className="benefit-item">
              <Check size={16} /> Exclusive deals
            </div>
            <div className="benefit-item">
              <Check size={16} /> Early access to sales
            </div>
            <div className="benefit-item">
              <Check size={16} /> Product recommendations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;