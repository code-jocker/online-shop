var AUTH_URL = "http://localhost:5000/api/login";
var USER_URL = "http://localhost:5000/api/register";

function saveToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

function decodeToken(token) {
  try {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function getUser() {
  var u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

function getUserType() {
  var user = getUser();
  return user ? user.type : null;
}

function requireRole() {
  var roles = Array.prototype.slice.call(arguments);
  var userType = getUserType();
  if (!userType || !roles.includes(userType)) {
    window.location.href = getIndexPath();
  }
}

function getCustomerPath() {
  var depth = window.location.pathname.includes("/pages/") ? "" : "pages/";
  return depth + "customer.html";
}

function getSellerPath() {
  var depth = window.location.pathname.includes("/pages/") ? "" : "pages/";
  return depth + "seller.html";
}

function getAdminPath() {
  var depth = window.location.pathname.includes("/pages/") ? "" : "pages/";
  return depth + "dashboard.html";
}

function redirectByRole() {
  var type = getUserType();
  if (type === "customer") {
    window.location.href = getCustomerPath();
  } else if (type === "seller") {
    window.location.href = getSellerPath();
  } else {
    window.location.href = getAdminPath();
  }
}

function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function requireGuest() {
  if (getToken()) {
    redirectByRole();
  }
}

function getLoginPath() {
  var depth = window.location.pathname.includes("/pages/") ? "../" : "";
  return depth + "pages/login.html";
}

function getIndexPath() {
  var depth = window.location.pathname.includes("/pages/") ? "../" : "";
  return depth + "index.html";
}

function requireLogin() {
  if (!getToken()) {
    window.location.href = getLoginPath();
  }
}

function login() {
  var email = document.getElementById("email").value.trim();
  var password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showFormError("login-error", "Please enter email and password.");
    return;
  }

  var btn = document.getElementById("btn-login");
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Logging in...';
  hideFormError("login-error");

  fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          throw new Error(data.message || "Invalid credentials");
        }
        return data;
      });
    })
    .then(function (data) {
      saveToken(data.token);
      var payload = decodeToken(data.token);
      saveUser({
        email: email,
        username: email.split("@")[0],
        type: payload && payload.type ? payload.type : "customer"
      });
      redirectByRole();
    })
    .catch(function (err) {
      showFormError("login-error", err.message || "Invalid credentials. Please try again.");
      btn.disabled = false;
      btn.textContent = "Log In";
    });
}

function register() {
  var fullName = document.getElementById("reg-name").value.trim();
  var email = document.getElementById("reg-email").value.trim();
  var password = document.getElementById("reg-password").value.trim();
  var phoneNumber = document.getElementById("reg-phone").value.trim();
  var location = document.getElementById("reg-location").value.trim();
  var gender = document.getElementById("reg-gender").value;
  var age = parseInt(document.getElementById("reg-age").value, 10);
  var date_of_birth = document.getElementById("reg-dob").value;
  var type = document.getElementById("reg-type").value;

  if (!fullName || !email || !password || !phoneNumber || !location || !gender || !age || !date_of_birth) {
    showFormError("reg-error", "All fields are required.");
    return;
  }

  if (password.length < 4) {
    showFormError("reg-error", "Password must be at least 4 characters.");
    return;
  }

  var btn = document.getElementById("btn-register");
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Creating account...';
  hideFormError("reg-error");

  fetch(USER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName, email, password, phoneNumber, location, gender, age, date_of_birth, type,
    }),
  })
    .then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          throw new Error(data.message || "Registration failed");
        }
        return data;
      });
    })
    .then(function () {
      window.location.href = "login.html?registered=1";
    })
    .catch(function (err) {
      showFormError("reg-error", err.message || "Registration failed. Please try again.");
      btn.disabled = false;
      btn.textContent = "Create Account";
    });
}

function logout() {
  clearAuth();
  window.location.href = getLoginPath();
}

function updateNavbar() {
  var user = getUser();
  var userArea = document.getElementById("nav-user-area");
  if (!userArea) return;

  if (user && getToken()) {
    userArea.innerHTML =
      '<span style="color:rgba(255,255,255,0.5);font-size:0.82rem;margin-right:6px;">Hi, <strong style="color:#68d391;">' +
      user.email +
      "</strong></span>" +
      '<button class="btn btn-sm" style="background:rgba(255,255,255,0.1);color:#fff;border:none;" onclick="logout()">Log Out</button>';
  } else {
    userArea.innerHTML =
      '<a href="' + getLoginPath() + '" class="btn btn-sm btn-blue">Log In</a>';
  }
}

function showFormError(id, msg) {
  var el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.style.display = "block";
  }
}

function hideFormError(id) {
  var el = document.getElementById(id);
  if (el) {
    el.style.display = "none";
  }
}