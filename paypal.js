const itemsPerPage = 10;
let currentPage = 1;
let allProducts = [];

// ===== Load products from JSON =====
async function loadProducts() {
  try {
    const response = await fetch("paypal.json");
    allProducts = await response.json();
    displayProducts();
    setupPagination();
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// ===== Display products =====
function displayProducts(filtered = allProducts) {
  const grid = document.getElementById("cardsGrid");
  grid.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const itemsToShow = filtered.slice(start, end);

  itemsToShow.forEach(item => {
    const row = document.createElement("div");
    row.classList.add("card-row");

    row.innerHTML = `
      <div class="col-id" data-label="Product ID">${item.id}</div>
      <div class="col-title" data-label="Title">${item.title}</div>
      <div class="col-format" data-label="Format">${item.format}</div>
      <div class="col-price" data-label="Price">$${item.price}</div>
      <div class="col-buy" data-label="Buy">
        <button class="buy-btn"
          data-price="${item.price}"
          data-id="${item.id}"
          data-title="${item.title}"
          data-format="${item.format}">
          Buy
        </button>
      </div>
    `;
    grid.appendChild(row);
  });

  // Attach Buy Button Logic
  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const price = parseFloat(btn.dataset.price);
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const format = btn.dataset.format;

      let balance = parseFloat(localStorage.getItem("balance")) || 0;

      if (balance < price) {
        const needed = (price - balance).toFixed(2);
        showModal(`You need to top up <b>$${needed}</b> more to buy "<b>${title}</b>".`);
      } else {
        // Deduct balance
        balance -= price;
        localStorage.setItem("balance", balance.toFixed(2));

        // Save purchase record
        const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
        const orderId = Math.random().toString(36).substring(2, 10);
        const date = new Date().toLocaleDateString();

        purchases.push({
          id: orderId,
          productId: id,
          title: title,
          format: format,
          price: price,
          date: date,
          status: "Delivered"
        });
        localStorage.setItem("purchases", JSON.stringify(purchases));

        alert(`✅ Purchase successful! You bought "${title}" for $${price}.`);
        window.location.href = "purchases.html";
      }
    });
  });
}

// ===== Pagination =====
function setupPagination() {
  const totalPages = Math.ceil(allProducts.length / itemsPerPage) || 1;
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      displayProducts();
      setupPagination();
    });
    pagination.appendChild(btn);
  }
}

// ===== Search =====
document.getElementById("searchInput").addEventListener("input", (e) => {
  const searchValue = e.target.value.trim().toLowerCase();
  const filtered = allProducts.filter(p =>
    p.id.toLowerCase().includes(searchValue) ||
    p.title.toLowerCase().includes(searchValue)
  );
  currentPage = 1;
  displayProducts(filtered);
  setupPagination();
});

// ===== Modal (for Top Up Notice) =====
function showModal(message) {
  let modal = document.querySelector(".glass-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "glass-modal";
    modal.innerHTML = `
      <div class="glass-box">
        <h3>💳 Top Up Required</h3>
        <p id="modalText"></p>
        <button id="topupBtn">Top Up Now</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modalText = modal.querySelector("#modalText");
  modalText.innerHTML = message;

  const topupBtn = modal.querySelector("#topupBtn");
  topupBtn.onclick = () => {
    window.location.href = "topup.html";
  };

  modal.classList.add("show");
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("show");
  });
}

// ===== Initialize =====
window.onload = loadProducts;
