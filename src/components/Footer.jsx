import React from 'react';
import { 
  Facebook, Twitter, Instagram, Linkedin, Youtube,
  Mail, Phone, MapPin, Clock, CreditCard, Shield, HelpCircle 
} from 'lucide-react';

//test 123
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <h3 className="footer-heading">About Us</h3>
          <p className="footer-about">
            We're dedicated to providing high-quality products with exceptional customer service. 
            Our mission is to make shopping easy, enjoyable, and affordable for everyone.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><Facebook /></a>
            <a href="#" aria-label="Twitter"><Twitter /></a>
            <a href="#" aria-label="Instagram"><Instagram /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin /></a>
            <a href="#" aria-label="YouTube"><Youtube /></a>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Shop</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Customer Service</h3>
          <ul className="footer-links">
            <li><a href="#">My Account</a></li>
            <li><a href="#">Order Tracking</a></li>
            <li><a href="#">Wishlist</a></li>
            <li><a href="#">Returns & Exchanges</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Size Guide</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Contact Info</h3>
          <ul className="contact-info">
            <li>
              <MapPin className="contact-icon" />
              <span>123 Main Street, Cityville, ST 12345</span>
            </li>
            <li>
              <Phone className="contact-icon" />
              <span>(123) 456-7890</span>
            </li>
            <li>
              <Mail className="contact-icon" />
              <span>support@example.com</span>
            </li>
            <li>
              <Clock className="contact-icon" />
              <span>Mon-Fri: 9AM - 6PM</span>
            </li>
          </ul>
        </div>
      </div>    
    </footer>
  );
};

export default Footer;