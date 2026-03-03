# URL Shortener

A RESTful API for shortening URLs with a minimal frontend.

## Stack

- **Runtime**: Bun
- **Framework**: Express (TypeScript)
- **ORM**: Drizzle
- **Database**: Neon (Postgres)

## Setup

1. Clone the repo and install dependencies:
   ```bash
   bun install
   ```

2. Create a `.env` file at the root:
   ```
   DATABASE_URL=your_neon_connection_string
   BASE_URL=http://localhost:3000
   PORT=3000
   ```

3. Push the schema to the database:
   ```bash
   bunx drizzle-kit push
   ```

4. Start the server:
   ```bash
   bun run index.ts
   ```

The frontend is served at `http://localhost:3000`.

## API Endpoints

- POST | `/url` | Create a shortened URL |
- GET  | `/url/shortened/:shortCode` | Retrieve original URL and redirect |
- PUT  | `/url/shortened/:shortCode` | Update the original URL |
- DELETE | `/url/shortened/:shortCode` | Delete a short URL |
- GET  | `/url/shortened/:shortCode/stats` | Get access count stats |


## Project URL
https://roadmap.sh/projects/url-shortening-service