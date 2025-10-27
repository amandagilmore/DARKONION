window.onload = () => {
  const proxiesGrid = document.getElementById("proxiesGrid");
  const searchInput = document.getElementById("searchInput");

  const states = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
    "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
    "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
    "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
    "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
    "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
    "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
    "Wisconsin","Wyoming"
  ];

  const types = ["Residential", "Datacenter"];
  const durabilityLevels = ["Low", "Medium", "High"];
  const subscriptions = ["1 Month", "3 Months", "6 Months"];

  // Generate proxies
  const proxies = states.map(state => ({
    location: state,
    type: types[Math.floor(Math.random() * types.length)],
    durability: durabilityLevels[Math.floor(Math.random() * durabilityLevels.length)],
    subscription: subscriptions[Math.floor(Math.random() * subscriptions.length)],
    price: Math.floor(Math.random() * 40) + 10 // $10 - $50
  }));

  function displayProxies(list) {
    proxiesGrid.innerHTML = "";
    list.forEach(proxy => {
      const row = document.createElement("div");
      row.classList.add("proxy-card");

      row.innerHTML = `
        <div data-label="Location">${proxy.location}</div>
        <div data-label="Type">${proxy.type}</div>
        <div data-label="Durability">${proxy.durability}</div>
        <div data-label="Subscription">${proxy.subscription}</div>
        <div data-label="Price">$${proxy.price}</div>
        <div data-label="Buy"><button class="buy-btn">Buy</button></div>
      `;

      const buyBtn = row.querySelector(".buy-btn");

      buyBtn.addEventListener("click", () => {
        let balance = parseFloat(localStorage.getItem("balance") || 0);
        if (balance < proxy.price) {
          alert(`Insufficient balance! You need to deposit $${proxy.price} to purchase this proxy.`);
          window.location.href = "topup.html";
        } else {
          balance -= proxy.price;
          localStorage.setItem("balance", balance.toFixed(2));
          alert(`Purchase successful! $${proxy.price} has been deducted from your balance.`);
        }
      });

      proxiesGrid.appendChild(row);
    });
  }

  displayProxies(proxies);

  // Search
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const filtered = proxies.filter(p => p.location.toLowerCase().includes(term));
    displayProxies(filtered);
  });
};
