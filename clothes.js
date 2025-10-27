window.onload = () => {
  const grid = document.getElementById("clothesGrid");

  const clothes = [
    { model: "Nike Air Jacket", size: "M", email: "nike@teknova.com", price: 120 },
    { model: "Adidas Hoodie", size: "L", email: "adidas@teknova.com", price: 90 },
    { model: "Puma T-Shirt", size: "S", email: "puma@teknova.com", price: 50 },
    { model: "Levi's Jeans", size: "M", email: "levis@teknova.com", price: 80 },
    { model: "Gucci Sneakers", size: "42", email: "gucci@teknova.com", price: 250 },
    { model: "Under Armour Shorts", size: "L", email: "ua@teknova.com", price: 45 },
    { model: "Reebok Tracksuit", size: "XL", email: "reebok@teknova.com", price: 110 },
    { model: "Fila Cap", size: "One Size", email: "fila@teknova.com", price: 25 },
    { model: "Champion Hoodie", size: "M", email: "champion@teknova.com", price: 95 },
    { model: "North Face Jacket", size: "L", email: "northface@teknova.com", price: 150 }
  ];

  clothes.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("clothes-card");

    card.innerHTML = `
  <div class="col-model" data-label="Clothes Model: ">${item.model}</div>
  <div class="col-size" data-label="Size: ">${item.size}</div>
  <div class="col-email" data-label="Email: ">${item.email}</div>
  <div class="col-price" data-label="Price ($): ">$${item.price}</div>
  <div class="col-buy"><button class="buy-btn">Buy</button></div>
`;


    grid.appendChild(card);
  });

  // Redirect on Buy
  const buyButtons = document.querySelectorAll(".buy-btn");
  buyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      alert("You need to top up your balance first! Redirecting to Top Up page.");
      window.location.href = "topup.html";
    });
  });
};
document.addEventListener("DOMContentLoaded", () => {
  const shoes = [
    { name: "Nike Air Force 1", size: "42", price: "$120" },
    { name: "Adidas Ultraboost", size: "43", price: "$140" },
    { name: "Puma RS-X", size: "41", price: "$110" },
    { name: "Reebok Classic", size: "44", price: "$90" },
    { name: "New Balance 574", size: "42", price: "$100" },
    { name: "Vans Old Skool", size: "40", price: "$85" },
    { name: "Converse Chuck 70", size: "43", price: "$95" },
    { name: "Jordan Retro 4", size: "44", price: "$200" },
  ];

  const container = document.getElementById("shoes-list");
  container.innerHTML = `
    <div class="table-header">
      <span>Shoe Model</span>
      <span>Size</span>
      <span>Price</span>
      <span>Buy</span>
    </div>
  `;

  shoes.forEach((shoe) => {
    const row = document.createElement("div");
    row.classList.add("shoe-row");
    row.innerHTML = `
      <span>${shoe.name}</span>
      <span>${shoe.size}</span>
      <span>${shoe.price}</span>
      <button class="buy-btn">Buy</button>
    `;
    container.appendChild(row);
  });
});
