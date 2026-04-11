# Restaurant Next Demo

Project Next.js (App Router) cho demo chatbot tool-calling.

## Chay project

```bash
cd restaurant-next
npm install
npm run dev
```

App chay tai: `http://localhost:3006`

## API routes de chatbot goi

- `GET /api/menu/hot?limit=6`
- `GET /api/menu?category=&maxPrice=&search=`
- `GET /api/menu/:slug`
- `GET /api/branches`
- `GET /api/reservations/slots?branchId=&date=&partySize=`
- `POST /api/reservations`

## Plugin payload

Import file:

`../data/restaurant-next-plugin.payload.json`

Luu y payload mac dinh `base_url = http://localhost:3006`.
