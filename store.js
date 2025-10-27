const itemsPerPage = 10;
let currentPage = 1;
let allItems = [];
let activeCategory = "All";

async function loadStoreItems() {
  try {
    const response = await fetch("store.json");
    allItems = await response.json();
    displayItems();
    setupPagination();
  } catch (err) {
    console.error("Error loading store items:", err);
  }
}

function filterByCategory(items) {
  if (activeCategory === "All") return items;
  return items.filter((item) => item.category === activeCategory);
}

function displayItems(filtered = allItems) {
  const grid = document.getElementById("cardsGrid");
  grid.innerHTML = "";

  const filteredByCategory = filterByCategory(filtered);

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const itemsToShow = filteredByCategory.slice(start, end);

  itemsToShow.forEach((item) => {
    const row = document.createElement("div");
    row.classList.add("card-row");
    row.innerHTML = `
      <div class="col-name" data-label="Account Name">${item.name}</div>
      <div class="col-type" data-label="Type">${item.type}</div>
      <div class="col-amount" data-label="Status / Balance">${item.amount}</div>
      <div class="col-price" data-label="Price">$${item.price}</div>
      <div class="col-buy" data-label="Buy">
        <button class="buy-btn" data-price="${item.price}" data-name="${item.name}">
          Buy
        </button>
      </div>
    `;
    grid.appendChild(row);
  });

  document.querySelectorAll(".buy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const price = parseFloat(btn.dataset.price);
      const name = btn.dataset.name;
      let balance = parseFloat(localStorage.getItem("balance")) || 0;

      if (balance < price) {
        showModal(
          `You need to top up <b>$${(price - balance).toFixed(2)}</b> more to buy "<b>${name}</b>".`
        );
      } else {
        balance -= price;
        localStorage.setItem("balance", balance.toFixed(2));

        const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
        purchases.push({
          name,
          price,
          date: new Date().toLocaleDateString(),
        });
        localStorage.setItem("purchases", JSON.stringify(purchases));

        alert(`✅ Purchased "${name}" for $${price}!`);
      }
    });
  });
}

function setupPagination() {
  const filteredItems = filterByCategory(allItems);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      displayItems();
      setupPagination();
    });
    pagination.appendChild(btn);
  }
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  const search = e.target.value.toLowerCase();
  const filtered = allItems.filter((item) =>
    item.name.toLowerCase().includes(search)
  );
  currentPage = 1;
  displayItems(filtered);
  setupPagination();
});

document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".category-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    currentPage = 1;
    displayItems();
    setupPagination();
  });
});

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
  modal.querySelector("#modalText").innerHTML = message;
  modal.querySelector("#topupBtn").onclick = () => {
    window.location.href = "topup.html";
  };
  modal.classList.add("show");
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("show");
  });
}

window.onload = loadStoreItems;
