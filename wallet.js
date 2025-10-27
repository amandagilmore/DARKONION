// ===== WALLET UTILITIES =====
function getBalance() {
  return parseFloat(localStorage.getItem("balance")) || 0;
}

function setBalance(amount) {
  localStorage.setItem("balance", amount.toFixed(2));
  return amount;
}

function updateBalanceDisplays() {
  const balance = getBalance().toFixed(2);
  document.querySelectorAll("#balanceDisplay").forEach(
    el => (el.textContent = `$${balance}`)
  );
}

// ===== TOAST / POPUP SYSTEM =====
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      ${type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(toast);

  // Show animation
  setTimeout(() => toast.classList.add("show"), 100);

  // Hide after 3s
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== HANDLE PURCHASE =====
function handlePurchase(itemName, price) {
  const balance = getBalance();

  if (balance >= price) {
    // ✅ Success
    const newBalance = balance - price;
    setBalance(newBalance);
    updateBalanceDisplays();

    const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
    purchases.push({
      item: itemName,
      price: price,
      date: new Date().toLocaleString(),
      status: "Pending",
      orderId: Math.random().toString(36).substring(2, 10)
    });
    localStorage.setItem("purchases", JSON.stringify(purchases));

    showToast(`You bought "${itemName}" for $${price.toFixed(2)}!`, "success");

    setTimeout(() => {
      window.location.href = "history.html";
    }, 2000);
    return;
  }

  // ❌ Insufficient funds
  const needed = (price - balance).toFixed(2);
  showToast(
    `You need $${needed} more to buy "${itemName}". Redirecting to Top-Up...`,
    "error"
  );

  setTimeout(() => {
    window.location.href = "topup.html";
  }, 2500);
}
