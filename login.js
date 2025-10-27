const form = document.getElementById("authForm");
const toggleLink = document.getElementById("toggleLink");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submitBtn");
const rememberMe = document.getElementById("rememberMe");
let isLogin = true;

// Switch between Login and Signup
toggleLink.addEventListener("click", (e) => {
  e.preventDefault();
  isLogin = !isLogin;

  if (isLogin) {
    formTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    toggleLink.textContent = "Create one";
  } else {
    formTitle.textContent = "Create Account";
    submitBtn.textContent = "Sign Up";
    toggleLink.textContent = "Login here";
  }
});

// Auto-login if remembered
document.addEventListener("DOMContentLoaded", () => {
  const rememberedUser = localStorage.getItem("rememberedUser");
  if (rememberedUser) {
    window.location.href = "index.html";
  }
});

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Start loading animation
  submitBtn.classList.add("loading");
  submitBtn.textContent = "";

  setTimeout(() => {
    if (isLogin) {
      // Login Mode
      const savedUser = JSON.parse(localStorage.getItem(username));
      if (!savedUser) {
        showToast("User not found!");
      } else if (savedUser.password === password) {
        showToast("Login successful!");

        // Save user info for main page
        localStorage.setItem("currentUser", JSON.stringify({
          username,
          balance: savedUser.balance || 0.00
        }));

        if (rememberMe.checked) {
          localStorage.setItem("rememberedUser", username);
        }

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      } else {
        showToast("Incorrect password!");
      }

    } else {
      // Signup Mode
      if (localStorage.getItem(username)) {
        showToast("Username already exists!");
      } else {
        const newUser = { username, password, balance: 0.00 };
        localStorage.setItem(username, JSON.stringify(newUser));

        // Instantly log the new user in
        localStorage.setItem("currentUser", JSON.stringify({
          username,
          balance: 0.00
        }));
        localStorage.setItem("rememberedUser", username);

        showToast("Account created and logged in!");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      }
    }

    // Stop loading animation
    submitBtn.classList.remove("loading");
    submitBtn.textContent = isLogin ? "Login" : "Sign Up";
    form.reset();
  }, 1500);
});

// Toast message
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}
