# 🧠 ML-Engine — AI-Powered Business Analytics & Forecasting

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ajeet3301/ML-Engine/blob/main/ML_Engine_Colab_Host.ipynb)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Cloudflare Tunnel](https://img.shields.io/badge/Tunnel-Cloudflare-orange?logo=cloudflare)](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)

ML-Engine is a full-stack, AI-powered predictive analytics platform designed to analyze business data (sales, inventory, financial metrics, and customer cohorts), automatically detect statistical anomalies, run multi-model forecasting tournaments, and extract actionable business intelligence.

---

## ⚡ Run on Google Colab (Free Public URL via Cloudflare Tunnel)

You can launch and host the entire ML-Engine application directly inside **Google Colab** with **zero setup** on your local machine:

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ajeet3301/ML-Engine/blob/main/ML_Engine_Colab_Host.ipynb)

1. Click the **Open in Colab** badge above or open [`ML_Engine_Colab_Host.ipynb`](./ML_Engine_Colab_Host.ipynb).
2. In Colab, select **Runtime** &rarr; **Run all** (or press `Ctrl+F9`).
3. The notebook will automatically:
   - Configure Node.js 20 LTS and download `cloudflared`.
   - Clone this repository and install all dependencies.
   - Launch the web server on port 3000.
   - Establish a secure Cloudflare Quick Tunnel and display your live public URL (`https://*.trycloudflare.com`).
4. Click the link to access your interactive web app from any browser, phone, or tablet!

---

## 🚀 Key Features

* **🏆 Multi-Model Forecasting Tournament**:
  Automatically trains and compares 4 statistical and machine learning models for every time-series metric:
  - *Holt's Double Exponential Smoothing* (Level + Trend with optimized $\alpha, \beta$)
  - *Polynomial Quadratic Regression* (Degree 2 curve fitting via Cramer's Rule)
  - *Ordinary Least Squares (OLS) Linear Trend*
  - *Simple Exponential Smoothing (SES)*
  Evaluates in-sample and out-of-sample RMSE, MAE, MAPE, and $R^2$ to select the champion model with 95% Confidence Interval prediction bands.

* **🔍 Robust Anomaly Detection**:
  Combines **Tukey's Interquartile Range (IQR)** fences with **Median Absolute Deviation (MAD)** modified Z-scores to reliably flag statistical anomalies without false triggers on skewed/Pareto data.

* **📦 Intelligent Demand & Inventory Planning**:
  Calculates demand velocity, trend growth rate, statistical safety stocks ($Z_{0.95} \times \sigma_{\text{demand}}$), and replenishment reorder points.

* **🧭 Multivariate Driver Analysis**:
  Discovers primary positive and negative leading indicator features impacting your core business KPIs (Revenue, GMV, Profit).

* **🎯 Unsupervised K-Means Auto-Segmentation**:
  Normalizes continuous multidimensional variables and groups records into business cohort tiers (e.g. *High Volume / High Margin*, *Niche Premium*).

---

## 💻 Local Development

### Prerequisites
- Node.js 20+ installed
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/ajeet3301/ML-Engine.git
cd ML-Engine

# Install dependencies
npm install --legacy-peer-deps

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
ML-Engine/
├── ML_Engine_Colab_Host.ipynb   # Ready-to-run Google Colab Notebook with Cloudflare Tunnel
├── src/
│   ├── app/
│   │   ├── dashboard/           # Dashboard overview, file upload, settings
│   │   ├── layout.tsx, page.tsx # Root landing page and layout
│   │   └── globals.css          # Tailwind CSS styles
│   ├── components/
│   │   ├── dashboard/           # AI insights panel, KPI cards, quick actions
│   │   ├── layout/              # Sidebar, navbar, theme-provider
│   │   └── ui/                  # Radix UI + Tailwind primitives
│   ├── lib/
│   │   ├── aiEngine.ts          # Core Machine Learning & Forecasting Tournament Engine
│   │   ├── dataProcessor.ts     # Data parsing (CSV, Excel, JSON) & summary statistics
│   │   ├── store.ts             # Zustand global state
│   │   └── auth.ts & prisma.ts  # NextAuth & database adapter
│   └── types/                   # TypeScript interfaces
├── prisma/schema.prisma         # Prisma database schema
└── package.json                 # Project dependencies & scripts
```

---

## 📄 License

MIT License. Contributions and feedback are welcome!
