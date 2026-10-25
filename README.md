# Lona

Lona is a friendly lending app that makes it easy to lend money to friends and keep track of it. Users can send loans to people they know, see what's owed, and settle up through the platform, without the awkward follow-ups.

> **Status:** Early development. Features and documentation will be expanded as the project takes shape.

## Tech stack

- [Expo](https://expo.dev) (React Native) for iOS, Android, and web
- [Expo Router](https://docs.expo.dev/router/introduction) for file-based navigation
- TypeScript
- ESLint + Prettier

## Getting started

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Start the development server

   ```bash
   pnpm start
   ```

   From there you can open the app in a [development build](https://docs.expo.dev/develop/development-builds/introduction/), an Android emulator, an iOS simulator, or [Expo Go](https://expo.dev/go).

## Scripts

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `pnpm start`        | Start the Expo dev server        |
| `pnpm ios`          | Start on iOS                     |
| `pnpm android`      | Start on Android                 |
| `pnpm web`          | Start on web                     |
| `pnpm lint`         | Lint the project                 |
| `pnpm lint:fix`     | Lint and auto-fix issues         |
| `pnpm format`       | Format all files with Prettier   |
| `pnpm format:check` | Check formatting without writing |
| `pnpm typecheck`    | Run the TypeScript compiler      |

## Project structure

```
src/
  app/        # Screens and layouts (Expo Router)
assets/       # Images, icons, and fonts
```
