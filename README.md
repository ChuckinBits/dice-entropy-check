# Dice Entropy Check

An offline fairness test for dice used to generate Bitcoin seeds. Built for 16-sided
binary dice (faces `0000`–`1111`), and also works for 2, 4, 6, 8, 10, 12 and 20-sided dice.

Record your test rolls by tapping faces (or typing hex digits), and the page runs a
chi-square goodness-of-fit test, a per-bit balance test, and flags faces that show up far
more or less often than expected. Runs can be saved in your browser and exported as CSV or JSON.

> **Test rolls only.** Never enter the rolls you'll use for a real seed, here or in any other tool.

## Use it

- **Online / install as an app:** open https://dice.cypherhive.com, then on iPhone tap Share → *Add to Home Screen*,
  or on Android / desktop Chrome / Edge choose *Install app*. After the first visit it works with no connection.
- **Fully offline:** download `dice-entropy-check.html` from the [latest release](https://github.com/ChuckinBits/dice-entropy-check/releases/latest) and open it in any browser.
  It's a single self-contained file.

## Don't trust, verify

1. **Read it.** All of the logic is in `index.html` (identical to the release's `dice-entropy-check.html`):
   plain HTML, CSS and JavaScript with no dependencies, no build step, and no external resources.
   `sw.js` is a ~50-line service worker that only caches this app's own files for offline use.
2. **Network access is blocked.** The page's Content-Security-Policy starts with `default-src 'none'`, so the
   browser refuses fetch, XHR, WebSocket, beacons, fonts and form posts. The only same-site files it may load are
   its own icon, manifest and `sw.js`. Confirm the code never assigns to `location` or calls `window.open`.
3. **Test it offline.** Turn on airplane mode and open it. Everything works.
4. **Check the hash** against `SHA256SUMS` and the author's signed announcement:

   ```sh
   shasum -a 256 --ignore-missing -c SHA256SUMS         # macOS / Linux
   certutil -hashfile dice-entropy-check.html SHA256     # Windows
   ```
5. **Check the math.** Export your rolls as CSV and re-run the test elsewhere, e.g.
   `scipy.stats.chisquare(counts)` in Python. The p-values match SciPy to machine precision.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app |
| `sw.js` | Offline cache for the installable version |
| `manifest.webmanifest` | App name and icons for installing |
| `icons/` | App icons |
| `SHA256SUMS` | Hashes of every file |
| `CNAME` | Custom domain for GitHub Pages |

## Host your own copy

Upload the folder to any static web host (it can live in a subfolder such as `/dice/`).
HTTPS is required for the install-as-app feature; the page itself works anywhere.

When you change any file, bump `VERSION` in `sw.js` so installed copies pick up the update,
then regenerate the hashes:

```sh
cp index.html dice-entropy-check.html
shasum -a 256 index.html dice-entropy-check.html sw.js manifest.webmanifest icons/* > SHA256SUMS
rm dice-entropy-check.html
```

## Credits

Built by @ChuckinBitcoin (Nostr & X). Statistics based on the original chi-square fair-die
spreadsheet by @ineedanewgame.

## License

MIT. See `LICENSE`.
