# network-security-final

OAuth2 Authentication Application with Google using Express.js and Passport.js.

## Features

- Google OAuth 2.0 authentication
- Session-based user management
- CSRF protection using OAuth state parameter
- Secure token handling and revocation
- Protected routes with authentication middleware

## Prerequisites

- Node.js (v14 or higher recommended)
- Google Cloud Console project with OAuth 2.0 credentials

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URI: `http://localhost:3000/auth/google/callback`

3. **Create `.env` file**

   Create a `.env` file in the root directory with the following variables:
   ```env
   SESSION_SECRET=your-random-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   GOOGLE_TOKEN_REVOKE_URL=https://oauth2.googleapis.com/revoke
   GOOGLE_USERINFO_URL=https://www.googleapis.com/oauth2/v2/userinfo
   PORT=3000
   ```

## Running the Application

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. Navigate to `http://localhost:3000`
2. Click "Login" to authenticate with Google
3. After successful authentication, you'll be redirected to your profile page
4. Click "Logout" to revoke tokens and end the session

## Project Structure

- `app.js` - Main application entry point and Express configuration
- `passport.js` - Passport.js strategy configuration and user serialization
- `routes.js` - Authentication routes and protected endpoints
- `CLAUDE.md` - Architecture documentation for AI assistants

## Security Features

- Session cookies with httpOnly and sameSite protection
- OAuth state parameter validation for CSRF protection
- Token revocation on logout
- In-memory user storage (session-based)
