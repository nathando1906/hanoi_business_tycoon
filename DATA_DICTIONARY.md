# Data Dictionary

## Game configuration
| Field | Meaning | Status |
|---|---|---|
| `demand` | Relative demand index | Fictional gameplay assumption |
| `income` | Relative purchasing-power proxy | Fictional gameplay assumption |
| `rent` | Relative site-cost index | Fictional gameplay assumption |
| `access` | Relative accessibility index | Fictional gameplay assumption |
| `competition` | Revenue discount from competition, 0–1 | Fictional gameplay assumption |
| `growth` | Assumed quarterly growth rate | Fictional gameplay assumption |
| `baseRevenue` | Sector baseline quarterly revenue, VND million | Fictional gameplay assumption |
| `baseOpex` | Sector baseline quarterly operating cost, VND million | Fictional gameplay assumption |
| `setup` | Initial setup cost, VND million | Fictional gameplay assumption |
| `accessWeight` | Sector sensitivity to access | Fictional gameplay assumption |
| `needWeight` | Sector sensitivity to demand | Fictional gameplay assumption |
| `transportWeight` | Sector transport-cost coefficient | Fictional gameplay assumption |

## Research data files
- `vietnam_macro_data_cleaned.csv`: long-format national indicators; read its source/notes fields before use.
- `hanoi_retail_market_indicators.csv`: published market indicators with period, submarket, unit, source URL, and caveats.
- `hanoi_local_business_data_cleaned.xlsx`: working research workbook; retained as an analyst-facing source inventory.

The research data are not yet joined to conceptual regions. Do not fill absent population or establishment counts with zero.

## City-level indicators
`hanoi_official_and_market_indicators.csv` fields:
- `indicator_code`: stable machine-readable key.
- `indicator_name`: human-readable name.
- `period`: observation period, retained as text to support annual and quarterly values.
- `value`, `unit`: source value and original unit.
- `geography`: exact geographic scope reported by the source.
- `source_org`, `source_url`: provenance.
- `status`: reported, preliminary estimate, market report, or forecast.
- `source_note`, `game_use_caveat`: source summary and restriction on game use.

## Synthetic region assumptions
`game_region_assumptions.csv` includes illustrative population, area, density and establishment counts for six conceptual regions. Every row is marked `SIMULATED_ASSUMPTION`. These are invented scenario inputs for gameplay and are not observed statistics. Do not use them in external analysis or quote them as actual Hanoi data.
