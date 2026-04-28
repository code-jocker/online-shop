const API_URL = 'http://localhost:5000/api';

const api = {
  getAllusers: async function () {
    return fetch(`${API_URL}/getAllUsers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(function (res) {
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    });
  },

  removeUser: async function (id) {
    return fetch(`${API_URL}/deleteUser/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(function (res) {
      if (!res.ok) throw new Error("Failed to delete user");
      return res.json();
    });
  },

  getAllProducts: async function () {
    return fetch(`${API_URL}/getAllProducts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(function (res) {
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    });
  },

  createProduct: async function (productData) {
    return fetch(`${API_URL}/createProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(productData),
    }).then(function (res) {
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    });
  },

  createOrder: async function (orderData) {
    return fetch(`${API_URL}/createOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(orderData),
    }).then(function (res) {
      if (!res.ok) throw new Error("Failed to create order");
      return res.json();
    });
  },

  getAllOrders: async function () {
    return fetch(`${API_URL}/getAllOrders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(function (res) {
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    });
  },

  getAllShops: async function () {
    return fetch(`${API_URL}/getAllShops`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(function (res) {
      if (!res.ok) throw new Error("Failed to fetch shops");
      return res.json();
    });
  },

  createShop: async function (shopData) {
    return fetch(`${API_URL}/createShop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(shopData),
    }).then(function (res) {
      if (!res.ok) throw new Error("Failed to create shop");
      return res.json();
    });
  },

  getNotifications: async function () {
    return fetch(`${API_URL}/notifications/all`, {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(function (res) {
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    });
  },

  markNotificationRead: async function (id) {
    return fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(function (res) {
      if (!res.ok) throw new Error("Failed to mark notification");
      return res.json();
    });
  },

  updateOrderStatus: async function (id, status) {
    return fetch(`${API_URL}/updateOrder/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    }).then(function (res) {
      if (!res.ok) throw new Error("Failed to update order");
      return res.json();
    });
  }
};