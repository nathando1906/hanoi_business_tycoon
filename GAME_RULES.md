# Game Rules and Simulation Logic

All money values are in VND million. Baseline values are intentionally fictional.

## Start
- Cash: 1,000.
- Debt: 0.
- One turn equals one quarter.
- A player may open at most one location per sector in each conceptual region.

## Site estimate
The engine combines demand, income proxy, access, sector weights, competition, and crowding to create an illustrative revenue estimate. The estimate is not a statistical forecast.

## Operating costs
- Rent component = sector base operating cost × 30% × regional rent index.
- Other operating cost = sector base operating cost × 70%.
- Transport cost = sector base operating cost × sector transport weight × (1 − access index).
- Interest = debt × 2.5% per quarter; debt/borrowing is not yet exposed in the UI, so it is zero in ordinary play.

## Quarterly transition
- Revenue receives a maturity/growth factor based on the region's assumed quarterly growth.
- A fictional market event may apply a revenue multiplier: 0.88 in a downturn, 1.00 stable, or 1.12 in an upswing.
- Quarterly profit = revenue − operating costs.
- Cash changes by quarterly profit.
- Setup costs reduce cash at the time a location is opened and are not deducted again from operating profit.

## Limitations
No taxes, depreciation, working-capital cycle, capacity constraints, labor-market model, cannibalization across regions, or empirical demand estimation. Crowding is a simple within-region discount. These omissions should be made explicit in any teaching use.
