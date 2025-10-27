window.onload = () => {
  const phonesGrid = document.getElementById("phonesGrid");

  const phones = [
    { model: "iPhone 14 Pro", amountInside: "$500", email: "iphone14@teknova.com", price: 999 },
    { model: "Samsung Galaxy S23", amountInside: "$400", email: "samsung23@teknova.com", price: 899 },
    { model: "Google Pixel 7", amountInside: "$300", email: "pixel7@teknova.com", price: 799 },
    { model: "OnePlus 11", amountInside: "$350", email: "oneplus11@teknova.com", price: 699 },
    { model: "Xiaomi 13", amountInside: "$200", email: "xiaomi13@teknova.com", price: 599 },
    { model: "Sony Xperia 1", amountInside: "$250", email: "xperia1@teknova.com", price: 649 },
    { model: "Huawei P50", amountInside: "$300", email: "huaweip50@teknova.com", price: 729 },
    { model: "Motorola Edge 40", amountInside: "$180", email: "edge40@teknova.com", price: 499 },
    { model: "Nokia X30", amountInside: "$150", email: "nokiax30@teknova.com", price: 399 },
    { model: "Asus ROG Phone 7", amountInside: "$400", email: "rog7@teknova.com", price: 1099 }
  ];

  phones.forEach(phone => {
    const card = document.createElement("div");
    card.classList.add("phone-card");

    card.innerHTML = `
      <div class="col-model">${phone.model}</div>
      <div class="col-amount">${phone.amountInside}</div>
      <div class="col-email">${phone.email}</div>
      <div class="col-price">$${phone.price}</div>
      <div class="col-buy"><button class="buy-btn">Buy</button></div>
    `;

    phonesGrid.appendChild(card);
  });

  // Make Buy buttons redirect to Top Up page
  const buyButtons = document.querySelectorAll(".buy-btn");
  buyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      alert("You need to top up your balance first! Redirecting to Top Up page.");
      window.location.href = "topup.html"; // redirect
    });
  });
};
