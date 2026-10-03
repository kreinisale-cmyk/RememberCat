# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Required Validation

- After every code change, run TypeScript, Prettier, ESLint, and a real Expo Android bundle check before reporting the work as complete.
- Run `npx tsc --noEmit`, `npx prettier --check .`, `npx eslint src`, and `npx expo export --platform android --output-dir .expo/build-check --clear`.
- Treat any validation or Metro bundling failure as a blocker. Static checks alone are not sufficient.
- When native code, native dependencies, or native configuration changes, also run the applicable native build.

# Application Architecture

- Keep Expo Router files in `src/app/` as thin route adapters only. Route files must only import and export a screen component.
- Put each app component or screen in its own PascalCase folder under `src/features/`.
- Enforce one React component per `*.tsx` component file. If a screen needs child components, create a `components/` folder inside that screen's folder and give each child its own folder and component file.
- Screen files must not declare child React components below the screen; extract every child component into its own named component folder.
- Split long screens into meaningful child components based on clear UI responsibilities (for example, a deck grid, an action panel, or an entry modal). Do not split merely to reduce line count.
- A component folder must contain `ComponentName.tsx`, `styles.ts`, `types.ts`, `constants.ts`, and `utils.ts`. Add exports or helpers only when they have a clear responsibility.
- Keep all React Native `StyleSheet` objects in `styles.ts`; do not declare styles in component files.
- Keep component-local values, copy, dimensions, delays, and limits in `constants.ts`. Do not use unexplained numeric or string literals in component logic.
- Keep pure transformations, validation, sorting, formatting, and selection logic in `utils.ts`.
- Do not define pure validation or transformation helpers inside a screen or component; place them in the owning feature's `utils.ts` instead.
- Move substantial asynchronous workflows, device APIs, and multi-step state orchestration into named hooks under the owning feature's `hooks/` folder. Screens should call those hooks rather than contain the workflow inline.
- Hooks must return their mode or phase enums. Screens must derive phase-based rendering and interaction conditions locally instead of receiving derived phase checks from hooks.
- Use React Context and named hooks for shared cross-route state. Never use module-level mutable variables or getter/setter functions as application state.
- Co-locate each shared-state hook, its context, and its provider under `src/features/<Domain>/use<Domain>/`, with dedicated `context/` and `provider/` folders.
- Keep public props, state shapes, and domain types in `types.ts`.
- Use enums for application modes and finite state values. Do not use plain string unions for these modes.
- Prefer named functions and typed props over inline logic when that improves readability. Keep route components and JSX focused on rendering and event wiring.
- Use explicit, responsibility-revealing names for variables and functions. Avoid vague or generic names that require reading the implementation to understand their purpose.
- When a function has multiple conditional branches, use explicit `if` / `else if` / `else` statements instead of chained or nested ternary expressions. Reserve ternaries for simple two-way choices.
- Do not leave commented-out code in the repository. Delete obsolete code once its replacement is active.
- Leave one blank line between `useEffect` / `useFocusEffect` calls, local functions, and event-handler declarations so component files remain easy to scan.
