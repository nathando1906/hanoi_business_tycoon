const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const HBT = require("../src/simulation.js");

// Tests expect region/sector config JSON. The files are located at the repo root, so read them there.
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../game_regions.json"), "utf8"));
const sectorConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "../game_sectors.json"), "utf8"));
const regions = config.regions;
const sectors = Object.fromEntries(Object.entries(sectorConfig.sectors).map(([id, s]) => [id, Object.assign({id}, s)]));
const regionMap = Object.fromEntries(regions.map(r => [r.id, r]));
const sectorMap = sectors;

test("configuration has six unique regions and three sectors with explicit simulated metadata", () => {
  assert.equal(regions.length, 6);
  assert.equal(Object.keys(sectors).length, 3);
  assert.equal(config.metadata.status, "SIMULATED");
  assert.equal(sectorConfig.metadata.status, "SIMULATED");
  assert.equal(HBT.validateConfig(regions, sectors).valid, true);
});

test("estimate returns non-negative costs and revenue", () => {
  const e = HBT.estimate(regionMap.core, sectors.retail, []);
  assert.ok(e.revenue >= 0);
  assert.ok(e.setupCost >= 0);
  assert.ok(e.operatingCost >= 0);
  assert.equal(e.canOpen, true);
});

test("opening a store reduces cash by setup cost and does not book operating profit", () => {
  const state = HBT.initialState();
  const e = HBT.estimate(regionMap.core, sectors.retail, []);
  const result = HBT.openStore(state, regionMap.core, sectors.retail, regionMap, sectorMap);
  assert.equal(result.ok, true);
  assert.ok(Math.abs(result.state.cash - (1000 - e.setupCost)) < 1e-9);
  assert.equal(result.state.stores.length, 1);
  assert.equal(result.state.last.profit, 0);
});

test("cannot open same sector twice in one region", () => {
  let state = HBT.initialState();
  state = HBT.openStore(state, regionMap.core, sectors.retail, regionMap, sectorMap).state;
  const result = HBT.openStore(state, regionMap.core, sectors.retail, regionMap, sectorMap);
  assert.equal(result.ok, false);
  assert.equal(result.reason, "duplicate");
});

test("cannot open store with insufficient cash", () => {
  const state = HBT.initialState();
  state.cash = 1;
  const result = HBT.openStore(state, regionMap.core, sectors.logistics, regionMap, sectorMap);
  assert.equal(result.ok, false);
  assert.equal(result.reason, "insufficient_cash");
});

test("advancing without stores is rejected", () => {
  const result = HBT.advanceQuarter(HBT.initialState(), regionMap, sectorMap, {random: () => 0.5});
  assert.equal(result.ok, false);
  assert.equal(result.reason, "no_stores");
});

test("quarter transition is deterministic when random source is supplied", () => {
  let state = HBT.initialState();
  state = HBT.openStore(state, regionMap.west, sectors.cafe, regionMap, sectorMap).state;
  const result1 = HBT.advanceQuarter(state, regionMap, sectorMap, {random: () => 0.5});
  const result2 = HBT.advanceQuarter(state, regionMap, sectorMap, {random: () => 0.5});
  assert.deepEqual(result1.state.last, result2.state.last);
  assert.equal(result1.state.quarter, 2);
  assert.equal(result1.state.history.length, 1);
});

test("downturn and upswing shocks use documented multipliers", () => {
  let state = HBT.initialState();
  state = HBT.openStore(state, regionMap.core, sectors.retail, regionMap, sectorMap).state;
  const normal = HBT.advanceQuarter(state, regionMap, sectorMap, {random: () => 0.5});
  const down = HBT.advanceQuarter(state, regionMap, sectorMap, {random: () => 0.1});
  const up = HBT.advanceQuarter(state, regionMap, sectorMap, {random: () => 0.9});
  assert.equal(normal.event.type, "stable");
  assert.equal(down.event.revenueMultiplier, 0.88);
  assert.equal(up.event.revenueMultiplier, 1.12);
});

test("input state is not mutated by engine transitions", () => {
  const state = HBT.initialState();
  const before = JSON.stringify(state);
  HBT.openStore(state, regionMap.core, sectors.retail, regionMap, sectorMap);
  assert.equal(JSON.stringify(state), before);
});


test("synthetic regional population/business figures are explicitly labeled as assumptions", () => {
  const csv = fs.readFileSync(path.join(__dirname, "../game_region_assumptions.csv"), "utf8");
  assert.match(csv, /SIMULATED_ASSUMPTION/);
  assert.equal((csv.match(/SIMULATED_ASSUMPTION/g) || []).length, 6);
});
