# Rently 🚗

Welcome to **Rently**, a modern car rental application built with cross-platform capabilities using Expo and React Native.

## Features ✨

- **User Authentication**: Secure sign-up and sign-in flows using [Clerk](https://clerk.com/).
- **Car Browsing & Rental**: Explore available cars, choose dates, and complete the checkout process seamlessly.
- **Active Trip Management**: Track your ongoing car rentals and easily access trip details.
- **Admin Dashboard**: Dedicated admin login to manage vehicles, inspections, and overall fleet operations.
- **Vehicle Inspection**: Built-in inspection flows to maintain quality and safety standards for every vehicle.

## Tech Stack 🛠

- **Frontend**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database & Backend**: [Supabase](https://supabase.com/)
- **UI & Styling**: Custom sleek design, fluid animations with `react-native-reanimated`, icons via `@expo/vector-icons`

## Getting Started 🚀

Follow these steps to set up the project locally.

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Create a `.env` file in the root directory and add your keys for Clerk and Supabase (make sure to replace the placeholder values with your actual project keys):

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start the app

```bash
npx expo start
```

In the terminal output, you'll find options to open the app in a:
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Learn More 📚

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
