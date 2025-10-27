const itemsPerPage = 10;
let currentPage = 1;
let allBots = [];

async function loadBots() {
  try {
    const response = await fetch("otpbot.json");
    allBots = await response.json();
    displayBots();
    setupPagination();
  } catch(err) {
    console.error("Error loading bots:", err);
  }
}

function displayBots(filtered = allBots) {
  const grid = document.getElementById("cardsGrid");
  grid.innerHTML = "";

  const start = (currentPage -1)*itemsPerPage;
  const end = start + itemsPerPage;
  const itemsToShow = filtered.slice(start, end);

  itemsToShow.forEach(item => {
    const row = document.createElement("div");
    row.classList.add("card-row");
    row.innerHTML = `
      <div class="col-name" data-label="Bot Name">${item.name}</div>
      <div class="col-desc" data-label="Description">${item.description}</div>
      <div class="col-price" data-label="Price">$${item.price}</div>
      <div class="col-install" data-label="Install">
        <button class="buy-btn"
          data-price="${item.price}"
          data-name="${item.name}">
          Install
        </button>
      </div>
    `;
    grid.appendChild(row);
  });

  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const price = parseFloat(btn.dataset.price);
      const name = btn.dataset.name;
      let balance = parseFloat(localStorage.getItem("balance")) || 0;

      if(balance < price){
        showModal(`You need to top up <b>$${(price-balance).toFixed(2)}</b> more to install "<b>${name}</b>".`);
      } else {
        balance -= price;
        localStorage.setItem("balance", balance.toFixed(2));
        const purchases = JSON.parse(localStorage.getItem("purchases")||"[]");
        purchases.push({name:name,price:price,date:new Date().toLocaleDateString()});
        localStorage.setItem("purchases",JSON.stringify(purchases));
        alert(`✅ Installed "${name}" for $${price}!`);
      }
    });
  });
}

function setupPagination() {
  const totalPages = Math.ceil(allBots.length/itemsPerPage)||1;
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  for(let i=1;i<=totalPages;i++){
    const btn = document.createElement("button");
    btn.textContent = i;
    if(i===currentPage) btn.classList.add("active");
    btn.addEventListener("click", ()=>{
      currentPage=i;
      displayBots();
      setupPagination();
    });
    pagination.appendChild(btn);
  }
}

document.getElementById("searchInput").addEventListener("input",(e)=>{
  const search = e.target.value.toLowerCase();
  const filtered = allBots.filter(b=>b.name.toLowerCase().includes(search));
  currentPage=1;
  displayBots(filtered);
  setupPagination();
});

function showModal(message){
  let modal = document.querySelector(".glass-modal");
  if(!modal){
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
  modal.querySelector("#topupBtn").onclick = ()=>{window.location.href="topup.html";}
  modal.classList.add("show");
  modal.addEventListener("click", (e)=>{if(e.target===modal) modal.classList.remove("show");});
}

window.onload = loadBots;
