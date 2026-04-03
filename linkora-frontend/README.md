Linkora is a role‑based mobile application that connects consumers with local service providers (MSMEs) through transparent bookings, rewards, and offline service payments.

Tagline:
Where Every Purchase Pays Back

🧠 Project Overview
This repository contains the frontend of the Linkora mobile app built using:

Expo

React Native

Expo Router (file‑based routing)

TypeScript

Dark‑mode first UI

The app supports two user roles:

👤 Consumer

🏢 Service Provider

Routing and UI are role‑based.

🛠 Tech Stack
Framework: Expo (React Native)

Routing: Expo Router

Language: TypeScript

Styling: React Native StyleSheet

Backend: Django REST API (separate repo)

Auth: JWT (to be integrated)

Platform: Android, iOS

📁 Folder Structure
linkora-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (consumer)/
│   │   └── home.tsx
│   ├── (provider)/
│   │   └── 3│   ├── _layout.tsx
│   └── index.tsx
├── assets/
├── components/
├── hooks/
├── app.json
├── babel.config.js
└── package.json
Expo Router automatically maps files inside the app/ directory to screens.
## Branding & Splash Screen

The Linkora app uses the official logo across splash screen and app icon.

### Splash Screen
Configured via Expo:

```json
{
  "expo": {
    "splash": {
      "image": "./assets/images/icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
