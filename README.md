# Koin Receipt Scan & Expense Review

A focused Expo React Native implementation of Koin's receipt-to-expense flow. It is designed to run without API keys: every receipt selected from the gallery or camera receives a realistic fallback extraction that reviewers can edit immediately.

## Published preview update

[View the iOS and Android preview update on Expo](https://expo.dev/accounts/sandarum/projects/koin-receipts/updates/8fd468be-04dd-432f-bdff-e6ed321d45ae).

This EAS Update targets runtime version `1.0.0` and requires a compatible app build.

- [Android APK build](https://expo.dev/accounts/sandarum/projects/koin-receipts/builds/6d3cda55-1f84-4e8d-bc93-5eb86b2da23a) — download and install the APK once the build succeeds.
- [iOS Simulator build](https://expo.dev/accounts/sandarum/projects/koin-receipts/builds/35a8fe1d-2ef1-4c9e-9e64-e0798b7cc663) — download after the build succeeds, then run on a Mac with Xcode Simulator. This build cannot be installed on a physical iPhone.

For an iOS simulator build, extract the downloaded archive and run `xcrun simctl install booted /path/to/Koin.app`, followed by `xcrun simctl launch booted com.sandarum.koinreceipts`. Alternatively, follow the local development instructions below.

## Run locally

```bash
npm install
npx expo start
```

Open the QR code with Expo Go, or press `i` for iOS and `a` for Android. Camera testing requires a physical device; gallery selection works in the simulator.

To create an installable preview once the project is connected to an Expo account:

```bash
npx eas build --profile preview --platform all
```

## What is included

- Receipt selection from gallery and camera using `expo-image-picker`
- A clear simulated scanning state, followed by a receipt review screen
- Editable merchant, date, category, line-item names, and prices
- Add and delete line items, with totals calculated in integer cents to avoid floating-point errors
- Validation before save, and instant insertion into Recent Activity
- Safe-area handling, keyboard avoidance, and tabular currency numerals

## Architecture

The entire prototype is intentionally kept in `App.tsx`: state is local because the two-screen flow has one short-lived draft and one activity list. `Expense` and `Item` provide the model boundary, while all money is held as integer cents. A production API extractor can replace the deterministic callback in `beginScan` without changing the review UI.

## AI tooling

AI assistance was used to turn the supplied product brief into the initial Expo implementation. The resulting code was reviewed with particular attention to the edit/save path, cents-based totals, validation, and platform permission handling.
