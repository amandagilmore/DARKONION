// ====== Wallet Addresses ======
const wallets = {
  btc: "bc1qexamplebtcwalletaddress1234567890",
  usdt: "0xexampleusdtwalletaddress1234567890",
  ltc: "ltc1qexampleltcwalletaddress1234567890",
};

// ====== Settings ======
const MIN_DEPOSIT_USD = 50;   // <<< minimum deposit

let hasCopied = false;

// ====== Small helpers ======
const $ = (id) => document.getElementById(id);
function readLS(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
function writeLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function updateBalanceDisplay(balance) {
  const val = `$${Number(balance).toFixed(2)}`;
  if ($("balanceDisplay")) $("balanceDisplay").textContent = val;
  if ($("balanceDisplayMobile")) $("balanceDisplayMobile").textContent = val;
}

function activeCoinKey() {
  const active = document.querySelector(".crypto-buttons button.active");
  if (!active) return "btc";
  if (active.id.startsWith("btc")) return "btc";
  if (active.id.startsWith("usdt")) return "usdt";
  if (active.id.startsWith("ltc")) return "ltc";
  return "btc";
}

// Basic TXID validator: min length + safe chars
function isValidTxid(txid) {
  const s = (txid || "").trim();
  return s.length >= 10 && /^[A-Za-z0-9_-]+$/.test(s);
}

// ====== Show Selected Wallet ======
function showWallet(coin) {
  const walletDisplay = $("wallet-display");
  const walletTitle   = $("wallet-title");
  const walletAddress = $("wallet-address");

  walletTitle.textContent = coin.toUpperCase() + " Wallet";
  walletAddress.textContent = wallets[coin];

  document.querySelectorAll(".crypto-buttons button")
    .forEach(btn => btn.classList.remove("active"));

  const btn = document.getElementById(`${coin}-btn`);
  if (btn) btn.classList.add("active");

  walletDisplay.style.display = "block";
}

// ====== Copy Wallet Address ======
$("copy-btn").addEventListener("click", () => {
  const walletAddress = $("wallet-address").innerText;
  const activeCoinBtn = document.querySelector(".crypto-buttons button.active");
  const coinLabel = activeCoinBtn ? activeCoinBtn.textContent : "BTC";

  navigator.clipboard.writeText(walletAddress).then(() => {
    const successMsg = $("copy-success");
    successMsg.textContent =
      `${coinLabel} Address Copied to clipboard ✅ Deposit using the address then when done scroll down to verify your payment`;
    successMsg.style.display = "block";
    hasCopied = true;

    setTimeout(() => (successMsg.style.display = "none"), 30000);
    document.querySelector(".deposit-section").scrollIntoView({ behavior: "smooth" });
  });
});

// ====== Verify Deposit (local credit, TXID required, min $50) ======
$("verifyBtn").addEventListener("click", () => {
  const txidEl = $("txidInput");
  const amtEl  = $("depositAmount");
  const msg    = $("verifyMessage");

  const txid   = txidEl.value.trim();
  const amount = parseFloat(amtEl.value);

  // reset UI hints
  txidEl.style.borderColor = "";
  amtEl.style.borderColor  = "";
  msg.style.display = "none";
  msg.textContent = "";

  // Require copy first (you can remove this block if not desired)
  if (!hasCopied) {
    alert("Please copy the wallet address first, then make your payment.");
    return;
  }

  // TXID required + validation
  if (!isValidTxid(txid)) {
    txidEl.style.borderColor = "#ef4444"; // red
    msg.textContent = "⚠️ A valid Transaction ID is required (min 10 chars, letters/numbers/-/_).";
    msg.style.display = "block";
    return;
  }

  // Amount required and must meet minimum
  if (!amount || amount <= 0) {
    amtEl.style.borderColor = "#ef4444";
    msg.textContent = "Enter a valid amount.";
    msg.style.display = "block";
    return;
  }
  if (amount < MIN_DEPOSIT_USD) {
    amtEl.style.borderColor = "#ef4444";
    msg.textContent = `⚠️ Minimum deposit is $${MIN_DEPOSIT_USD.toFixed(2)}.`;
    msg.style.display = "block";
    return;
  }

  // Prevent reuse of same TXID
  const deposits = readLS("deposits");
  if (deposits.some(d => (d.txid || "").toLowerCase() === txid.toLowerCase())) {
    txidEl.style.borderColor = "#ef4444";
    msg.textContent = "⚠️ This TXID was already submitted.";
    msg.style.display = "block";
    return;
  }

  // Credit balance immediately (simple/local flow)
  let currentBalance = parseFloat(localStorage.getItem("balance") || 0);
  currentBalance += amount;
  localStorage.setItem("balance", currentBalance.toFixed(2));
  updateBalanceDisplay(currentBalance);

  // Save a local record
  const active = document.querySelector(".crypto-buttons button.active");
  const coin =
    active && active.id.startsWith("usdt") ? "USDT" :
    active && active.id.startsWith("ltc")  ? "LTC"  : "BTC";

  deposits.unshift({
    id: "dep_" + Date.now(),
    coin,
    txid,
    amountUSD: amount,
    address: $("wallet-address").innerText.trim(),
    createdAt: new Date().toISOString(),
    status: "credited-local"
  });
  writeLS("deposits", deposits);

  // Clear inputs + success
  $("txidInput").value = "";
  $("depositAmount").value = "";
  msg.textContent = `✅ $${amount.toFixed(2)} added. (Transaction Confirmed Successfully)`;
  msg.style.display = "block";
});

// ====== Initialize Page ======
window.onload = () => {
  showWallet("btc");

  const username = localStorage.getItem("username") || "Guest";
  const balance  = parseFloat(localStorage.getItem("balance") || 0);

  if ($("usernameDisplay")) $("usernameDisplay").textContent = username;
  if ($("usernameDisplayMobile")) $("usernameDisplayMobile").textContent = username;
  updateBalanceDisplay(balance);

  if ($("topupBtn")) $("topupBtn").addEventListener("click", () => { window.location.href = "topup.html"; });
  if ($("topupBtnMobile")) $("topupBtnMobile").addEventListener("click", () => { window.location.href = "topup.html"; });

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("balance");
    alert("You have been logged out!");
    window.location.href = "login.html";
  };

  if ($("logoutBtn")) $("logoutBtn").addEventListener("click", logout);
  if ($("logoutBtnMobile")) $("logoutBtnMobile").addEventListener("click", logout);

  if ($("refundBtn")) $("refundBtn").addEventListener("click", () => { window.location.href = "refund.html"; });
  if ($("refundBtnMobile")) $("refundBtnMobile").addEventListener("click", () => { window.location.href = "refund.html"; });
};

// ====== Crypto Buttons ======
$("btc-btn").addEventListener("click", () => showWallet("btc"));
$("usdt-btn").addEventListener("click", () => showWallet("usdt"));
$("ltc-btn").addEventListener("click", () => showWallet("ltc"));

// ====== Mobile Menu Toggle ======
const hamburgerBtn = $("hamburgerBtn");
const mobileMenu   = $("mobileMenu");

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("show-menu");
  });
}

document.addEventListener("click", (e) => {
  if (mobileMenu && !mobileMenu.contains(e.target) && e.target !== hamburgerBtn) {
    mobileMenu.classList.remove("show-menu");
  }
});
