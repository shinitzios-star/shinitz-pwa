# Shinitz PWA (frontend demo)

This project converts the supplied React Native screen into a browser-based React PWA. It keeps the demo screens and local in-memory demo interactions.

## Run locally

1. Install Node.js 18+.
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local URL shown by Vite.
4. For a production build run `npm run build`; deploy the generated `dist/` folder to an HTTPS host.

## PWA notes

- `public/manifest.webmanifest` enables installation metadata.
- `public/sw.js` caches the app shell and same-origin GET requests after they load.
- Install is available through the browser menu when served over HTTPS (or localhost).
- Offline mode can display previously cached app resources; it does not make server APIs, live orders, OTP, payments, or chat work offline.

## Before production

- Replace demo products, addresses, order and profile state with Shinitz API calls.
- Connect authentication, order placement, payments, delivery tracking, push notifications and support chat to production services.
- Replace the placeholder app icon with the official Shinitz logo in suitable PNG sizes (including 192x192 and 512x512).
- Review the demo checkout and account deletion flows before exposing them to customers.
