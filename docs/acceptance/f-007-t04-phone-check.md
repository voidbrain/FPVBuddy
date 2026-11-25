# F-007-T04: Owner Phone Check After Angular 22 Upgrade

Run this 15-minute phone check once `F-007-T03` is merged and deployed (or served over HTTPS / local tunnel to the phone).

## Steps

1. **Open the installed PWA** on the phone (reload once while online so the updated Angular 22 bundle and `/sw.js` cache activate, then verify it also opens with Airplane Mode enabled).
2. **Batteries page (`/batteries`)**: confirm the `TELEMETRY` header, battery status sections (`Charged`, `Stored`, `Discharged`), local fonts (`Space Grotesk`, `Inter`, `Material Symbols Outlined`), and bottom bar render cleanly without layout shift or missing icons.
3. **Model load**: wait for the local `lfm2-vl-450m-q4_0` model initialization indicator in the vision/LLM panels to reach `Ready`, and submit one short battery prompt (for example, `charge battery 1`) to verify `@runanywhere/web` tool calling still responds.
4. **Camera & vision**: tap **Start Camera**, confirm the rear camera preview mounts inside the card, and run one single-frame capture (**photo_camera**) and a brief **Live** toggle.

## Recording the outcome

- If all four checks pass, record the date and phone/browser in [`docs/work/records/F-007.md`](../work/records/F-007.md) and close `F-007-T04` and `F-007`.
- If anything broke, list the observed symptom and open a `B-` record for each regression.
