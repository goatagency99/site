# bymarccc.com — rules for any AI assistant (Claude, Codex, ChatGPT)

Deploy: whatever lands on `main` is live on Cloudflare Pages within 1–2 minutes. Never `--force`. One change at a time, only what was asked.

## The music engine is PROTECTED — do not remove, rewrite or "clean up" any of it
It is the most fragile part of the site. It was rebuilt several times and every part below is needed:
- `index.html`: the DJ mix engine — last **10 seconds** (`MIX_S = 10`, `PREP_S = 25`) of a song fade out while the first 10 seconds of the next song fade in. Functions: `mixEnsure`, `mixPrepare`, `mixGo`, `mixStop`, `mixSleep`, Web Audio decks, `setValueCurveAtTime`, `window.__bymMix`, `window.__bymNowPlaying`.
- `index.html`: lock-screen "Now playing" block (mediaSession) with the Alien artwork `assets/img/lockscreen-alien-sky-v2-512.jpg` (+ `-v2.jpg`).
- `assets/mix-lite.js`: the same mix, auto-next and lock-screen artwork for product / checkout / members when they are opened directly (loaded at the end of those 3 pages).
- The bottom dock in all 4 pages (`index.html`, `bymarccc-product.html`, `checkout.html`, `members.html`): `playTrack()` must call `window.BYMARCCC.audioTrack.play(t)` first. Without it a song picked from search is not in the queue and never mixes.
- Playlist, player script and the page router `BYM_NAV` are duplicated in the 4 pages: keep the copies identical.
- The playlist exists in ALL 4 pages (`const SEED = [` in index.html, `var SEED = [` in bymarccc-product.html, checkout.html, members.html). Adding a song = add the SAME object to the list in all 4 pages (same id, title, src, thumb). The guard test fails if the 4 lists differ.
- A new song only mixes if: audio-only AAC file named `name.a.mp4` in `assets/media/` (not .m4a: Cloudflare ignores Range on .m4a), real `duration`; unique `id`; longer than 45 s (shorter songs are never mixed, by design). Never guess media URLs. Cloudinary is no longer used (the account is disabled): every song lives in `assets/media/` on Cloudflare — never add a `CLD + ...` source.

## Things that look redundant but are REQUIRED (iPhone) — never "simplify" them
- `mixGo` → `deckWait` / `settle`: iPhone fires `playing` before the seek is done and delivers the sound later. Deck A is judged "dead" only after it really plays (position moving AND first non-zero samples). Going back to a fixed 200 ms wait makes every mix fail on iPhone.
- Deck B is "dead" only if it really advanced (`innMoved`) and stayed digitally silent for 2 s in a row (`zeroSince`). Judging it at the first check plays the next song at full volume instead of fading it in.
- The decks have an `ended` listener that re-asserts the lock-screen text: iPhone drops it when the silent unlock clip ends.
- Lock-screen text: while mixing, `window.__bymLockHold` keeps the OLD song's title/artist until the last 6 s of that song, then the next song's text is shown. `window.__bymMixBusy` makes the text be re-asserted every 1.5 s during the last ~25 s (prepare + blend), because iPhone drops it whenever the decks start/stop. Same logic exists in `assets/mix-lite.js`.
- `?mixdebug=1` (on-screen diagnostics, read-only) and `?nomix=1` (disables the AudioContext/decks) must stay: they are how the music is debugged on a phone. They do nothing without the parameter.
- `tests/music-guard.mjs` and `.github/workflows/music-guard.yml` check all of the above. Never edit the test to make it pass.
- Not a bug: in a Safari PRIVATE tab (or with advanced privacy protection) iPhone shows no title/artwork on the lock screen. Test in a normal tab or in Chrome.

## Working rules for any change
- Change ONLY what was asked. No "improvements", renames, reformatting or clean-ups of other code, products, prices, texts or colors.
- Adding photos to a product: copy exactly how the existing products do it (same fields, file type, name pattern, folder), touch only that product, keep the images optimized (webp, similar size to the existing ones).
- Music files: `assets/media/name.a.mp4` (AAC, audio only, moov at the start = ffmpeg `-movflags +faststart`), optional `name.mp4` video + `name.jpg` poster, thumb in `assets/img/`.

## Before EVERY push (mandatory)
1. `node tests/music-guard.mjs` → must print `music guard OK`. If it fails, you broke the music: restore what you removed.
2. `node --check` on every inline `<script>` you touched.
3. `git diff` must show only the requested change.
4. `git fetch origin && git rebase origin/main`, then `git push origin HEAD:main`.
If a request would require changing the music engine, stop and ask first.
