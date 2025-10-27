const itemsPerPage = 10;
let currentPage = 1;
let allSSNs = [];

// ===== LOAD SSNs =====
async function loadSSNs() {
  const response = await fetch("ssn.json");
  allSSNs = await response.json();
  displaySSNs();
  setupPagination();
}

// ===== DISPLAY SSNs =====
function displaySSNs(filtered = allSSNs) {
  const grid = document.getElementById("ssnGrid");
  grid.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const ssnsToShow = filtered.slice(start, end);

  const balance = parseFloat(localStorage.getItem("balance") || 0);

  ssnsToShow.forEach(item => {
    const row = document.createElement("div");
    row.classList.add("card-row");

    row.innerHTML = `
      <div class="col-bin" data-label="SSN BIN">${item.bin}</div>
      <div class="col-type" data-label="Type">${item.type}</div>
      <div class="col-amount" data-label="Details">${item.details}</div>
      <div class="col-gender" data-label="Gender">${item.gender}</div>
      <div class="col-price" data-label="Price">$${item.price}</div>
      <div class="col-buy" data-label="Buy">
        <button class="buy-btn">Buy</button>
      </div>
    `;

    const buyBtn = row.querySelector(".buy-btn");
    buyBtn.addEventListener("click", () => handlePurchase(item, balance));

    grid.appendChild(row);
  });
}

// ===== HANDLE PURCHASE =====
function handlePurchase(item, balance) {
  if (balance >= item.price) {
    const newBalance = balance - item.price;
    localStorage.setItem("balance", newBalance.toFixed(2));

    const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
    const order = {
      type: item.type,
      bin: item.bin,
      gender: item.gender,
      price: item.price,
      date: new Date().toLocaleDateString(),
      id: Math.random().toString(16).substr(2, 8),
      status: "Pending"
    };
    purchases.push(order);
    localStorage.setItem("purchases", JSON.stringify(purchases));

    alert(`✅ Purchase successful! $${item.price} deducted.`);
    window.location.href = "purchases.html";
  } else {
    const needed = item.price - balance;
    showModal(needed);
  }
}

// ===== PAGINATION =====
function setupPagination() {
  const totalPages = Math.ceil(allSSNs.length / itemsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      displaySSNs();
      setupPagination();
    });
    pagination.appendChild(btn);
  }
}

// ===== MODAL =====
function showModal(requiredAmount) {
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modalText");
  modalText.textContent = `You need to top up $${requiredAmount.toFixed(2)} more to buy this SSN.`;
  modal.classList.add("show");
  document.getElementById("topupBtn").onclick = () => {
    window.location.href = "topup.html";
  };
}

// ===== FILTER =====
document.getElementById("searchInput").addEventListener("input", filterSSNs);
document.getElementById("genderFilter").addEventListener("change", filterSSNs);

function filterSSNs() {
  const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();
  const selectedGender = document.getElementById("genderFilter").value;

  const filtered = allSSNs.filter(ssn => {
    const matchesBin = ssn.bin.toLowerCase().includes(searchValue);
    const matchesGender = selectedGender ? ssn.gender === selectedGender : true;
    return matchesBin && matchesGender;
  });

  currentPage = 1;
  displaySSNs(filtered);
  setupPagination();
}

// ===== ON LOAD =====
window.onload = loadSSNs;
