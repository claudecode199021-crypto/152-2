# Social Lens — NTRO AI-Driven Social Media Analytics

**Social Lens** is a web platform that ingests multi-platform social data and uses AI/ML to deliver four intelligence vectors on one dashboard: **Sentiment**, **Demographics**, **Trends**, and **Link/Network Analysis**.

Built for the **National Technical Research Organisation (NTRO)**.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Features

### Dashboard Sections
- **KPI Cards** — Total Posts (1,24,560), Active Users (38,420), Trending Topics (17), Sentiment Split (58% Positive)
- **Sentiment Over Time** — Polarity + emotion toggles (anxiety, excitement, anger, supportive), shift detection markers
- **Trending Topics** — Ranked by growth %, sparklines, status badges (Rising/Viral/Stable/Declining)
- **Audience Demographics** — Age brackets, locations, languages, professional interests with animated charts
- **Top Influencers** — Score (0-100), rank changes, reach, engagement metrics
- **Network Analysis** — Interactive graph with community detection, cascade tracking, time slider (12PM-4PM)
- **Topic Timeline** — Event rail with evidence posts: topic appears → influencer picks up → sentiment shifts → goes viral → cross-platform spread

### UX4G Design System
- Navy primary, saffron and green accents following Government of India design guidelines
- WCAG 2.1 AA: keyboard access, skip link, ARIA labels, visible focus indicators
- English/Hindi language toggle with Devanagari-safe fonts
- Responsive layout (desktop/tablet/mobile)
- Light and high-contrast themes
- Classification banner for internal use

### Motion & Animations
- Framer Motion for smooth entry animations, hover effects, and transitions
- Animated sparklines and chart rendering
- Spring physics for network graph nodes
- Staggered list animations

### API Routes
| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth` | JWT authentication with role-based access |
| `GET /api/summary` | KPI cards with platform/date filters |
| `GET /api/sentiment` | Sentiment timeline with granularity |
| `GET /api/demographics` | Aggregate distributions by dimension |
| `GET /api/trends` | Ranked topics with growth % |
| `GET /api/influencers` | Top influencers with scores |
| `GET /api/network` | Graph nodes, edges, communities |
| `GET /api/timeline` | Chronological event rail |
| `GET /api/export` | CSV/PDF export |
| `GET /api/live` | Live update polling |
| `GET /api/health` | Service status |

### Platform Support
- **Essential**: X (Twitter), Telegram
- **Desirable**: Instagram, Facebook
- **Appreciable**: Reddit, YouTube
- **Always**: Replay/mock adapter (currently active)

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Custom SVG charts with motion
- **Design System**: UX4G (Government of India)
- **API**: Next.js API Routes (mock data layer)

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Analyst | analyst | analyst123 |
| Viewer | viewer | viewer123 |

## Project Structure

```
social-lens/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API route handlers
│   │   ├── dashboard/    # Dashboard page
│   │   └── login/        # Login page
│   ├── components/
│   │   ├── charts/       # SentimentChart, NetworkGraph
│   │   ├── layout/       # Header, FilterBar, LanguageProvider
│   │   ├── motion/       # AnimatedCard, motion utilities
│   │   └── ui/           # KPICards, TrendingTopics, Demographics, etc.
│   ├── data/             # Mock data layer
│   ├── hooks/            # useTranslation, useLiveUpdates
│   ├── lib/              # Utility functions
│   ├── styles/           # Global CSS
│   └── types/            # TypeScript interfaces
├── public/               # Static assets
└── package.json
```

## License

Internal use — National Technical Research Organisation (NTRO)
