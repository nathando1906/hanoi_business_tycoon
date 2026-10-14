# Economic calibration assumptions (gameplay only)

**Status: uncalibrated; all values below are design assumptions, not observed financial data.**
Units: VND million per quarter, unless stated otherwise.

## Assumed region archetypes
`game_region_assumptions.csv` contains six synthetic archetypes with illustrative population, area, density and establishment counts. These are not official statistics and must never be described as Hanoi district-level data. They exist to make game scenarios interpretable until consistent local observations are collected.

## Sector starting parameters
| Sector | Baseline quarterly revenue | Baseline quarterly operating cost | Setup cost | Access weight | Demand weight | Transport weight |
|---|---:|---:|---:|---:|---:|---:|
| Convenience retail | 150 | 65 | 115 | 1.00 | 1.00 | 0.12 |
| Cafe/F&B | 132 | 61 | 90 | 1.15 | 0.95 | 0.06 |
| Logistics transfer point | 170 | 78 | 145 | 1.25 | 0.82 | 0.18 |

These values are chosen for gameplay balance and are not estimates of actual SME accounts. Baseline revenue and costs should be tuned through playtesting and sensitivity analysis, not presented as factual market benchmarks.

## Scenario and stress-test ranges
- Revenue baseline: 0.75×, 1.00×, 1.25× sector parameter.
- Operating costs: 0.85×, 1.00×, 1.20× sector parameter.
- Region growth: use the configured assumption as a central scenario; stress-test at 0× and 1.5× that rate.
- Event multipliers currently in engine: downturn 0.88×, stable 1.00×, upswing 1.12× revenue.
- Quarterly debt interest: 2.5% in engine; debt is not exposed in normal UI and remains zero.

## Interpretation
The model is an educational toy model. It omits taxes, depreciation, capacity limits, inventory/working capital, employee headcount, customer counts and measured price elasticity. Results are internally consistent scenarios, not forecasts.
