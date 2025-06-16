# Brotodoist – Modern Next.js Todo Application

**Brotodoist** is a modern, scalable, and type-safe to-do list application built with Next.js 15.3.3, TypeScript, Firebase, and Tailwind CSS.  
It supports full-stack features including authentication, real-time database updates, PWA support, and a clean, customizable UI.

---

## Key Features

- Authentication using Google OAuth with NextAuth.js and Firebase Auth
- Real-time data synchronization using Firestore
- Responsive and themeable UI with Tailwind CSS and dark/light mode toggle
- PWA ready using `next-pwa`
- Type-safe development using TypeScript and Zod
- Async state management using TanStack React Query v5
- Client-side form validation and user feedback with Sonner and Radix UI

---

## Tech Stack and Libraries

| Tool / Library             | Purpose                                        |
|---------------------------|------------------------------------------------|
| Next.js 15.3.3            | React framework with App Router and SSR        |
| TypeScript 5              | Static typing and tooling support              |
| Firebase (v11)            | Authentication and Firestore                   |
| Firebase Admin (v12)      | Secure server-side operations                  |
| NextAuth.js (v4)          | Authentication and session management          |
| TanStack React Query v5   | Data fetching and caching                      |
| Tailwind CSS v4           | Utility-first styling framework                |
| Lucide React              | Icon set for consistent UI                    |
| PWA                       | Progressive Web App ready                      |
| Zod                       | Schema-based validation                        |
| Next Themes               | Dark/Light mode implementation                 |
| Radix UI                  | Accessible UI components                      |
| Sonner                    | Lightweight toast notification system          |

---

## Project Requirements

- Node.js v18+
- SQLite or other supported Prisma-compatible databases
- Firebase project setup
- Google Cloud project for OAuth credentials

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/riansap/brotodoist.git
   cd brotodoist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in these required variables in `.env`:
   - Google OAuth Client ID and Secret
   - Firebase API keys and config
   - NEXTAUTH_SECRET

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open the app at:  
   [http://localhost:3000](http://localhost:3000)

---

## Available Scripts

| Script         | Description                        |
|----------------|------------------------------------|
| `npm run dev`  | Start development server with Turbopack |
| `npm run build`| Build the project for production   |
| `npm run start`| Start the production server        |
| `npm run lint` | Lint code with ESLint              |

---

## Testing

Testing is set up using **Jest** and **React Testing Library**.

- Unit and integration test support
- Custom matchers from `jest-dom`
- `jsdom` environment for browser-like testing

---

## Environment Configuration

Check `.env.example` for the full list of environment variables and their required values. You need:

- Google OAuth credentials
- Firebase configuration
- A secure `NEXTAUTH_SECRET` value

---

## Contribution Guidelines

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message"
   ```
4. Push the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

---

## License

This project is open-source and licensed under the MIT License.

---

**Made with ❤️  using Next.js, Firebase, and TypeScript**  
