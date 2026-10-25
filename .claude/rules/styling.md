# Styling, Theming & Interactions

Lona is a React Native app styled with `StyleSheet` and shared theme values. Follow these rules for any UI work.

## Theme Tokens

- Keep colours, spacing, radii, and type scale in one shared theme module (e.g. `src/constants/theme.ts`) and import from it — don't scatter raw hex values or magic numbers across components.
- When a new value is used in more than one place, add it to the theme first, then reference it.
- Support light and dark mode via `useColorScheme()` (and `userInterfaceStyle` in `app.json`) rather than hard-coding backgrounds.
- Define styles with `StyleSheet.create` outside the component body; avoid recreating style objects on every render.

## Layout

- Flexbox is the default (`flexDirection: 'column'`) — be explicit when you need rows.
- Respect safe areas (notch, home indicator, status bar) with `react-native-safe-area-context`.
- Handle the on-screen keyboard on every form screen — inputs must never be hidden behind it.
- Sanity-check layouts on a small phone (~375pt wide), a large phone, and with larger system font sizes.

## Lists & Performance

- Use a virtualised list (`FlatList`/`SectionList`) for any list that can grow (loans, friends, activity) — never `.map()` inside a `ScrollView` for unbounded data.
- Use `expo-image` for images.
- Run animations on the UI thread with Reanimated; avoid JS-driven per-frame work.

## Interactions

- Use `Pressable` with a visible pressed state for tappable elements.
- Touch targets ≥ 44×44pt (use `hitSlop` for small icons).
- Give clear feedback for destructive or money-moving actions (confirmation, loading state, success/failure).
- Use platform-appropriate patterns (sheets, haptics, native headers) via Expo Router and Expo modules.

## Accessibility & Motion

- Set `accessibilityRole`, `accessibilityLabel` on icon-only controls, and `accessibilityState` where relevant.
- Support Dynamic Type / font scaling — don't lock text sizes or clip scaled text.
- Maintain WCAG AA contrast (4.5:1 for body text) in both light and dark themes.
- Respect reduced motion (`useReducedMotion` from Reanimated / `AccessibilityInfo`) — provide a reduced or no-animation fallback.
- Don't rely on colour alone to convey state (e.g. owed vs. owing) — pair it with text or an icon.
