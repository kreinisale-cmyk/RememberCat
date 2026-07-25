# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Application Architecture

- Keep Expo Router files in `src/app/` as thin route adapters only. Route files must only import and export a screen component.
- Put each app component or screen in its own PascalCase folder under `src/features/`.
- Enforce one React component per `*.tsx` component file. If a screen needs child components, create a `components/` folder inside that screen's folder and give each child its own folder and component file.
- A component folder must contain `ComponentName.tsx`, `styles.ts`, `types.ts`, `constants.ts`, and `utils.ts`. Add exports or helpers only when they have a clear responsibility.
- Keep all React Native `StyleSheet` objects in `styles.ts`; do not declare styles in component files.
- Keep component-local values, copy, dimensions, delays, and limits in `constants.ts`. Do not use unexplained numeric or string literals in component logic.
- Keep pure transformations, validation, sorting, formatting, and selection logic in `utils.ts`.
- Keep public props, state shapes, and domain types in `types.ts`.
- Use enums for application modes and finite state values. Do not use plain string unions for these modes.
- Prefer named functions and typed props over inline logic when that improves readability. Keep route components and JSX focused on rendering and event wiring.
- Do not leave commented-out code in the repository. Delete obsolete code once its replacement is active.
- Leave one blank line between `useEffect` / `useFocusEffect` calls, local functions, and event-handler declarations so component files remain easy to scan.
