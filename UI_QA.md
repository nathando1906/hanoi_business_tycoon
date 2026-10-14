# UI QA checklist

## Automated checks completed
- `node --check game.js`: pass.
- `node --check src/simulation.js`: pass.
- `npm test`: 10 tests expected after current data-integrity test.

## Browser interaction checks still need a human/normal browser session
Attempted to launch installed Chromium through Playwright against both a `file://` URL and a local HTTP server. The execution environment blocked navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`, so this is an environment restriction, not evidence that the application passed or failed in a real browser.

Please verify:
1. Open `index.html` while online (Chart.js and Google Fonts are loaded from CDNs).
2. Six region nodes and metrics render.
3. Open a retail store; cash decreases by setup cost.
4. Advance quarter; revenue, costs, profit and cash update.
5. Switch to cafe and logistics; estimate and setup cost change.
6. Try opening same sector in same region; action is blocked.
7. Reset returns cash and store count to initial values.
8. Test at desktop and narrow/mobile widths.
9. Check console for JavaScript errors and network/CDN failures.

Core engine tests do not replace this UI checklist.
