# Jockey - Party Music Request App

A modern Next.js application for managing party song requests using Spotify integration.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Convex (real-time database and serverless functions)
- **Authentication**: Convex Auth with Email OTP via Resend
- **Music**: Spotify API integration

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Convex

Create a free account at [convex.dev](https://convex.dev) and run:

```bash
npx convex dev
```

This will prompt you to create a new project and set up the deployment.

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in the following variables:

#### Convex
- `NEXT_PUBLIC_CONVEX_URL`: Your Convex deployment URL (set automatically by `convex dev`)

#### Resend (for Email OTP)
Get these from your [Resend dashboard](https://resend.com/):
- `RESEND_API_KEY`: Your Resend API key
- `RESEND_FROM_EMAIL`: Your verified sender email (e.g., `noreply@yourdomain.com`)

#### Spotify
Create an app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):
- `SPOTIFY_CLIENT_ID`: Your Spotify app client ID
- `SPOTIFY_CLIENT_SECRET`: Your Spotify app client secret
- `SPOTIFY_REFRESH_TOKEN`: A refresh token with appropriate scopes

Set these as Convex environment variables:
```bash
npx convex env set RESEND_API_KEY your_api_key
npx convex env set RESEND_FROM_EMAIL your_from_email
npx convex env set SPOTIFY_CLIENT_ID your_client_id
npx convex env set SPOTIFY_CLIENT_SECRET your_client_secret
npx convex env set SPOTIFY_REFRESH_TOKEN your_refresh_token
```

### 4. Run Development Server

```bash
npm run dev
```

This starts both Next.js and Convex dev servers.

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Features

- **Email OTP Authentication**: Secure sign-in via email verification
- **Real-time Updates**: All party data syncs in real-time
- **Song Requests**: Search Spotify and request songs
- **Voting System**: Vote for your favorite songs
- **QR Code Sharing**: Easy party joining via QR codes
- **Dark Mode**: Full dark/light theme support
- **Responsive Design**: Works on mobile and desktop

## Development Notes

### Convex Functions

- `convex/parties.ts`: Party CRUD operations
- `convex/requests.ts`: Song request management
- `convex/spotify.ts`: Spotify search action
- `convex/resendOtp.ts`: Email OTP provider for auth

### In Development Mode

OTP codes are logged to the console instead of being sent via email:
```
[DEV] OTP for user@example.com: 123456
```

## License

MIT
