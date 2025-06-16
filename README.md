# Todoist Clone

A modern todo list application built with Next.js, featuring authentication, real-time updates, and a beautiful UI.

## Features

- 🔐 Authentication with Google (NextAuth.js)
- 🔥 Real-time updates with Firebase
- 🎨 Modern UI with Tailwind CSS
- 🌙 Dark/Light mode support
- 📱 Responsive design
- ✨ Type-safe with TypeScript

## Tech Stack

- **Framework**: Next.js 15
- **Authentication**: NextAuth.js, Firebase Auth
- **Database**: SQLite with Prisma
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Type Safety**: TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Set up your environment variables:

   - Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Set up a Firebase project and get your configuration
   - Update the `.env` file with your credentials

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
