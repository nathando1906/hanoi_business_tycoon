# Data status — updated 2026-10-14

## Collected and traceable
- `hanoi_official_and_market_indicators.csv`: 15 city-level official/market indicators, with units, periods, source URLs, status, notes and caveats.
- `hanoi_retail_market_indicators.csv`: early submarket-level market figures from commercial real-estate reports.
- `sources.csv`: source inventory.
- `vietnam_macro_data_cleaned.csv`: cleaned national-level WDI macro context.

## Still missing at game-region level
- Population, land area and density for each of the six conceptual regions.
- Counts of enterprises / individual business establishments by region and sector.
- Region-specific income or purchasing-power data.
- Comparable small-shop rents and operating costs for all six regions.

## Non-negotiable data rule
Do not assign city-wide totals to fictional regions. `region_data_gap.csv` intentionally uses `Not collected`; blank/missing is not zero. All game-region and sector coefficients remain fictional gameplay assumptions until a documented calibration process is completed.

## Synthetic data added for playable scenarios
- `game_region_assumptions.csv` provides illustrative population, area, density, establishment counts and indices for the six fictional archetypes. Every row is marked `SIMULATED_ASSUMPTION`; these are not observed Hanoi data and must not be used as real-world statistics.
