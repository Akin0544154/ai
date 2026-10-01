const MOCK={symbol:"BTC/USDT",price:108420.50,signal:"BUY",confidence:78,pnl:184.32,equity:10184.32,rsi:61.4,atr:842.2,position:{side:"LONG",entry:107850,stop:106650,take:111450,amount:0.0112}};
let running=false;
const $=id=>document.getElementById(id);
const money=n=>"$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
function render(d){
 $("symbol").textContent=d.symbol||"BTC/USDT"; $("price").textContent=money(d.price);
 $("signal").textContent=d.signal||"HOLD"; $("signal").className="signal "+(d.signal==="BUY"?"buy":d.signal==="SELL"?"sell":"");
 $("confidence").textContent=(d.confidence??0)+"%"; $("upProb").textContent=(d.confidence??0)+"%";
 $("equity").textContent=money(d.equity); $("pnl").textContent=(d.pnl>=0?"+":"")+money(d.pnl);
 $("pnl").className="metricValue "+(d.pnl>=0?"buy":"sell"); $("rsi").textContent=Number(d.rsi??0).toFixed(1); $("rsi2").textContent=Number(d.rsi??0).toFixed(1); $("atr").textContent=money(d.atr??0).replace(".00","");
 const p=d.position||{}; $("side").textContent=p.side||"—"; $("side").className="positionSide "+(p.side==="SHORT"?"sell":"buy");
 $("amount").textContent=(p.amount??0)+" BTC"; $("entry").textContent=money(p.entry); $("stop").textContent=money(p.stop); $("take").textContent=money(p.take);
}
async function refresh(){
 const url=localStorage.getItem("aiCryptoApiUrl")?.replace(/\/$/,"");
 if(!url){render(MOCK);return}
 try{const r=await fetch(url+"/api/status",{cache:"no-store"});if(!r.ok)throw Error();render(await r.json());$("refreshInfo").textContent="Backend bağlı • "+new Date().toLocaleTimeString("tr-TR")}
 catch{$("refreshInfo").textContent="Backend'e bağlanılamadı • demo verisi gösteriliyor";render(MOCK)}
}
$("botButton").onclick=()=>{running=!running;$("botButton").classList.toggle("stop",running);$("botButton").textContent=running?"Ⅱ STOP BOT":"▶ START BOT";$("statusDot").classList.toggle("on",running)};
$("apiUrl").value=localStorage.getItem("aiCryptoApiUrl")||"";
$("apiUrl").addEventListener("change",e=>{localStorage.setItem("aiCryptoApiUrl",e.target.value.trim());refresh()});
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));
render(MOCK);refresh();setInterval(refresh,15000);