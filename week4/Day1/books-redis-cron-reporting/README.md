# Books Redis Cron Reporting

## Overview
This project demonstrates:
- Bulk book insertion status stored in Redis
- A cron job that generates PDF reports and emails them to users
- Multi-user support with Redis key isolation

## Setup
1. Clone repo
2. Run `npm install`
3. Copy `.env.example` → `.env` and set values
4. Start with `npm start`

## Endpoints
- `POST /bulk-submit`  
  Body: `{ "userId": "user1", "email": "user1@example.com", "books": [{ "title": "Book A" }] }`

## Flow
- **bulkCron**: Processes queued jobs and writes status to Redis.
- **reportCron**: Scans Redis, generates PDF, emails user, deletes status key.

## Simulate
Use `curl` or Postman to POST multiple `/bulk-submit` requests with different `userId`.

Check logs to see cron jobs working. Emails go to the SMTP configured in `.env`.

## Notes
- For testing email, use [Ethereal](https://ethereal.email) or Mailtrap.
