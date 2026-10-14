// UI layer for Hanoi Business Tycoon. Business rules live in src/simulation.js.
const regions = HBT_CONFIG.regions;
const sectors = Object.fromEntries(Object.entries(HBT_CONFIG.sectors).map(([id, s]) => [id, Object.assign({id}, s)]));
const regionMap = Object.fromEntries(regions.map(r => [r.id, r]));
const sectorMap = sectors;
const money = n => new Intl.NumberFormat("vi-VN",{maximumFractionDigits:0}).format(Math.round(n))+" tr";
const fmt = n => new Intl.NumberFormat("vi-VN",{maximumFractionDigits:1}).format(n);
let state = HBT.initialState();
let financeChart, costChart;

function estimate(region, sectorKey) { return HBT.estimate(region, sectors[sectorKey], state.stores); }
function renderMetrics(){
 const profit=state.last.profit;
 document.getElementById("metrics").innerHTML=[
  ["Vốn khả dụng",money(state.cash),"Tiền mặt cuối kỳ"],
  ["Cơ sở đang vận hành",state.stores.length,"Tổng địa điểm đã mở"],
  ["Lợi nhuận quý gần nhất",(profit<0?"−":"")+money(Math.abs(profit)),profit>=0?"Lãi hoạt động":"Lỗ hoạt động"],
  ["Quý mô phỏng","Q"+state.quarter,"Mỗi lượt = một quý"]
 ].map(m=>`<div class="metric"><span class="label">${m[0]}</span><strong>${m[1]}</strong><span class="foot">${m[2]}</span></div>`).join("");
}
function renderMap(){
 const g=document.getElementById("regionNodes");
 g.innerHTML=regions.map(r=>{
  const count=state.stores.filter(st=>st.regionId===r.id).length, selected=state.selected===r.id;
  return `<g class="node" tabindex="0" role="button" aria-label="Chọn ${r.name}" data-id="${r.id}">
   <circle cx="${r.x}" cy="${r.y}" r="${selected?21:17}" fill="${count?r.color:(selected?"#166b51":"#81b7a0")}" opacity=".97"/>
   <text x="${r.x}" y="${r.y+4}" text-anchor="middle" style="fill:white;stroke:none;font-size:12px">${count?count:"+"}</text>
   <text x="${r.x}" y="${r.y+34}" text-anchor="middle">${r.short}</text>
   ${count?`<text class="sub" x="${r.x}" y="${r.y+48}" text-anchor="middle">${count} cơ sở</text>`:""}
  </g>`;
 }).join("");
 g.querySelectorAll(".node").forEach(node=>{
  node.addEventListener("click",()=>selectRegion(node.dataset.id));
  node.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectRegion(node.dataset.id)}});
 });
 document.getElementById("regionList").innerHTML=regions.map(r=>`<button class="region-item ${state.selected===r.id?"selected":""}" data-id="${r.id}"><b>${r.name}</b><span>${r.type} · nhu cầu giả định ${Math.round(r.demand*100)} điểm</span></button>`).join("");
 document.querySelectorAll(".region-item").forEach(b=>b.addEventListener("click",()=>selectRegion(b.dataset.id)));
}
function selectRegion(id){state.selected=id;renderMap();renderDetail()}
function renderDetail(){
 const r=regionMap[state.selected], skey=document.getElementById("sector").value, s=sectors[skey], e=estimate(r,skey);
 document.getElementById("regionTitle").textContent=r.name;
 document.getElementById("regionTag").textContent=r.type;
 document.getElementById("regionDesc").textContent=r.desc;
 document.getElementById("marketStats").innerHTML=[
  ["Chỉ số nhu cầu giả định",Math.round(r.demand*100)+" điểm"],
  ["Sức mua tương đối giả định",fmt(r.income*100)+" điểm"],
  ["Chi phí mặt bằng giả định",fmt(r.rent*100)+" điểm"],
  ["Khả năng tiếp cận giả định",fmt(r.access*100)+" điểm"],
  ["Áp lực cạnh tranh giả định",Math.round(r.competition*100)+"%"],
  ["Tăng trưởng giả định",fmt(r.growth*100)+"% / quý"]
 ].map(x=>`<div class="stat"><span>${x[0]}</span><b>${x[1]}</b></div>`).join("");
 document.getElementById("openCost").textContent=money(e.setupCost);
 document.getElementById("revenueEstimate").textContent=money(e.revenue);
 document.getElementById("opexEstimate").textContent=money(e.operatingCost);
 const already=!e.canOpen, btn=document.getElementById("openStore");
 btn.disabled=state.cash<e.setupCost||already;
 btn.textContent=already?"Đã có mô hình này tại đây":state.cash<e.setupCost?"Không đủ vốn để mở":"Mở cơ sở tại đây";
}
function openStore(){
 const r=regionMap[state.selected], skey=document.getElementById("sector").value;
 const result=HBT.openStore(state,r,sectors[skey],regionMap,sectorMap);
 if(!result.ok){message(result.reason==="duplicate"?"Bạn đã có cơ sở cùng ngành tại khu vực này.":"Vốn khả dụng không đủ để mở cơ sở.");return}
 state=result.state;
 message(`Đã mở cơ sở. Tiền mặt còn ${money(state.cash)}.`);
 renderAll();
}
function nextQuarter(){
 const result=HBT.advanceQuarter(state,regionMap,sectorMap);
 if(!result.ok){message("Hãy mở ít nhất một cơ sở trước khi kết thúc quý.");return}
 state=result.state;
 renderAll();
 message("Đã chốt sổ quý. " + result.event.message);
}
function renderLog(){
 document.getElementById("log").innerHTML=state.logs.map(item=>`<div class="log-entry">${escapeHtml(item.message)}</div>`).join("");
}
function escapeHtml(value){
 return String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function renderFinance(){
 const l=state.last;
 document.getElementById("financeTable").innerHTML=[
  ["Doanh thu",money(l.revenue),"Tổng bán hàng của các cơ sở trong quý."],
  ["Chi phí vận hành",money(l.opex),"Mặt bằng, vận hành, vận chuyển và lãi vay giả lập."],
  ["Chi phí mở mới",money(l.setup),"Chi đầu tư; đã trừ khỏi tiền mặt khi mở cơ sở."],
  ["Lợi nhuận quý", (l.profit<0?"−":"")+money(Math.abs(l.profit)),"Doanh thu trừ chi phí vận hành; chưa tính thuế và khấu hao."],
  ["Tiền mặt hiện có",money(state.cash),"Khả năng tài trợ hoạt động và đầu tư tiếp."]
 ].map(row=>`<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join("");
 if(typeof Chart==="undefined") return;
 if(financeChart)financeChart.destroy();
 financeChart=new Chart(document.getElementById("financeChart"),{type:"line",data:{labels:state.series.labels,datasets:[{label:"Doanh thu",data:state.series.revenue,borderColor:"#4f7fba",backgroundColor:"rgba(79,127,186,.12)",fill:true,tension:.3},{label:"Lợi nhuận",data:state.series.profit,borderColor:"#18805e",backgroundColor:"rgba(24,128,94,.08)",fill:false,tension:.3}]},options:{responsive:true,plugins:{legend:{labels:{boxWidth:10,font:{family:"DM Sans",size:11}}}},scales:{y:{ticks:{callback:v=>v+" tr"}},x:{grid:{display:false}}}}});
 if(costChart)costChart.destroy();
 costChart=new Chart(document.getElementById("costChart"),{type:"doughnut",data:{labels:["Mặt bằng","Vận hành","Vận chuyển","Lãi vay"],datasets:[{data:[Math.max(0,l.rent),Math.max(0,l.nonRentOpex),Math.max(0,l.transport),Math.max(0,l.interest)],backgroundColor:["#4f7fba","#6da88c","#e0a16b","#8c83b8"],borderWidth:0}]},options:{responsive:true,cutout:"65%",plugins:{legend:{position:"bottom",labels:{boxWidth:10,padding:12,font:{size:10}}}}}});
}
function renderAll(){renderMetrics();renderMap();renderDetail();renderFinance();renderLog()}
function message(t){document.getElementById("actionMessage").textContent=t}
document.getElementById("sector").addEventListener("change",renderDetail);
document.getElementById("openStore").addEventListener("click",openStore);
document.getElementById("nextQuarter").addEventListener("click",nextQuarter);
document.getElementById("reset").addEventListener("click",()=>{state=HBT.initialState();message("Đã khởi tạo lại mô phỏng.");renderAll()});
const configValidation=HBT.validateConfig(regions,sectors);
if(!configValidation.valid) console.error("Invalid HBT config",configValidation.errors);
renderAll();
