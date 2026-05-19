# Trace — Sustainability Tracking & Batch Resource Reporting

Trace is a mobile-first sustainability tracking platform designed for Indian SME manufacturers. The application helps factories track operational resource usage batch-by-batch and generate auditable sustainability report cards.

Built for the Wooble Sustainability & Systems Thinking Hackathon.

---

## Problem

Small and medium manufacturers often store sustainability-related operational data across disconnected systems such as electricity bills, handwritten registers, WhatsApp invoices, and manual logs. When buyers request sustainability metrics like water usage per production unit, factories struggle to provide fast and defensible answers.

Trace simplifies this process by converting scattered operational logs into structured sustainability report cards.

---

## Features

* Batch-based production tracking
* Water, electricity, fuel, and waste logging
* Sustainability scoring engine
* Resource usage per-unit calculations
* Batch comparison system
* Printable A4 PDF report cards
* Demo Factory with realistic mock manufacturing data
* Mobile-first responsive design
* Optimized for low-end Android devices

---

## Sustainability Score Logic

The score starts at 100 and deducts points based on:

* Water usage per unit
* Electricity usage per unit
* Fuel usage
* Waste disposal method
* Tanker water usage

The formula follows the exact hackathon specification.

---

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Recharts

---

## Demo Factory

The app includes a fully preloaded demo manufacturing environment with:

* 20+ realistic production batches
* 6 months of operational data
* Multiple manufacturing industries
* Resource usage variations
* Sustainability score comparisons

---

## Mobile-First Design

Trace was specifically optimized for:

* Low-end Android devices
* 2GB RAM phones
* Chrome mobile browser
* Fast 4G loading
* Touch-friendly interactions

---

## Run Locally

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Hackathon Submission

This project was created for the Wooble Sustainability & Systems Thinking Hackathon.

Focus areas:

* usability
* operational simplicity
* sustainability transparency
* printable reporting
* mobile accessibility
