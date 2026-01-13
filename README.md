This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Deploy frontend to Vercel + run Laravel locally (ngrok)

If you want to host the frontend on Vercel while keeping Laravel running on your computer (for demos or local development), follow these steps.

1. Run Laravel locally:

```powershell
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

2. Start an ngrok tunnel (download from https://ngrok.com):

```powershell
# once only to set your authtoken
ngrok.exe authtoken YOUR_NGROK_AUTH_TOKEN

# start HTTP tunnel to port 8000
ngrok.exe http 8000
```

3. Copy the public HTTPS URL from ngrok (example: `https://abcd-1234.ngrok.io`).

4. In Vercel project settings, add an Environment Variable:

- Name: `NEXT_PUBLIC_API_URL`
- Value: `https://abcd-1234.ngrok.io/api`

Then redeploy the Vercel project.

5. (Optional) If server-side code needs to authenticate, add a server-only env var in Vercel (no `NEXT_PUBLIC_` prefix):

- Name: `API_SERVICE_TOKEN`
- Value: `<your token>`

`lib/api.ts` will attach `Authorization: Bearer <token>` automatically on server-side fetches when `API_SERVICE_TOKEN` is present.

6. Configure Laravel CORS (optional):

- Edit `backend/.env` and set `CORS_ALLOWED_ORIGINS` to a comma-separated list:

```
CORS_ALLOWED_ORIGINS="https://medicalcheckcenter.vercel.app,https://abcd-1234.ngrok.io"
CORS_SUPPORTS_CREDENTIALS=false
```

Troubleshooting:
- If you see CORS errors, ensure `CORS_ALLOWED_ORIGINS` includes the calling origin.
- If ngrok URL changes, update `NEXT_PUBLIC_API_URL` in Vercel and redeploy.
- Keep `php artisan serve` and `ngrok` running while your Vercel frontend needs to reach your local backend.

Security notes:
- Do NOT store sensitive keys in `NEXT_PUBLIC_` env vars.
- For production, host Laravel on a real server (VPS or managed platform) rather than a local machine.

