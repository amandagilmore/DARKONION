window.onload = () => {
  const container = document.getElementById("purchasesList");
  const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");

  if (purchases.length === 0) {
    container.innerHTML = `<p style="color:#ccc;">No purchases yet.</p>`;
    return;
  }

  purchases.reverse().forEach(order => {
    const card = document.createElement("div");
    card.classList.add("purchase-card");

    card.innerHTML = `
      <h3>${order.type}</h3>
      <p><strong>Card BIN:</strong> ${order.bin}</p>
      <p><strong>Amount Inside:</strong> ${order.amount}</p>
      <p><strong>Price:</strong> $${order.price}</p>
      <p><strong>Order #:</strong> ${order.id}</p>
      <p><strong>Date:</strong> ${order.date}</p>
      <p><strong>Status:</strong> <span class="status-pending">⏳ ${order.status}</span></p>
      <p style="margin-top:8px;color:#93c5fd;">Your order is being reviewed. You'll be notified once approved.</p>
    `;
    container.appendChild(card);
  });
};
