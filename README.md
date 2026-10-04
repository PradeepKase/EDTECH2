# Learning Dashboard – React Native CLI

## Architecture

The app follows a lightweight MVVM + Repository structure:

UI (Screens/Components)
→ ViewModel (UI state + actions)
→ Repository (business/data coordination)
→ API + Local Storage

This keeps screens focused on rendering and user interaction while data access and business logic stay outside the UI.

## Offline Support

Courses are fetched from the mock API and saved to AsyncStorage after a successful load. If the API fails, the repository falls back to the cached courses. Lesson completion also updates the cached course data.

## Security

In production, authentication tokens should not be stored in plain AsyncStorage. I would use iOS Keychain / Android Keystore-backed secure storage, preferably through a library such as react-native-keychain. Access and refresh tokens should have appropriate expiry/rotation and should never be logged.

## Scale – 1M users / hundreds of courses

1. Replace the mock API with a paginated backend API and server-side filtering.
2. Add a production local database such as SQLite/WatermelonDB for larger offline datasets rather than relying only on AsyncStorage.
3. Add authentication/session refresh, request retries, timeouts, monitoring and crash reporting.
4. Add pagination/infinite scrolling, image/CDN caching and API response caching.
5. Add automated unit/integration/E2E tests and CI/CD with environment-based configuration.

## Second Platform – iOS/macOS

I would implement the same layers with SwiftUI + MVVM on iOS/macOS. URLSession would provide the API layer, a repository would coordinate API and local persistence, and Keychain would store authentication tokens. The same domain models and state transitions would be preserved while the UI and platform-specific persistence implementations would use Apple frameworks.

## Demo credentials

Email: `demo@example.com`
Password: `password123`

## Test

Run:

```bash
npm test
```

The included unit test validates course progress calculation.
