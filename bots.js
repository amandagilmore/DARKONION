window.onload = () => {
  const botsGrid = document.getElementById("botsGrid");

  const bots = [
    { name: "OTP Bot", desc: "Automates OTP retrieval", price: 50 },
    { name: "Address Bot", desc: "Generates and validates addresses", price: 40 },
    { name: "SSN Bot", desc: "Generates Social Security Numbers", price: 60 },
    { name: "Credit Card Bot", desc: "Provides card numbers for testing", price: 70 },
    { name: "Email Bot", desc: "Automates email creation and management", price: 35 },
    { name: "Proxy Scraper Bot", desc: "Scrapes working proxies automatically", price: 45 },
    { name: "Instagram Bot", desc: "Automates Instagram actions", price: 80 }
  ];

  bots.forEach(bot => {
    const card = document.createElement("div");
    card.classList.add("bot-card");

    card.innerHTML = `
      <div class="col-name">${bot.name}</div>
      <div class="col-desc">${bot.desc}</div>
      <div class="col-price">$${bot.price}</div>
      <div class="col-install"><button class="install-btn">Install</button></div>
    `;

    botsGrid.appendChild(card);
  });

  // Install button logic
  document.querySelectorAll(".install-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const bot = bots[index];
      alert(`To install ${bot.name}, you need to top up your account first!`);
      window.location.href = "topup.html"; // redirect to topup page
    });
  });
};
