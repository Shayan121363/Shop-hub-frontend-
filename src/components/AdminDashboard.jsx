import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, TrendingUp, Plus, Edit, Trash2, Eye, BarChart3, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = ({ user, token }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const API_BASE_URL = 'http://localhost:4000/api';

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        throw new Error('Failed to fetch stats');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch products' });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Product deleted successfully' });
        fetchProducts();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'User role updated successfully' });
        fetchUsers();
      } else {
        throw new Error('Failed to update user role');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__content">
        <div className="stat-card__text">
          <p className="stat-card__title">{title}</p>
          <p className="stat-card__value">{value}</p>
          {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
        </div>
        <Icon className="stat-card__icon" />
      </div>
    </div>
  );

  const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      productId: product?.productId || '',
      name: product?.name || '',
      title: product?.title || '',
      desc: product?.desc || '',
      price: product?.price || '',
      category: product?.category || '',
      image: product?.image || '',
      stock: product?.stock || 0
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const url = product 
          ? `${API_BASE_URL}/admin/products/${product._id}` 
          : `${API_BASE_URL}/admin/products`;
        const method = product ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const result = await response.json();
          setMessage({ 
            type: 'success', 
            text: product ? 'Product updated successfully' : 'Product added successfully' 
          });
          onSave();
          fetchProducts();
        } else {
          const error = await response.json();
          throw new Error(error.message);
        }
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
    };

    return (
      <div className="product-form">
        <h3 className="product-form__title">
          {product ? 'Edit Product' : 'Add New Product'}
        </h3>
        <div className="product-form__form">
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Product ID</label>
              <input
                type="text"
                value={formData.productId}
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                className="form-input"
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="form-input"
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="form-input"
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="form-input"
                placeholder="e.g., electronics, clothing"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="form-input"
                min="0"
              />
            </div>
          </div>
          <div className="form-field form-field--full">
            <label className="form-label">Description</label>
            <textarea
              value={formData.desc}
              onChange={(e) => setFormData({...formData, desc: e.target.value})}
              className="form-textarea"
              rows="3"
              required
            />
          </div>
          <div className="form-field form-field--full">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="form-actions">
            <button onClick={handleSubmit} className="btn btn--primary">
              {product ? 'Update Product' : 'Add Product'}
            </button>
            <button onClick={onCancel} className="btn btn--secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="access-denied">
        <div className="access-denied__content">
          <AlertCircle className="access-denied__icon" />
          <h2 className="access-denied__title">Access Denied</h2>
          <p className="access-denied__text">You need admin privileges to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="header">
        <div className="header__container">
          <div className="header__content">
            <h1 className="header__title">Admin Dashboard</h1>
            <div className="header__user">
              <span className="header__welcome">Welcome, {user?.name}</span>
              <div className="header__avatar">
                <UserCheck className="header__avatar-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <div className="nav-tabs__container">
          <nav className="nav-tabs__nav">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'users', label: 'Users', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`nav-tab ${activeTab === id ? 'nav-tab--active' : ''}`}
              >
                <Icon className="nav-tab__icon" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className="message-container">
          <div className={`message message--${message.type}`}>
            <div className="message__content">
              {message.type === 'error' ? (
                <AlertCircle className="message__icon" />
              ) : (
                <CheckCircle className="message__icon" />
              )}
              {message.text}
              <button
                onClick={() => setMessage({ type: '', text: '' })}
                className="message__close"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="main-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {loading ? (
              <div className="loading">Loading statistics...</div>
            ) : stats ? (
              <div className="dashboard-stats">
                <div className="stats-grid">
                  <StatCard
                    icon={Users}
                    title="Total Users"
                    value={stats.users.total}
                    subtitle={`${stats.users.recent} new this week`}
                    color="blue"
                  />
                  <StatCard
                    icon={Package}
                    title="Total Products"
                    value={stats.products.total}
                    subtitle={`${stats.products.active} active`}
                    color="green"
                  />
                  <StatCard
                    icon={UserCheck}
                    title="Admins"
                    value={stats.users.admins}
                    color="purple"
                  />
                  <StatCard
                    icon={TrendingUp}
                    title="Recent Products"
                    value={stats.products.recent}
                    subtitle="Added this week"
                    color="yellow"
                  />
                </div>
              </div>
            ) : (
              <div className="no-data">No statistics available</div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h2 className="section-title">Product Management</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="btn btn--primary btn--with-icon"
              >
                <Plus className="btn__icon" />
                <span>Add Product</span>
              </button>
            </div>

            {showAddProduct && (
              <ProductForm
                onSave={() => setShowAddProduct(false)}
                onCancel={() => setShowAddProduct(false)}
              />
            )}

            {editingProduct && (
              <ProductForm
                product={editingProduct}
                onSave={() => setEditingProduct(null)}
                onCancel={() => setEditingProduct(null)}
              />
            )}

            <div className="data-table">
              <div className="data-table__header">
                <h3 className="data-table__title">All Products</h3>
              </div>
              <div className="data-table__wrapper">
                <table className="table">
                  <thead className="table__head">
                    <tr>
                      <th className="table__header">Product</th>
                      <th className="table__header">Price</th>
                      <th className="table__header">Category</th>
                      <th className="table__header">Stock</th>
                      <th className="table__header">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table__body">
                    {products.map((product) => (
                      <tr key={product._id} className="table__row">
                        <td className="table__cell">
                          <div className="product-info">
                            <img
                              src={product.image || 'https://via.placeholder.com/50'}
                              alt={product.name}
                              className="product-info__image"
                            />
                            <div className="product-info__text">
                              <div className="product-info__name">
                                {product.name}
                              </div>
                              <div className="product-info__id">
                                ID: {product.productId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="table__cell">${product.price}</td>
                        <td className="table__cell">{product.category}</td>
                        <td className="table__cell">{product.stock || 0}</td>
                        <td className="table__cell">
                          <div className="table__actions">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="action-btn action-btn--edit"
                            >
                              <Edit className="action-btn__icon" />
                            </button>
                            <button
                              onClick={() => deleteProduct(product._id)}
                              className="action-btn action-btn--delete"
                            >
                              <Trash2 className="action-btn__icon" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="users-section">
            <h2 className="section-title">User Management</h2>
            <div className="data-table">
              <div className="data-table__header">
                <h3 className="data-table__title">All Users</h3>
              </div>
              <div className="data-table__wrapper">
                <table className="table">
                  <thead className="table__head">
                    <tr>
                      <th className="table__header">User</th>
                      <th className="table__header">Email</th>
                      <th className="table__header">Role</th>
                      <th className="table__header">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table__body">
                    {users.map((userData) => (
                      <tr key={userData._id} className="table__row">
                        <td className="table__cell">
                          <div className="user-name">{userData.name}</div>
                        </td>
                        <td className="table__cell">{userData.email}</td>
                        <td className="table__cell">
                          <span className={`role-badge role-badge--${userData.role}`}>
                            {userData.role}
                          </span>
                        </td>
                        <td className="table__cell">
                          <select
                            value={userData.role}
                            onChange={(e) => updateUserRole(userData._id, e.target.value)}
                            className="role-select"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;