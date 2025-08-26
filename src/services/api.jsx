const API_BASE_URL = 'http://localhost:4000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders(token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }

  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    return this.handleResponse(response);
  }

  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    return this.handleResponse(response);
  }

  async getProfile(token) {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      headers: this.getAuthHeaders(token)
    });
    
    return this.handleResponse(response);
  }


  async getDashboardStats(token) {
    const response = await fetch(`${this.baseURL}/admin/dashboard/stats`, {
      headers: this.getAuthHeaders(token)
    });
    
    return this.handleResponse(response);
  }

  async getAdminProducts(token, page = 1, limit = 10) {
    const response = await fetch(`${this.baseURL}/admin/products?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(token)
    });
    
    return this.handleResponse(response);
  }

  async addProduct(token, productData) {
    const response = await fetch(`${this.baseURL}/admin/products`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(productData)
    });
    
    return this.handleResponse(response);
  }

  async updateProduct(token, productId, productData) {
    const response = await fetch(`${this.baseURL}/admin/products/${productId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(productData)
    });
    
    return this.handleResponse(response);
  }

  async deleteProduct(token, productId) {
    const response = await fetch(`${this.baseURL}/admin/products/${productId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token)
    });
    
    return this.handleResponse(response);
  }

  async getAllUsers(token, page = 1, limit = 10) {
    const response = await fetch(`${this.baseURL}/admin/users?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(token)
    });
    
    return this.handleResponse(response);
  }

  async updateUserRole(token, userId, role) {
    const response = await fetch(`${this.baseURL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ role })
    });
    
    return this.handleResponse(response);
  }

  async deleteUser(token, userId) {
    const response = await fetch(`${this.baseURL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token)
    });
    
    return this.handleResponse(response);
  }

  async getProducts() {
    const response = await fetch(`${this.baseURL}/products`);
    console.log(response);
    
    return this.handleResponse(response);
  }

  async getProductById(productId) {
    const response = await fetch(`${this.baseURL}/products/${productId}`);
    return this.handleResponse(response);
  }
}

export default new ApiService();