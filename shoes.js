window.onload = () => {
  const grid = document.getElementById("shoesGrid");

  const shoes = [
    { model: "Nike Air Max", size: "42", email: "nike@teknova.com", price: 150 },
    { model: "Adidas Ultraboost", size: "43", email: "adidas@teknova.com", price: 180 },
    { model: "Puma RS-X", size: "41", email: "puma@teknova.com", price: 120 },
    { model: "Reebok Classic", size: "44", email: "reebok@teknova.com", price: 100 },
    { model: "Jordan 1 Retro", size: "42", email: "jordan@teknova.com", price: 250 },
    { model: "New Balance 990", size: "43", email: "nb@teknova.com", price: 160 },
    { model: "Asics Gel-Lyte", size: "41", email: "asics@teknova.com", price: 140 },
    { model: "Converse Chuck Taylor", size: "42", email: "converse@teknova.com", price: 90 },
    { model: "Vans Old Skool", size: "43", email: "vans@teknova.com", price: 85 },
    { model: "Under Armour HOVR", size: "44", email: "ua@teknova.com", price: 130 }
  ];

  shoes.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("shoe-card");

    card.innerHTML = `
      <div class="col-model">${item.model}</div>
      <div class="col-size">${item.size}</div>
      <div class="col-email">${item.email}</div>
      <div class="col-price">$${item.price}</div>
      <div class="col-buy"><button class="buy-btn">Buy</button></div>
    `;
    grid.appendChild(card);
  });

  const buyButtons = document.querySelectorAll(".buy-btn");
  buyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      alert("You need to top up your balance first! Redirecting to Top Up page.");
      window.location.href = "topup.html";
    });
  });
};
