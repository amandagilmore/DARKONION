window.onload = () => {
  const grid = document.getElementById("bankGrid");

  const banks = [
    { bank: "Bank of America", type: "Checking", amountInside: "$1,000", price: 1000 },
    { bank: "Chase Bank", type: "Savings", amountInside: "$2,500", price: 2500 },
    { bank: "Wells Fargo", type: "Checking", amountInside: "$1,500", price: 1500 },
    { bank: "Citibank", type: "Savings", amountInside: "$2,000", price: 2000 },
    { bank: "HSBC", type: "Checking", amountInside: "$1,800", price: 1800 },
    { bank: "Capital One", type: "Savings", amountInside: "$2,200", price: 2200 },
    { bank: "PNC Bank", type: "Checking", amountInside: "$1,200", price: 1200 },
    { bank: "TD Bank", type: "Savings", amountInside: "$2,700", price: 2700 },
    { bank: "US Bank", type: "Checking", amountInside: "$1,600", price: 1600 },
    { bank: "Santander", type: "Savings", amountInside: "$1,900", price: 1900 }
  ];

  banks.forEach(item => {
    const row = document.createElement("div");
    row.classList.add("bank-row");

    row.innerHTML = `
      <div class="col-bank">${item.bank}</div>
      <div class="col-type">${item.type}</div>
      <div class="col-amount">${item.amountInside}</div>
      <div class="col-price">$${item.price}</div>
      <div class="col-buy"><button class="buy-btn">Buy</button></div>
    `;
    grid.appendChild(row);
  });

  const buyButtons = document.querySelectorAll(".buy-btn");
  buyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      alert("You need to top up your balance first! Redirecting to Top Up page.");
      window.location.href = "topup.html";
    });
  });
};
