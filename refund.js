document.addEventListener("DOMContentLoaded", () => {
  const balanceDisplay = document.getElementById("walletBalance");
  const refundBtn = document.getElementById("refundBtn");
  const refundAmount = document.getElementById("refundAmount");
  const walletAddress = document.getElementById("walletAddress");
  const networkType = document.getElementById("networkType");
  const message = document.getElementById("refundMessage");
  const refundHistoryList = document.getElementById("refundHistoryList");

  let balance = parseFloat(localStorage.getItem("balance")) || 0;
  balanceDisplay.textContent = balance.toFixed(2);

  refundBtn.addEventListener("click", () => {
    const amount = parseFloat(refundAmount.value);
    const address = walletAddress.value.trim();
    const network = networkType.value;

    if (!amount || amount <= 0) {
      showMessage("Please enter a valid refund amount.", "error");
      return;
    }

    if (amount > balance) {
      showMessage("Insufficient wallet balance for refund.", "error");
      return;
    }

    if (!address) {
      showMessage("Please enter your wallet address.", "error");
      return;
    }

    if (!network) {
      showMessage("Please select a network type.", "error");
      return;
    }

    balance -= amount;
    localStorage.setItem("balance", balance.toFixed(2));
    balanceDisplay.textContent = balance.toFixed(2);

    showMessage(`✅ Your refund of $${amount.toFixed(2)} via ${network} is processing. It will take 1–3 hours.`, "success");

    const refunds = JSON.parse(localStorage.getItem("refunds") || "[]");
    const newRefund = {
      id: Date.now(),
      amount,
      address,
      network,
      date: new Date().toLocaleString(),
      status: "Processing"
    };
    refunds.unshift(newRefund);
    localStorage.setItem("refunds", JSON.stringify(refunds));

    refundAmount.value = "";
    walletAddress.value = "";
    networkType.value = "";

    displayRefundHistory(refunds);
    simulateCompletion(newRefund.id); // Trigger fake processing timer
  });

  function displayRefundHistory(refunds) {
    refundHistoryList.innerHTML = "";
    if (refunds.length === 0) {
      refundHistoryList.innerHTML = `<p class="no-history">No refund requests yet.</p>`;
      return;
    }

    refunds.forEach(ref => {
      const div = document.createElement("div");
      div.classList.add("history-item");
      div.innerHTML = `
        <p><b>Amount:</b> $${ref.amount.toFixed(2)}</p>
        <p><b>Network:</b> ${ref.network}</p>
        <p><b>Address:</b> ${ref.address}</p>
        <p><b>Date:</b> ${ref.date}</p>
        <p><b>Status:</b> ${ref.status === "Processing" ? "⏳ Processing (1–3 hours)" : "✅ Completed"}</p>
      `;
      refundHistoryList.appendChild(div);
    });
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
  }

  function simulateCompletion(refundId) {
    // For testing: 10 seconds delay simulates 3 hours.
    // In production: change 10000 → 10800000
    setTimeout(() => {
      let refunds = JSON.parse(localStorage.getItem("refunds") || "[]");
      const index = refunds.findIndex(r => r.id === refundId);
      if (index !== -1 && refunds[index].status === "Processing") {
        refunds[index].status = "Completed";
        localStorage.setItem("refunds", JSON.stringify(refunds));
        displayRefundHistory(refunds);
      }
    }, 10000);
  }

  // On page load: display existing refunds & re-simulate pending ones
  const storedRefunds = JSON.parse(localStorage.getItem("refunds") || "[]");
  displayRefundHistory(storedRefunds);

  // Re-activate timers for any still-processing refunds
  storedRefunds.forEach(ref => {
    if (ref.status === "Processing") simulateCompletion(ref.id);
  });
});
