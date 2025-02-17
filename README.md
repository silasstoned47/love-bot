# LoveBot - Facebook Messenger Lead Generation Bot

A powerful Facebook Messenger bot built with TypeScript for lead generation and user engagement. Features a sophisticated message scheduling system and click tracking capabilities.

## 🚀 Features

- Automated message sequences with Redis-based scheduling
- Click tracking and analytics
- Dynamic URL generation with tracking parameters
- Persuasive message templates
- Error handling and logging
- Process management with auto-restart

## 🛠️ Tech Stack

- TypeScript
- Fastify
- Redis
- MariaDB
- Facebook Messenger API

## ⚙️ Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with:
```
VITE_API_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
BASE_URL=your-ngrok-url
FACEBOOK_PAGE_ID=your-page-id
FACEBOOK_ACCESS_TOKEN=your-access-token
REDIS_URL=your-redis-url
DATABASE_URL=your-database-url
```

3. Start the development server and worker:
```bash
npm run dev
```

## 📝 License

MIT License
