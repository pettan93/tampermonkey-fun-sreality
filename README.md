# Tampermonkey Sreality Proximity

A Tampermonkey userscript that enhances Sreality.cz listings with distance information.

## Build Instructions

### Prerequisites

- Node.js (any recent version)
- npm

### Building

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

The built script will be generated at `build/sreality-enhance-remote.js`.

### Installing in Tampermonkey

After building, copy the contents of `build/sreality-enhance-remote.js` and paste it into a new Tampermonkey script.

