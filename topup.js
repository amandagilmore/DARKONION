// topup.js (standalone)
// TXID required, min $50, copy-first, local credit + deposit record

const walletsTopup = {
  btc: "bc1qexamplebtcwalletaddress1234567890",
  usdt: "0xexampleusdtwalletaddress1234567890",
  ltc: "ltc1qexampleltcwalletaddress1234567890",
};

const MIN_DEPOSIT_USD_TOPUP = 50;
let hasCopiedTopup = false;
const _$ = (id)=>document.getElementById(id);

function _readLS(key,fallback=[]) { try { return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback)); } catch { return fallback; } }
function _writeLS(key,val){ localStorage.setItem(key, JSON.stringify(val)); }
function _updateBalanceDisplayTopup(balance){ const v = `$${Number(balance).toFixed(2)}`; if(_$("balanceDisplay")) _$("balanceDisplay").textContent=v; }
function _isValidTxidTopup(txid){ const s=(txid||"").trim(); return s.length>=10 && /^[A-Za-z0-9_-]+$/.test(s); }
function _activeCoinKeyTopup(){ const a=document.querySelector('.crypto-buttons button.active'); if(!a) return 'btc'; if(a.id.startsWith('btc'))return 'btc'; if(a.id.startsWith('usdt'))return 'usdt'; if(a.id.startsWith('ltc'))return 'ltc'; return 'btc'; }

function showWallet(coin){
  const t=_$("wallet-title"), a=_$("wallet-address");
  t.textContent=coin.toUpperCase()+" Wallet";
  a.textContent=walletsTopup[coin];
  document.querySelectorAll('.crypto-buttons button').forEach(b=>b.classList.remove('active'));
  const btn=document.getElementById(`${coin}-btn`); if(btn) btn.classList.add('active');
}
window.showWallet = showWallet;

_$("btc-btn").addEventListener('click',()=>showWallet('btc'));
_$("usdt-btn").addEventListener('click',()=>showWallet('usdt'));
_$("ltc-btn").addEventListener('click',()=>showWallet('ltc'));

_$("copy-btn").addEventListener('click',()=>{
  const addr=_$("wallet-address").innerText;
  const activeBtn=document.querySelector('.crypto-buttons button.active');
  const coinLabel=activeBtn?activeBtn.textContent:"BTC";
  navigator.clipboard.writeText(addr).then(()=>{
    const s=_$("copy-success");
    s.textContent=`${coinLabel} Address Copied ✅ Deposit using the copied address then scroll below to verify your transaction after Deposit `;
    s.style.display='block';
    hasCopiedTopup=true;
    setTimeout(()=>s.style.display='none',30000);
    document.querySelector('.deposit-section').scrollIntoView({behavior:'smooth'});
  });
});

_$("verifyBtn").addEventListener('click',()=>{
  const txEl=_$("txidInput"), amtEl=_$("depositAmount"), msg=_$("verifyMessage");
  const txid=txEl.value.trim(); const amt=parseFloat(amtEl.value);
  [txEl,amtEl].forEach(el=>el.style.borderColor=''); msg.style.display='none'; msg.textContent='';

  if(!hasCopiedTopup){ alert('Please copy the wallet address first, then make your payment.'); return; }
  if(!_isValidTxidTopup(txid)){ txEl.style.borderColor='#ef4444'; msg.textContent='⚠️ A valid TXID is required (min 10 chars, letters/numbers/-/_).'; msg.style.display='block'; return; }
  if(!amt || amt<=0){ amtEl.style.borderColor='#ef4444'; msg.textContent='Enter a valid amount.'; msg.style.display='block'; return; }
  if(amt<MIN_DEPOSIT_USD_TOPUP){ amtEl.style.borderColor='#ef4444'; msg.textContent=`⚠️ Minimum deposit is $${MIN_DEPOSIT_USD_TOPUP.toFixed(2)}.`; msg.style.display='block'; return; }

  const deposits=_readLS('deposits');
  if(deposits.some(d=>(d.txid||'').toLowerCase()===txid.toLowerCase())){ txEl.style.borderColor='#ef4444'; msg.textContent='⚠️ This TXID was already submitted.'; msg.style.display='block'; return; }

  let bal=parseFloat(localStorage.getItem('balance')||0); bal+=amt; localStorage.setItem('balance',bal.toFixed(2)); _updateBalanceDisplayTopup(bal);

  const coin=_activeCoinKeyTopup().toUpperCase();
  deposits.unshift({ id:'dep_'+Date.now(), coin, txid, amountUSD:amt, address:_$("wallet-address").innerText.trim(), createdAt:new Date().toISOString(), status:'credited-local' });
  _writeLS('deposits',deposits);

  txEl.value=''; amtEl.value=''; msg.textContent=`✅ $${amt.toFixed(2)} added. TXID saved.`; msg.style.display='block';
});

window.addEventListener('load',()=>{
  showWallet('btc');
  const username=localStorage.getItem('username')||'Guest';
  const balance=parseFloat(localStorage.getItem('balance')||0);
  const u=_$("usernameDisplay"), b=_$("balanceDisplay"); if(u) u.textContent=username; if(b) _updateBalanceDisplayTopup(balance);
  const top=_$("topupBtn"), ref=_$("refundBtn"), out=_$("logoutBtn");
  if(top) top.addEventListener('click',()=>location.href='topup.html');
  if(ref) ref.addEventListener('click',()=>location.href='refund.html');
  if(out) out.addEventListener('click',()=>{ localStorage.removeItem('username'); localStorage.removeItem('balance'); alert('You have been logged out!'); location.href='login.html'; });
});
