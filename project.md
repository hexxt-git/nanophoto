# Core concept (one sentence)

An app that helps amateur photographers improve by analyzing their photos for common problems, showing **visual** guidance drawn over the actual photo (crop lines, arrows, red “sharpie” notes), and letting users apply constrained AI edits (lighting, background cleanup, props) while learning why each change helps.

# User flows (mobile-first)

1. Camera / upload → choose mode: Social / Pro / Practice (controls how aggressive suggestions can be).
2. Auto-analysis: composition, exposure, sharpness, white balance, background clutter, subject isolation, color harmony.
3. Visual feedback: overlay on the photo (rule-of-thirds grid, arrows, circled problem areas, suggested crop box).
4. Edit controls: toggles for allowed edits (lighting only / crop only / background blur / remove small objects). Preview slider for before/after.
5. Learn & repeat: short micro-lesson explaining each suggestion and a simple re-shoot prompt (e.g., “move subject left 1 step”).
6. Save versions and export (web/social sizes).

# Feature ideas (prioritized)

**Core / MVP**

- Auto-analysis for composition (rule of thirds, headroom), exposure (blown highlights/shadows), blur detection, and white balance.
- Visual annotations rendered on the photo: grids, crop guides, red strokes/arrows and pinned labels.
- One-click auto-corrections for exposure, white balance, and suggested crop with adjustable strength.
- Constrained inpainting to remove small distracting objects while preserving the subject.
- Before/after preview and small-res export.
- Short micro-lessons (30–60 words) that explain each detected issue.

**Nice-to-have (phase 2)**

- RAW support and higher-fidelity edits.
- Live guided shooting overlays (rule-of-thirds grid, face placement) in camera preview.
- Assignment/challenge mode with graded feedback.
- Side-by-side pro examples and AI-synthesized reworks in a chosen style.
- Batch analysis / portfolio review.

**Pro / advanced**

- Full background replacement with semantic control (respect “no props” constraint).
- Style transfer / film looks that preserve subject detail.
- On-device editing option for privacy (smaller models or WASM), with server fallback for high-res results.

# How the “red sharpie” visual guidance works (UX)

- The analysis engine returns problem regions (polygons), suggested actions (crop, exposure +0.7, move left), and severity scores.
- The renderer overlays semi-transparent red strokes, arrows, circled areas, and short text labels pinned to regions.
- Hotspots are tappable: tap a red note to reveal the micro-lesson and a preview slider showing that specific correction.
- Optional animated micro-gifs show a simple “what to do next time” (e.g., step left, lower ISO, change angle).

# Example analysis output (JSON you can use in the frontend)

```json
{
  "compositionScore": 62,
  "issues": [
    {
      "type": "rule_of_thirds",
      "severity": "medium",
      "region": [
        [120, 30],
        [320, 30],
        [320, 240],
        [120, 240]
      ],
      "suggestion": "Crop 10% from right and move subject to left third",
      "annotationText": "Move subject to left third"
    },
    {
      "type": "exposure",
      "severity": "high",
      "region": [
        [0, 0],
        [1024, 0],
        [1024, 150]
      ],
      "suggestion": "Reduce highlights by 0.8 stops",
      "annotationText": "Blown highlights"
    }
  ],
  "masks": {
    "subject": "<rle-or-base64-mask>",
    "background": "<rle-or-base64-mask>"
  }
}
```
