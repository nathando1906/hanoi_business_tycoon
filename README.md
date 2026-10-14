# Hanoi Business Tycoon

An educational browser game about business location and expansion in a conceptual polycentric Hanoi. The player operates three business types—convenience retail, café/F&B, and logistics transfer points—and chooses among six fictional market regions.

## Run locally
1. Open `index.html` in a modern browser. Internet is required for Chart.js from jsDelivr; the core game runs without a backend.
2. Choose a region and sector, open a location, then advance a quarter.
3. Review cash, revenue, operating costs, profit, and the event log.

## Run tests
Requires Node.js 18+:
```bash
npm test
```
Tests use Node's built-in test runner; no third-party test dependency is needed.

## Deploy with GitHub Pages
1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**, branch `main`, folder `/(root)`.
4. Save and wait for deployment.

## Repository layout
- `index.html`, `style.css`, `game.js`: browser UI.
- `src/simulation.js`: deterministic simulation engine and state transitions.
- `src/config.js`: browser-friendly configuration.
- `data/processed/game_regions.json`, `game_sectors.json`: machine-readable fictional game parameters.
- `data/processed/vietnam_macro_data_cleaned.csv`: cleaned national-level WDI indicators supplied for macro context.
- `data/processed/hanoi_retail_market_indicators.csv` and `.xlsx`: early collection of published retail market indicators.
- `data/processed/hanoi_official_and_market_indicators.csv`: 15 traceable Hanoi city-level official/market indicators.
- `data/processed/region_data_gap.csv`: explicit data gaps for each of the six conceptual regions.
- `data/processed/game_region_assumptions.csv`: six synthetic region profiles for gameplay, explicitly labeled `SIMULATED_ASSUMPTION`.
- `docs/ECONOMIC_ASSUMPTIONS.md`: sector starting values and sensitivity ranges.
- `docs/UI_QA.md`: browser validation status and manual checklist.
- `data/processed/DATA_STATUS.md`: what is collected and what is still missing.
- `docs/`: methodology, rules, data dictionary, and project context.
- `tests/`: automated tests.

## Validation status
- npm test: 10 automated tests passed, covering the simulation engine and synthetic-data labeling.
- node --check game.js: passed.
- node --check src/simulation.js: passed.
- Browser validation: A browser smoke test was attempted, but navigation was blocked by the execution environment (ERR_BLOCKED_BY_ADMINISTRATOR). The actual browser UI has not yet been fully validated. See docs/UI_QA.md for the manual testing checklist.

## Data honesty
All six region coefficients and all sector revenue/cost coefficients are fictional gameplay assumptions, not measured values for Hanoi locations.
National Vietnam indicators provide macroeconomic context only and must not be interpreted as neighborhood demand estimates. Published retail market indicators are stored separately and are not automatically used as region-specific rents because their market coverage and submarket definitions differ from the conceptual game regions.
Missing values mean not collected, not zero.
This game is for learning and experimentation, not investment advice.

This game is for learning and experimentation, not investment advice.
