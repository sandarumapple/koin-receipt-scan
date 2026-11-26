# Koin Receipt Scan & Expense Review

A focused Expo React Native implementation of Koin's receipt-to-expense flow. Receipt text is recognized on-device with Apple Vision on iOS and Google ML Kit on Android; no API key is required. Merchant, date, category and item detection are best-effort, so review the results before saving.

## Demo video

[Watch or download the iOS and Android demo](output/demo/Koin-Demo-Combined.mov).

## Testing builds

These completed builds include on-device OCR. EAS build downloads are temporary (Android expires December 10, 2026; iOS expires December 9, 2026).

- [Download Android APK](https://expo.dev/artifacts/eas/BFh6H3NR7mi8KJeKFDQDt70gDGlIkpWnelNwvLC6Dpg.apk) · [Build details](https://expo.dev/accounts/sandarum/projects/koin-receipts/builds/b4e66cae-7d2a-42e3-8b0e-db82c0ffff92) — install on an Android device or emulator.
- [Download iOS Simulator build](https://expo.dev/artifacts/eas/jWI0edP0pVDzqlSC-VY-sPaDy0oVIlRa8Fgm230JUII.tar.gz) · [Build details](https://expo.dev/accounts/sandarum/projects/koin-receipts/builds/feb70d6e-7ea7-4c91-a138-3630f9990801) — requires Xcode Simulator on a Mac; cannot be installed on a physical iPhone.

For an iOS simulator build, extract the downloaded archive and run `xcrun simctl install booted /path/to/Koin.app`, followed by `xcrun simctl launch booted com.sandarum.koinreceipts`. Alternatively, follow the local development instructions below.

## Run locally

```bash
npm install
npx expo start
```

On-device OCR uses a native module and requires a freshly built app; Expo Go and the earlier preview builds do not contain it. Build a new Android preview or iOS Simulator app using the profiles in `eas.json`. Camera testing requires a physical device; gallery selection works in the simulator.

To create an installable preview once the project is connected to an Expo account:

```bash
npx eas build --profile preview --platform all
```

## What is included

- Receipt selection from gallery and camera using `expo-image-picker`
- On-device text recognition and best-effort receipt parsing, followed by a receipt review screen
- Editable merchant, date, category, line-item names, and prices
- Add and delete line items, with totals calculated in integer cents to avoid floating-point errors
- Validation before save, and instant insertion into Recent Activity with local persistence
- Safe-area handling, keyboard avoidance, and tabular currency numerals

## Architecture

The draft is held in local state, and saved expenses persist on the device via AsyncStorage. `Expense` and `Item` provide the model boundary, while money is held as integer cents. `receiptParser.ts` uses simple heuristics to identify fields in OCR text. Receipt layouts vary and a human should check the results.

## AI tooling

AI assistance was used to turn the supplied product brief into the initial Expo implementation. The resulting code was reviewed with particular attention to the edit/save path, cents-based totals, validation, and platform permission handling.
