

# VEE: Validation, Estimation, and Editing for Time Series Data

VEE is an interactive web application for cleaning, validating, estimating, and manually editing time series data. It is designed to help users quickly identify outliers, interpolate missing or invalid values, and make manual corrections—all with real-time feedback and visualizations.

## What is VEE?

**VEE** stands for **Validation, Estimation, and Editing**:
- **Validation:** Automatically flag and filter out-of-range or missing data points.
- **Estimation:** Interpolate or estimate missing/invalid values using linear interpolation.
- **Editing:** Manually override or correct any value, with changes reflected instantly in the data table and chart.

## Features
- Step-by-step workflow for time series data cleaning
- Interactive table with status badges and manual edit dialog
- Live-updating time series chart with original, estimated, and manual values
- Date/time range picker to generate synthetic data for any period
- All values formatted to 4 decimals (xxxxx.xxxx)
- Debug section for manual and epoch values

## Demo

👉 **[View the live demo on GitHub Pages](https://desmundyeng.github.io/vee/)**

## Getting Started

### Prerequisites
- Node.js (v16 or newer recommended)
- npm (v8 or newer)

### Installation

```bash
npm install
```

### Running Locally

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
```

## Deployment (GitHub Pages)

This project deploys to GitHub Pages at the URL set in the `homepage` field of `package.json`.

There are two ways to deploy:

1. **Automatic (recommended):** A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and
   deploys the app on every push to `master`. Enable it once under
   **Settings → Pages → Build and deployment → Source: GitHub Actions**.

2. **Manual:** Publish the `build` folder to the `gh-pages` branch:

   ```bash
   npm run deploy
   ```

   Then set **Settings → Pages → Source** to the `gh-pages` branch.

## License

This project is open source and you are free to use, modify, and distribute it as you wish.

---

**VEE** is built with React, Tailwind CSS, and Recharts. Contributions and feedback are welcome!
