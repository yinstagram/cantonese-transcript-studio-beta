# CTS official website

Static GitHub Pages site for Cantonese Transcript Studio. No build step or server-side processing.

## Preview and checks

Run `python3 -m http.server 8766 --bind 127.0.0.1` in this directory, then open `http://127.0.0.1:8766/`.
Run `npm test` for timeline, enrollment, speaker-switch and export-format checks.

## Content and assets

- `content.js` is the single authority for demo labels, storyboard captions, speaker names, example exports, and beta status. Native labels were checked against CTS `Strings.swift` and the enrollment flow.
- `index.html` contains the remaining static website copy. No duplicate caption plates are used.
- `demo-state.js` derives the deterministic 15-second public storyboard. `app.js` renders both timeline and interactive scenarios.
- `assets/cts-subtitle-editor.jpg` is an existing real CTS test-fixture screenshot, reviewed for private content. It is not a general accuracy benchmark.
- `assets/interview-guests.webp` is an original image generated with the built-in imagegen tool. Prompt: four adult East Asian interview guests on four stools, left-to-right teal-clad woman, blue-clad man, rose-clad woman, ochre-clad man with glasses; white background, restrained editorial ink illustration, no text or logos. The illustration is not footage of a real product test.
- `assets/vendor/icons.js` contains only the Lucide icons used by this site, extracted from the installed package. License accompanies the subset.
- Format downloads are expressly labeled illustrative examples, not actual transcription results.

## Release boundary

Build 44 remains historical and is not promoted as a portable download. The 2026-09-19 read-only distribution check returned 12 PASS / 4 FAIL: development bundle identifier, missing embedded Python, missing bundled FFmpeg/ffprobe, external runtime paths. The existing archive is retained unchanged in Git for historical continuity, but excluded from the Pages build through `_config.yml`.

The current public prerelease is the v0.8.24 friend Beta (Build 55). Its published ZIP is 211,311,012 bytes with SHA-256 `07617a96d219146f0f486b51f64febb35fe8f0041bb8bf4acada74ec5de544e5`, matching the clean-extracted artifact used for the real 60-second pure-audio triple-review smoke, natural segmentation smoke, package integrity check, and release binary read-back. The public compatibility boundary is Apple Silicon and macOS 26.2 or later because the bundled MLX runtime's Mach-O minimum OS is 26.2 even though the app plist declares 14.0. This is not full production acceptance: another clean Mac, fresh model download, and notarization have not been verified. Do not describe a scripted demo as live recognition or imply gimbal control.

## Deployment

Existing repository: `yinstagram/cantonese-transcript-studio-beta`, branch `main`, Pages root `/`. Validate exact content before push and compare the deployed files and browser behavior afterwards. Private QA files remain in ignored `.qa/` and are never published.
