// Hanoi Business Tycoon — educational prototype. All baseline figures are fictional.
const regions = [
 {id:"core",name:"Lõi đô thị",short:"Lõi đô thị",x:300,y:205,type:"Trung tâm",desc:"Nhu cầu lớn và khả năng tiếp cận cao, nhưng chi phí mặt bằng và áp lực cạnh tranh cao.",demand:1.25,income:1.25,rent:1.35,access:1.2,competition:.35,growth:0.035, color:"#d27b3e"},
 {id:"west",name:"Cực phía Tây",short:"Phía Tây",x:180,y:145,type:"Cực phát triển",desc:"Khu vực giả lập có lực cầu từ dân cư mới và hoạt động văn phòng; chi phí trung bình.",demand:1.05,income:1.12,rent:.95,access:1.05,competition:.22,growth:.075,color:"#4f7fba"},
 {id:"east",name:"Cực phía Đông",short:"Phía Đông",x:470,y:210,type:"Cực phát triển",desc:"Khu vực giả lập có tiềm năng tăng trưởng nhờ đô thị hóa và kết nối giao thông.",demand:.92,income:1.02,rent:.78,access:.92,competition:.16,growth:.09,color:"#4f7fba"},
 {id:"north",name:"Vành đai phía Bắc",short:"Phía Bắc",x:390,y:85,type:"Đang phát triển",desc:"Nhu cầu hiện tại vừa phải, chi phí thấp hơn; tăng trưởng phụ thuộc vào hình thành dân cư và kết nối.",demand:.75,income:.92,rent:.62,access:.78,competition:.12,growth:.085,color:"#57a781"},
 {id:"south",name:"Cực phía Nam",short:"Phía Nam",x:280,y:350,type:"Cực phát triển",desc:"Khu vực giả lập pha trộn khu dân cư và hoạt động sản xuất; phù hợp thử nghiệm mô hình chi phí vừa phải.",demand:.88,income:.94,rent:.72,access:.86,competition:.18,growth:.065,color:"#4f7fba"},
 {id:"outer",name:"Vùng ven",short:"Vùng ven",x:560,y:365,type:"Vùng ven đô",desc:"Chi phí thấp nhưng mật độ nhu cầu và khả năng tiếp cận còn hạn chế; cần kiên nhẫn với lợi nhuận.",demand:.62,income:.78,rent:.48,access:.63,competition:.08,growth:.055,color:"#57a781"}
];
const sectors = {
 retail:{name:"Bán lẻ tiện ích",baseRevenue:150,baseOpex:65,setup:115,accessWeight:1.0,needWeight:1.0},
 cafe:{name:"Cà phê & F&B",baseRevenue:132,baseOpex:61,setup:90,accessWeight:1.15,needWeight:.95},
 logistics:{name:"Điểm trung chuyển logistics",baseRevenue:170,baseOpex:78,setup:145,accessWeight:1.25,needWeight:.82}
};
const money = n => new Intl.NumberFormat("vi-VN",{maximumFractionDigits:0}).format(Math.round(n))+" tr";
const fmt = n => new Intl.NumberFormat("vi-VN",{maximumFractionDigits:1}).format(n);
let state;
let financeChart,costChart;
function initialState(){return {quarter:1,cash:1000,debt:0,stores:[],selected:"core",history:[],logs:["<b>Khởi đầu:</b> Bạn có 1.000 triệu đồng vốn giả lập. Hãy chọn khu vực và mô hình kinh doanh để mở cơ sở đầu tiên."],last:{revenue:0,opex:0,setup:0,profit:0,interest:0,transport:0, rent:0},series:{labels:["Q0"],revenue:[0],profit:[0]}}}
function getRegion(id){return regions.find(r=>r.id===id)}
function estimate(region,sectorKey,existing=false){
 const s=sectors[sectorKey];
 const crowd=state.stores.filter(st=>st.regionId===region.id).length;
 const market=(region.demand*0.55+region.income*0.25+region.access*s.accessWeight*0.2);
 const revenue=s.baseRevenue*market*(1-region.competition)*Math.max(.58,1-crowd*.17);
 const rent=s.baseOpex*.30*region.rent;
 const other=s.baseOpex*.70;
 const opex=rent+other;
 return {revenue,opex,setup:s.setup*region.rent, rent, market};
}
function renderMetrics(){
 const profit=state.last.profit;
 document.getElementById("metrics").innerHTML=[
  ["Vốn khả dụng",money(state.cash),"Tiền mặt cuối kỳ"],
  ["Cơ sở đang vận hành",state.stores.length,"Tổng địa điểm đã mở"],
  ["Lợi nhuận quý gần nhất",(profit<0?"−":"")+money(Math.abs(profit)),profit>=0?"Lãi hoạt động":"Lỗ hoạt động"],
  ["Quý mô phỏng","Q"+state.quarter,"Mỗi lượt = một quý"]
 ].map((m,i)=>`<div class="metric"><span class="label">${m[0]}</span><strong>${m[1]}</strong><span class="foot">${m[2]}</span></div>`).join("");
}
function renderMap(){
 const g=document.getElementById("regionNodes");
 g.innerHTML=regions.map(r=>{
  const count=state.stores.filter(s=>s.regionId===r.id).length;
  const selected=state.selected===r.id;
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
 document.getElementById("regionList").innerHTML=regions.map(r=>`<button class="region-item ${state.selected===r.id?"selected":""}" data-id="${r.id}"><b>${r.name}</b><span>${r.type} · nhu cầu ${Math.round(r.demand*100)} điểm</span></button>`).join("");
 document.querySelectorAll(".region-item").forEach(b=>b.addEventListener("click",()=>selectRegion(b.dataset.id)));
}
function selectRegion(id){state.selected=id;renderMap();renderDetail()}
function renderDetail(){
 const r=getRegion(state.selected),skey=document.getElementById("sector").value,s=sectors[skey],e=estimate(r,skey);
 document.getElementById("regionTitle").textContent=r.name;
 document.getElementById("regionTag").textContent=r.type;
 document.getElementById("regionDesc").textContent=r.desc;
 document.getElementById("marketStats").innerHTML=[
  ["Chỉ số nhu cầu",Math.round(r.demand*100)+" / 150"],
  ["Thu nhập tương đối",fmt(r.income*100)+" điểm"],
  ["Chi phí mặt bằng",fmt(r.rent*100)+" điểm"],
  ["Khả năng tiếp cận",fmt(r.access*100)+" điểm"],
  ["Áp lực cạnh tranh",Math.round(r.competition*100)+"%"],
  ["Tăng trưởng giả định",fmt(r.growth*100)+"% / quý"]
 ].map(x=>`<div class="stat"><span>${x[0]}</span><b>${x[1]}</b></div>`).join("");
 document.getElementById("openCost").textContent=money(e.setup);
 document.getElementById("revenueEstimate").textContent=money(e.revenue);
 document.getElementById("opexEstimate").textContent=money(e.opex);
 const already=state.stores.some(st=>st.regionId===r.id&&st.sector===skey);
 const btn=document.getElementById("openStore");
 btn.disabled=state.cash<e.setup||already;
 btn.textContent=already?"Đã có mô hình này tại đây":state.cash<e.setup?"Không đủ vốn để mở":"Mở cơ sở tại đây";
}
function openStore(){
 const r=getRegion(state.selected),skey=document.getElementById("sector").value,s=sectors[skey],e=estimate(r,skey);
 if(state.cash<e.setup){message("Vốn khả dụng không đủ. Hãy chọn nơi rẻ hơn hoặc chờ tích lũy tiền.");return}
 if(state.stores.some(st=>st.regionId===r.id&&st.sector===skey)){message("Bạn đã có cơ sở cùng ngành tại khu vực này.");return}
 state.cash-=e.setup;
 state.stores.push({regionId:r.id,sector:skey,setup:e.setup,opened:state.quarter});
 addLog(`Đã đầu tư <b>${money(e.setup)}</b> để mở <b>${s.name}</b> tại <b>${r.name}</b>. Tiền mặt giảm ngay; doanh thu sẽ ghi nhận từ quý tiếp theo.`);
 state.last.setup=e.setup;
 message(`Đã mở cơ sở. Tiền mặt còn ${money(state.cash)}.`);
 renderAll();
}
function nextQuarter(){
 if(state.stores.length===0){message("Hãy mở ít nhất một cơ sở trước khi kết thúc quý.");return}
 const totalRevenue=0;let revenue=0,opex=0,rent=0,transport=0;
 state.stores.forEach(st=>{
  const r=getRegion(st.regionId),s=sectors[st.sector];
  const age=state.quarter-st.opened;
  const growth=Math.pow(1+r.growth,Math.max(0,age));
  const e=estimate(r,st.sector,true);
  const rev=e.revenue*growth;
  revenue+=rev;opex+=e.opex;rent+=e.rent;
  transport+=s.baseOpex*.12*(1-r.access);
 });
 // Market shocks are explicitly fictional and disclosed in the event log.
 let event="Thị trường ổn định trong quý này.";
 const roll=Math.random();
 if(roll<.18){revenue*=.88;event="Cú sốc giả lập: sức mua giảm 12%, doanh thu quý này bị ảnh hưởng."}
 else if(roll>.83){revenue*=1.12;event="Cơ hội giả lập: nhu cầu tăng 12%, doanh thu quý này được cải thiện."}
 const interest=state.debt*.025;
 const totalOpex=opex+transport+interest;
 const profit=revenue-totalOpex;
 state.cash+=profit;
 state.last={revenue,opex:totalOpex,setup:0,profit,interest,transport,rent};
 state.series.labels.push("Q"+state.quarter);
 state.series.revenue.push(Math.round(revenue));
 state.series.profit.push(Math.round(profit));
 state.history.push({quarter:state.quarter,revenue,opex:totalOpex,profit,cash:state.cash,stores:state.stores.length});
 addLog(`<b>Q${state.quarter}:</b> Doanh thu ${money(revenue)} − chi phí ${money(totalOpex)} = <b>${profit>=0?"lợi nhuận":"lỗ"} ${money(Math.abs(profit))}</b>. ${event}`);
 state.quarter++;
 // Update dashboard for next decision period
 renderAll();
 message("Đã chốt sổ quý. Hãy đọc kết quả trước khi đầu tư tiếp.");
}
function addLog(html){state.logs.unshift(html);state.logs=state.logs.slice(0,8);renderLog()}
function renderLog(){document.getElementById("log").innerHTML=state.logs.map(x=>`<div class="log-entry">${x}</div>`).join("")}
function renderFinance(){
 const l=state.last;
 document.getElementById("financeTable").innerHTML=[
  ["Doanh thu",money(l.revenue),"Tổng bán hàng của các cơ sở trong quý."],
  ["Chi phí vận hành",money(l.opex),"Mặt bằng, vận hành, vận chuyển và lãi vay giả lập."],
  ["Chi phí mở mới",money(l.setup),"Tiền đầu tư cơ sở mới; đã trừ khỏi tiền mặt khi mở."],
  ["Lợi nhuận hoạt động", (l.profit<0?"−":"")+money(Math.abs(l.profit)),"Doanh thu trừ chi phí vận hành; chưa tính thuế và khấu hao."],
  ["Tiền mặt hiện có",money(state.cash),"Khả năng tài trợ hoạt động và đầu tư tiếp."]
 ].map(row=>`<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join("");
 if(financeChart)financeChart.destroy();
 financeChart=new Chart(document.getElementById("financeChart"),{type:"line",data:{labels:state.series.labels,datasets:[{label:"Doanh thu",data:state.series.revenue,borderColor:"#4f7fba",backgroundColor:"rgba(79,127,186,.12)",fill:true,tension:.3},{label:"Lợi nhuận",data:state.series.profit,borderColor:"#18805e",backgroundColor:"rgba(24,128,94,.08)",fill:false,tension:.3}]},options:{responsive:true,plugins:{legend:{labels:{boxWidth:10,font:{family:"DM Sans",size:11}}}},scales:{y:{ticks:{callback:v=>v+" tr"}},x:{grid:{display:false}}}}});
 if(costChart)costChart.destroy();
 costChart=new Chart(document.getElementById("costChart"),{type:"doughnut",data:{labels:["Mặt bằng","Vận hành","Vận chuyển","Lãi vay"],datasets:[{data:[Math.max(0,l.rent),Math.max(0,l.opex-l.rent-l.transport-l.interest),Math.max(0,l.transport),Math.max(0,l.interest)],backgroundColor:["#4f7fba","#6da88c","#e0a16b","#8c83b8"],borderWidth:0}]},options:{responsive:true,cutout:"65%",plugins:{legend:{position:"bottom",labels:{boxWidth:10,padding:12,font:{family:"DM Sans",size:10}}}}}});
}
function renderAll(){renderMetrics();renderMap();renderDetail();renderFinance();renderLog()}
function message(t){document.getElementById("actionMessage").textContent=t}
document.getElementById("sector").addEventListener("change",renderDetail);
document.getElementById("openStore").addEventListener("click",openStore);
document.getElementById("nextQuarter").addEventListener("click",nextQuarter);
document.getElementById("reset").addEventListener("click",()=>{state=initialState();message("Đã khởi tạo lại mô phỏng.");renderAll()});
state=initialState();renderAll();