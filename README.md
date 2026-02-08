# 🚗 Rently - The Ultimate Luxury Car Rental Experience

**Rently** is a premium, high-performance mobile application built with **React Native (Expo)** that redefines the luxury car rental experience. Designed with a sleek, dark-themed aesthetic ("Cyber-Noir"), it offers users seamless access to an elite fleet of vehicles while providing administrators with powerful management tools.

![Rently Banner](https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80)
_(Example Banner - Replace with actual App Screenshot)_

---

## 🌟 Key Features

### 👤 User Experience (Client App)

- **Elite Fleet Discovery**: Browse a high-fidelity catalog of luxury vehicles (Porsche, BMW, Mercedes, Tesla, etc.) with stunning imagery.
- **Smart Search & Filtering**: instantly find cars by brand (e.g., "Porsche"), body type (SUV, Coupe), or availability.
- **Seamless Booking Flow**: A frictionless checkout process with date selection, price calculation, and instant confirmation.
- **Live Trip Management**: Track active rentals, view booking history, and manage upcoming reservations.
- **Membership Tier System**: Gamified loyalty program (Silver, Gold, Black, Diamond) rewarding frequent users.
- **Secure Authentication**: Robust sign-up and sign-in powered by **Clerk**.

### 🛡️ Admin Dashboard (Management Portal)

- **Business Intelligence**: Real-time dashboard visualization of total revenue, active rentals, and fleet utilization.
- **Fleet Control**: Complete CRUD capabilities to add, edit, or remove vehicles from the platform.
- **Booking Oversight**: Monitor all user bookings, update statuses (Active, Completed, Cancelled), and manage inventory.
- **Status Updates**: Instantly update vehicle availability and maintenance status.

---

## 🛠️ Technology Stack

This project leverages a modern, scalable tech stack:

### Core Framework

- **[React Native](https://reactnative.dev/)**: For building native Android and iOS apps using React.
- **[Expo](https://expo.dev/)**: The premier framework for React Native development (SDK 50+).
- **[Expo Router](https://docs.expo.dev/router/introduction/)**: File-based routing for intuitive navigation structure.

### Backend & Data

- **[Supabase](https://supabase.com/)**: The open-source Firebase alternative. Used for:
  - **Database (PostgreSQL)**: Storing user data, bookings, and persistent car inventory.
  - **Realtime**: Live updates for booking statuses.
- **RapidAPI**: Integrated for fetching real-world car data and specifications.
- **Fallback Logic**: Robust local data generation system ensures the app never looks empty, even if external APIs are rate-limited.

### Authentication

- **[Clerk](https://clerk.com/)**: Complete user management and authentication suite.
- **Custom Admin Auth**: Secure, separate authentication flow for administrators.

### UI & Styling

- **React Native Reanimated**: For buttery smooth 60fps animations and transitions.
- **Expo Linear Gradient**: Creating the signature premium dark aesthetic.
- **Expo Image**: High-performance image caching and loading.
- **Lucide Icons / Ionicons**: Crisp, vector-based iconography.

---

## 📂 Project Structure

```bash
rently/
├── app/                    # 📱 Screens & Navigation (Expo Router)
│   ├── (tabs)/             # Main Tab Bar (Home, Explore, Bookings, Account)
│   ├── admin/              # Admin-specific restricted screens
│   ├── car/                # Car Details & Single Vehicle Views
│   ├── checkout/           # Booking & Payment Flow
│   ├── _layout.tsx         # Root Layout & Context Providers
│   ├── index.tsx           # Onboarding / Landing Screen
│   └── sign-in.tsx         # Authentication Screens
├── components/             # 🧩 Reusable UI Components (Cards, Buttons, Lists)
├── config/                 # ⚙️ App Configuration (Production settings, Envs)
├── lib/                    # 📚 Third-party library initializers (Supabase)
├── services/               # 🔌 API & Business Logic Layer
│   ├── adminService.ts     # Admin dashboard logic & stats calculation
│   ├── carApi.ts           # External Car API integration & Image mapping
│   ├── fallbackCars.ts     # Offline/Fallback data generator
│   └── supabaseService.ts  # Database interactions
└── assets/                 # 🖼️ Static Images, Fonts, and Icons
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites

- **Node.js** (LTS version recommended)
- **npm** or **bun**
- **Expo Go** app installed on your physical device (iOS/Android) OR an Emulator.

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/rently.git
cd rently
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory. You will need API keys for Clerk and Supabase.

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_SUPABASE_URL=https://...supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Running the App

Start the Expo development server:

```bash
npx expo start
```

- **Scan the QR code** with your phone (using Expo Go).
- Press **`a`** to run on an Android Emulator.
- Press **`i`** to run on an iOS Simulator.

---

## 🔐 Accessing the Admin Panel

The app features a hidden or dedicated entry for administrators.

1. Navigate to the **Sign In** screen.
2. Scroll to the bottom and tap the amber **"Admin Access"** button.
3. **Demo Credentials**:
   - **Email**: `justme13680@gmail.com`
   - **Password**: `Aditya1234`

> **Note**: In a production environment, this would be replaced with a secure, role-based backend verification system.

---

## 🎨 Design Philosophy

Rently follows a **"Dark Premium"** design language:

- **Colors**: Deep Blacks (`#000000`), Dark Greys (`#1C1C1E`), and Accents of Amber/Gold or localized Brand Colors.
- **Typography**: Uses **Inter** for clean, modern readability.
- **Feedback**: Extensive use of haptics and micro-interactions (e.g., button presses, success states).

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---
