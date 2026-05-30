# Trace — Sustainability Tracking & Batch Resource Reporting

🔗 **Live Demo:** https://trace-sustainability.netlify.app/

Trace is a mobile-first sustainability tracking platform designed for Indian SME manufacturers. The platform enables factories to track operational resource usage batch-by-batch and generate auditable sustainability report cards.

Built for the **Wooble Sustainability & Systems Thinking Hackathon**.

---

## Overview

Manufacturing SMEs often struggle to provide sustainability data when requested by buyers, auditors, or stakeholders. Important operational records are usually scattered across:

* Electricity bills
* Water purchase invoices
* WhatsApp records
* Handwritten registers
* Manual spreadsheets

Trace converts fragmented operational records into structured sustainability intelligence, enabling factories to monitor resource consumption and generate transparent sustainability reports.

---

## Problem Statement

Small and medium manufacturers frequently lack a centralized system for tracking sustainability-related metrics. As a result:

* Resource consumption is difficult to monitor
* Sustainability reporting becomes time-consuming
* Audit preparation requires manual effort
* Buyers receive inconsistent information

Trace solves this by creating a simple batch-based sustainability tracking workflow.

---

## Key Features

### Batch Management

* Batch-wise production tracking
* Historical batch records
* Sustainability performance comparison

### Resource Tracking

* Water usage logging
* Electricity consumption tracking
* Fuel consumption monitoring
* Waste generation recording

### Sustainability Analytics

* Automated sustainability score calculation
* Per-unit resource consumption metrics
* Sustainability trend visualization
* Best and lowest-performing batch analysis

### Reporting

* Printable A4 sustainability report cards
* Audit-friendly summaries
* Management dashboards

### Mobile-First Experience

* Responsive design
* Touch-friendly interface
* Optimized for low-end Android devices
* Fast loading performance

---

## Sustainability Scoring Engine

Each production batch starts with a score of **100**.

Points are deducted based on:

* Water usage per unit
* Electricity usage per unit
* Fuel consumption
* Waste disposal methods
* Tanker water dependency

The scoring methodology follows the official hackathon specification.

---

## Demo Factory Dataset

Trace includes a fully preloaded demo manufacturing environment containing:

* 20+ realistic production batches
* 6 months of operational data
* Multiple manufacturing scenarios
* Resource consumption variations
* Sustainability performance comparisons

This allows immediate exploration without requiring manual data entry.

---

## Application Workflow

1. Create or select a production batch
2. Log water, electricity, fuel, and waste data
3. Calculate resource consumption per unit
4. Generate sustainability scores
5. Compare sustainability performance across batches
6. Export sustainability report cards

---

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui

### Data Visualization

* Recharts

### Deployment

* Netlify

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

## Future Improvements

* Multi-factory support
* Carbon footprint estimation
* AI-powered sustainability recommendations
* Supplier sustainability tracking
* ERP integration
* Real-time IoT data collection

---

## Why Trace?

Trace focuses on practical adoption rather than complex enterprise software.

The platform is designed to be:

* Easy to use for factory operators
* Accessible on low-end devices
* Audit-friendly
* Scalable for SMEs
* Useful for sustainability reporting and decision-making

---

## Hackathon Submission

Built for the **Wooble Sustainability & Systems Thinking Hackathon**.

Focus Areas:

* Sustainability Transparency
* Systems Thinking
* Operational Simplicity
* Mobile Accessibility
* Real-World SME Adoption

---

## Author

**Jyot Patel**

IT Engineering Student • UI/UX Designer • Developer

GitHub: https://github.com/jyotpatel09

LinkedIn: https://www.linkedin.com/in/jyot-patel-825b05319

Live Demo: https://trace-sustainability.netlify.app/
