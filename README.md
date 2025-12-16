# Hacker News Reader - React Native Challenge

This project is a mobile application developed as part of a technical challenge. It fetches articles from Hacker News, offering offline capabilities, gesture-based interactions, and background notifications for new stories.

The application was built using **React Native** and **TypeScript**, focusing on Clean Architecture, performance, and UX best practices.

## 📱 Features

### Core Functionality
- [cite_start]**Feed of Articles:** Fetches the latest mobile-related stories (Android/iOS) from the Algolia Hacker News API[cite: 9].
- **Offline First:** Uses `react-native-mmkv` to persist data. [cite_start]The app remains fully functional without an internet connection, displaying the last cached session[cite: 10].
- [cite_start]**In-App Browser:** Tapping an article opens the content in a seamless WebView integration[cite: 12].
- **Swipe to Delete:** Users can swipe items to the left to delete them. [cite_start]Deleted articles are blacklisted locally and do not reappear upon refreshing[cite: 13].
- **Pull to Refresh:** Standard gesture to update the data manually.

### Enhanced Features (Bonus)
- [cite_start]**Background Updates:** Implements a background task (via `react-native-background-fetch`) that checks for new articles every 15 minutes, even when the app is closed[cite: 25].
- [cite_start]**Push Notifications:** Sends a local notification when a new article matching user preferences is found[cite: 26].
- [cite_start]**User Preferences:** A settings menu allows users to filter notifications (e.g., "Android only", "iOS only") or disable them entirely[cite: 23, 30].

---

## 🛠 Tech Stack & Architecture

- [cite_start]**Language:** TypeScript[cite: 32].
- **State Management:** **Zustand**. Chosen for its minimal boilerplate and easy integration with persistence layers compared to Redux.
- **Persistence:** **MMKV**. A high-performance storage solution used to cache articles and store deleted item IDs (Blacklist).
- **Network:** **Axios**. Used for API requests.
- **UI & Gestures:** **Reanimated 2** & **Gesture Handler**. Ensures 60fps animations for the "Swipe to Delete" feature.
- **Notifications:** **Notifee** & **Background Fetch**. Handles headless JS tasks and local notification scheduling.
- **Testing:** **Jest** & **React Native Testing Library**.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18)
- Yarn or NPM
- **iOS:** macOS, Xcode, CocoaPods
- **Android:** Android Studio, JDK 17+

### Installation

1. **Clone the repository:**
  `git clone <YOUR_REPO_URL>`
  `cd HNReader`

2. **Install dependencies:**

  `npm install`

3. **Install iOS Pods (macOS only):**
  `cd ios && pod install && cd .. `

## 🏃‍♂️ How to ~~Run~~
1. **Start Metro Bundler**
Start the Javascript bundler in a terminal:

  `npm start`
2. **Launch Application**
**For iOS:**

  `npm run ios`
**For Android:** Ensure you have an emulator running or a device connected via USB with USB Debugging enabled.

Bash

  `npm run android`
**Note on Background Fetch:** To test the background notification feature on the iOS Simulator, you can manually trigger the event via the menu: `Debug` > `Simulate Background Fetch`.

## 🧪 Testing
Unit tests are included to demonstrate reliability and ensure the UI components behave as expected.


To run the test suite:

  `npm test`
To run tests in watch mode during development:

  `npm run test:watch`

## 📂 Project Structure
The project follows a modular structure to separate concerns:

src/
  ├── api/           # API interaction logic
  ├── components/    # Reusable UI components (ArticleCard, etc.)
  ├── screens/       # Main screens (HomeScreen, ArticleWebView)
  ├── store/         # Zustand store (Global State & Persistence)
  ├── services/      # Background tasks and Notification logic
  ├── theme/         # Centralized color palette and spacing
  ├── types/         # TypeScript interfaces and definitions
  └── utils/         # Helper functions (Date formatting, etc.)
## 📝 License
MIT