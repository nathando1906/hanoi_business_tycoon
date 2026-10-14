/* Hanoi Business Tycoon simulation engine.
 * Deterministic pure functions; all monetary values are VND million.
 * Default region/sector coefficients are fictional gameplay assumptions.
 */
(function (root) {
  "use strict";

  function assertFiniteNonNegative(value, label) {
    if (!Number.isFinite(value) || value < 0) throw new Error(label + " must be finite and >= 0");
  }

  function estimate(region, sector, stores, options = {}) {
    if (!region || !sector) throw new Error("region and sector are required");
    const localStores = (stores || []).filter(st => st.regionId === region.id);
    const sameSectorCount = localStores.filter(st => st.sector === sector.id).length;
    const crowdFactor = Math.max(0.58, 1 - localStores.length * 0.17);
    const marketIndex =
      region.demand * sector.needWeight * 0.55 +
      region.income * 0.25 +
      region.access * sector.accessWeight * 0.20;
    const revenue = sector.baseRevenue * marketIndex * (1 - region.competition) * crowdFactor;
    const rent = sector.baseOpex * 0.30 * region.rent;
    const nonRentOpex = sector.baseOpex * 0.70;
    const setupCost = sector.setup * region.rent;
    const transport = sector.baseOpex * sector.transportWeight * (1 - region.access);
    const operatingCost = rent + nonRentOpex + transport;
    return {
      revenue, rent, nonRentOpex, transport, operatingCost, setupCost,
      marketIndex, crowdFactor, sameSectorCount,
      canOpen: sameSectorCount === 0
    };
  }

  function openStore(state, region, sector, regionsById, sectorsById) {
    if (!state || !region || !sector) throw new Error("state, region and sector are required");
    const estimateResult = estimate(region, sector, state.stores);
    if (!estimateResult.canOpen) return { ok: false, reason: "duplicate", state };
    if (state.cash < estimateResult.setupCost) return { ok: false, reason: "insufficient_cash", state };
    const next = structuredCloneSafe(state);
    next.cash -= estimateResult.setupCost;
    next.stores.push({
      id: "store-" + (next.nextStoreId || 1),
      regionId: region.id, sector: sector.id,
      setupCost: estimateResult.setupCost, openedQuarter: next.quarter
    });
    next.nextStoreId = (next.nextStoreId || 1) + 1;
    next.last = Object.assign({}, next.last, { setup: estimateResult.setupCost });
    next.logs.unshift({ type: "investment", quarter: next.quarter, message:
      "Đã mở " + sector.name + " tại " + region.name + ". Chi phí đầu tư đã trừ khỏi tiền mặt." });
    next.logs = next.logs.slice(0, 8);
    return { ok: true, state: next, estimate: estimateResult };
  }

  function advanceQuarter(state, regionsById, sectorsById, options = {}) {
    if (!state || !Array.isArray(state.stores)) throw new Error("valid state is required");
    if (state.stores.length === 0) return { ok: false, reason: "no_stores", state };
    const random = typeof options.random === "function" ? options.random : Math.random;
    const regionMap = regionsById;
    const sectorMap = sectorsById;
    let revenue = 0, rent = 0, nonRentOpex = 0, transport = 0;
    state.stores.forEach(store => {
      const region = regionMap[store.regionId], sector = sectorMap[store.sector];
      if (!region || !sector) throw new Error("Unknown region or sector in store");
      const age = Math.max(0, state.quarter - store.openedQuarter);
      const growthFactor = Math.pow(1 + region.growth, age);
      const e = estimate(region, sector, state.stores.filter(s => s.id !== store.id));
      revenue += e.revenue * growthFactor;
      rent += e.rent;
      nonRentOpex += e.nonRentOpex;
      transport += e.transport;
    });

    // Debt interest is a fictional quarterly rate, clearly disclosed in docs/UI.
    const interest = state.debt * (options.quarterlyInterestRate ?? 0.025);
    const shockRoll = random();
    let event = { type: "stable", revenueMultiplier: 1, message: "Thị trường giả lập ổn định trong quý này." };
    if (shockRoll < 0.18) event = { type: "downturn", revenueMultiplier: 0.88, message: "Cú sốc giả lập: doanh thu giảm 12% trong quý này." };
    else if (shockRoll > 0.83) event = { type: "upswing", revenueMultiplier: 1.12, message: "Cơ hội giả lập: doanh thu tăng 12% trong quý này." };
    revenue *= event.revenueMultiplier;

    const operatingCost = rent + nonRentOpex + transport + interest;
    const profit = revenue - operatingCost;
    const next = structuredCloneSafe(state);
    next.cash += profit;
    next.last = { revenue, opex: operatingCost, setup: 0, profit, interest, transport, rent, nonRentOpex, event };
    next.history.push({ quarter: state.quarter, revenue, rent, nonRentOpex, transport, interest, operatingCost, profit, cash: next.cash, stores: next.stores.length, event: event.type });
    next.series.labels.push("Q" + state.quarter);
    next.series.revenue.push(Math.round(revenue));
    next.series.profit.push(Math.round(profit));
    next.logs.unshift({ type: "quarter", quarter: state.quarter, message:
      "Q" + state.quarter + ": doanh thu " + Math.round(revenue) +
      " − chi phí " + Math.round(operatingCost) + " = lợi nhuận " + Math.round(profit) +
      ". " + event.message });
    next.logs = next.logs.slice(0, 8);
    next.quarter += 1;
    return { ok: true, state: next, event };
  }

  function initialState() {
    return {
      quarter: 1, cash: 1000, debt: 0, stores: [], nextStoreId: 1, selected: "core",
      history: [], logs: [{ type: "start", quarter: 1, message:
        "Khởi đầu: bạn có 1.000 triệu đồng vốn giả lập. Mọi hệ số kinh tế ban đầu đều là giả định mô phỏng." }],
      last: { revenue: 0, opex: 0, setup: 0, profit: 0, interest: 0, transport: 0, rent: 0, nonRentOpex: 0 },
      series: { labels: ["Q0"], revenue: [0], profit: [0] }
    };
  }

  function validateConfig(regions, sectors) {
    const errors = [];
    const regionIds = new Set();
    regions.forEach(r => {
      if (!r.id || regionIds.has(r.id)) errors.push("region id missing/duplicate: " + r.id);
      regionIds.add(r.id);
      ["demand", "income", "rent", "access", "competition", "growth"].forEach(k => {
        if (!Number.isFinite(r[k]) || r[k] < 0) errors.push("invalid region " + r.id + "." + k);
      });
      if (r.competition > 1) errors.push("competition must be <= 1: " + r.id);
    });
    Object.entries(sectors).forEach(([id, s]) => {
      if (!s.name) errors.push("sector name missing: " + id);
      ["baseRevenue", "baseOpex", "setup", "accessWeight", "needWeight", "transportWeight"].forEach(k => {
        if (!Number.isFinite(s[k]) || s[k] < 0) errors.push("invalid sector " + id + "." + k);
      });
    });
    return { valid: errors.length === 0, errors };
  }

  function structuredCloneSafe(value) {
    return JSON.parse(JSON.stringify(value));
  }

  const api = { estimate, openStore, advanceQuarter, initialState, validateConfig };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.HBT = Object.assign(root.HBT || {}, api);
})(typeof globalThis !== "undefined" ? globalThis : this);
