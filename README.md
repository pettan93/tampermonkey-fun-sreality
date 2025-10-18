# Tampermonkey Sreality Proximity

A Tampermonkey userscript that enhances Sreality.cz listings with distance information.

## Setup

```bash
npm install
```

## Build

```bash
npm run build
```

Output: `build/cdn/sreality-enhance-remote.js`

## Deploy to Cloudflare R2

First time only:
```bash
npx wrangler login
```

Deploy:
```bash
npm run deploy
```

This uploads the script to the `tampermonkey-scripts` R2 bucket.

## How It Works

Install `build/tampermonkey.user.js` in Tampermonkey. This loader script fetches the actual code from CDN (`sreality-enhance-remote.js`) and executes it. This allows updating functionality without reinstalling the Tampermonkey script.
