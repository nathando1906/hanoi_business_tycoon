# Data and Methodology

## Evidence tiers
1. **Official statistics**: preferred for population, labor, and establishment counts when geographic definitions and years align.
2. **Market reports**: useful for modern retail supply, asking rents, vacancy, and market pipeline, but not a full census of street shops.
3. **Open geospatial data**: potentially useful for POIs and accessibility; license and attribution obligations must be followed.
4. **Gameplay assumptions**: any unobserved variable or coefficient used to make the game playable must be explicitly marked simulated.

## Current separation
The cleaned Vietnam macro series and Hanoi market indicators are included as research context. They do not directly drive regional game calculations. The six regions remain conceptual and all their coefficients remain fictional.

## Geographic comparability
Hanoi administrative boundaries changed in 2025. Historic district-based data, current ward/commune data, market-report submarkets, and conceptual game regions must not be joined without a documented crosswalk or an explicit statement that the mapping is illustrative.

## Before calibration
- Record source URL, publisher, release date, observation period, unit, geography, definition, and license.
- Preserve raw source files when permitted and do not redistribute copyrighted report graphics or full tables.
- Document transformations and missingness.
- Avoid presenting estimates as observed facts.

## Official city-level observations added (2026-10-14)
`data/processed/hanoi_official_and_market_indicators.csv` records city-level indicators from Hanoi Statistics and Cushman & Wakefield, including 2024 population, urban/rural shares, labor force, GRDP growth, sector growth, enterprise count, and Q2 2026 retail stock/occupancy/asking rent/pipeline. These are contextual indicators only. They do not provide six-region observations and are not plugged directly into fictional region parameters.
