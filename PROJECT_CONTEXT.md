# Project Context

## Product goal
Build an explainable educational simulation where a player learns how business performance depends on location, sector, competition, access, costs, and growth.

## Decisions already made
- Language/UI: Vietnamese.
- Delivery: static website compatible with GitHub Pages; no backend.
- Map: six conceptual regions, not an accurate geographic map.
- Sectors: convenience retail, café/F&B, logistics transfer point.
- Turn: one quarter.
- Starting cash: VND 1,000 million (fictional).
- The interface must label fictional data clearly.
- If missing region-level data are assumed for playability, store them separately in `game_region_assumptions.csv` and mark them `SIMULATED_ASSUMPTION`.
- Do not claim that available macro or retail market data validates region-level parameters.

## Current maturity
Structured prototype. The engine has been separated from UI, a config/data layer exists, and automated tests cover core transitions. It is not empirically calibrated.

## Non-goals for this version
- Real street-level site selection.
- Financial advice or forecasting actual business revenue.
- Exact mapping to current wards/communes.
- User accounts, backend, cloud saves, or multi-player mode.

## Next decisions
1. Extract and validate Hanoi population and establishment counts at a compatible geographic level.
2. Decide how to translate source indicators into model features, with documented assumptions.
3. Calibrate sector economics only when comparable and traceable data are available.
4. Add local save/export and scenario comparison after core gameplay is stable.
