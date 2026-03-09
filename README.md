# lkjkj — E-Commerce Calculator

A full-stack Next.js application for calculating e-commerce order totals including prices, discounts, taxes, and shipping costs.

## Features

- **Price Calculator**: Input base price and quantity to calculate subtotal
- **Discount Calculator**: Apply percentage or fixed-amount discounts
- **Tax Calculator**: Configurable tax rates with quick presets
- **Shipping Calculator**: Multiple shipping options or custom cost
- **Order Summary**: Real-time comprehensive breakdown
- **Calculation History**: Persistent storage of past calculations via SQLite

## Tech Stack

- **Next.js 14** with TypeScript and App Router
- **TypeORM** with **better-sqlite3** for database
- **Tailwind CSS** for styling
- **Docker** for containerized deployment

## Getting Started

### Development

```bash
# Install dependencies
npm i

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production with Docker

```bash
# Build and start with Docker Compose
docker-compose up -d

# Or build manually
docker build -t lkjkj .
docker run -p 3000:3000 -v lkjkj_data:/app/data lkjkj
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./database.sqlite` | Path to SQLite database |
| `DEFAULT_TAX_RATE` | `10` | Default tax rate (%) |
| `DEFAULT_SHIPPING_RATE` | `5.99` | Default shipping cost |
| `NEXT_PUBLIC_APP_NAME` | `lkjkj` | Application name |

## API Endpoints

- `GET /api/health` — Health check
- `GET /api/calculations` — Get calculation history
- `POST /api/calculations` — Save a new calculation

## Coolify Deployment

1. Connect your repository to Coolify
2. Set build pack to **Docker Compose**
3. Configure environment variables as needed
4. The SQLite database is persisted via Docker volume
