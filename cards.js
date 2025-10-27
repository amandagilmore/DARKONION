const itemsPerPage = 10;
let currentPage = 1;
let allCards = [];

// ===== Load Cards from JSON =====
async function loadCards() {
  try {
    const response = await fetch("cards.json");
    allCards = await response.json();
    displayCards();
    setupPagination();
  } catch (err) {
    console.error("Error loading cards:", err);
  }
}

// ===== Display Cards =====
function displayCards(filtered = allCards) {
  const grid = document.getElementById("cardsGrid");
  grid.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const cardsToShow = filtered.slice(start, end);

  cardsToShow.forEach(item => {
    const row = document.createElement("div");
    row.classList.add("card-row");

    row.innerHTML = `
      <div class="col-bin" data-label="Card BIN">${item.bin}</div>
      <div class="col-type" data-label="Card Type">${item.type}</div>
      <div class="col-amount" data-label="Amount Inside Card">
        ${item.amount}<br><span style="color:#22c55e;font-size:0.9em;">Fresh ✅</span>
      </div>
      <div class="col-price" data-label="Price">$${item.price}</div>
      <div class="col-buy" data-label="Buy">
        <button class="buy-btn"
          data-price="${item.price}"
          data-bin="${item.bin}"
          data-type="${item.type}"
          data-amount="${item.amount}">
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
      const bin = btn.dataset.bin;
      const type = btn.dataset.type;
      const amount = btn.dataset.amount;

      let balance = parseFloat(localStorage.getItem("balance")) || 0;

      if (balance < price) {
        const needed = (price - balance).toFixed(2);
        showModal(`You need to top up <b>$${needed}</b> more to buy this card.`);
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
          bin: bin,
          type: type,
          amount: amount,
          price: price,
          date: date,
          status: "Pending"
        });
        localStorage.setItem("purchases", JSON.stringify(purchases));

        alert(`✅ Purchase successful! You bought ${type} for $${price}.`);
        window.location.href = "purchases.html";
      }
    });
  });
}

// ===== Pagination =====
function setupPagination() {
  const totalPages = Math.ceil(allCards.length / itemsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      displayCards();
      setupPagination();
    });
    pagination.appendChild(btn);
  }
}

// ===== Search =====
document.getElementById("searchInput").addEventListener("input", (e) => {
  const searchValue = e.target.value.trim();
  const filtered = allCards.filter(card => card.bin.includes(searchValue));
  currentPage = 1;
  displayCards(filtered);
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
window.onload = loadCards;
