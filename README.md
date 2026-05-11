# Advanced React & JavaScript — Knowledge Base README

> **Purpose:** This file is a structured knowledge reference for an AI coding assistant (Claude Code / Codex).
> Use it to guide implementation decisions, remind yourself of best practices, and resolve common pitfalls
> when working on React projects.
>
> **How to use:** Reference the relevant section before generating code. Each section includes
> a summary, key concepts, and common mistakes to avoid.

---

## Table of Contents

1. [JavaScript Async Foundations](#1-javascript-async-foundations)
2. [React State Management](#2-react-state-management)
3. [React Hooks — Core](#3-react-hooks--core)
4. [React Hooks — Advanced](#4-react-hooks--advanced)
5. [Data Fetching & API Integration](#5-data-fetching--api-integration)
6. [Component Architecture Patterns](#6-component-architecture-patterns)
7. [React Router v6](#7-react-router-v6)
8. [Performance Optimization](#8-performance-optimization)
9. [Common Mistakes & Pitfalls](#9-common-mistakes--pitfalls)
10. [Project Architecture & Folder Structure](#10-project-architecture--folder-structure)
11. [Dev Tools & Mocking](#11-dev-tools--mocking)

---

## 1. JavaScript Async Foundations

### Error Handling — try / catch / finally
- Wrap risky code in `try` blocks; `catch` receives the thrown error object.
- `finally` always runs (cleanup, spinners off, etc.) regardless of success or failure.
- Use `throw new Error("message")` to create custom errors.

### Promises
| State | Meaning |
|-------|---------|
| `pending` | Initial state, not yet resolved or rejected |
| `resolved` | Operation completed successfully |
| `rejected` | Operation failed |

```js
// Chaining
fetch(url)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Parallel execution
const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);
```

### async / await
- `async` functions always return a Promise.
- `await` pauses execution inside the function until the Promise resolves.
- Wrap in `try/catch` for error handling — this replaces `.catch()`.

```js
async function loadData() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to load:", err);
  }
}
```

### Fetch API
- Returns a Promise that resolves to a `Response` object.
- **Important:** `fetch` only rejects on network failure, NOT on 4xx/5xx status codes.
- Always check `response.ok` manually.

```js
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
const data = await res.json();
```

---

## 2. React State Management

### useState — Rules & Best Practices

```js
const [count, setCount] = useState(0);
```

- **Never mutate state directly.** Always use the setter function.
- For updates that depend on the previous value, use the functional form:
  ```js
  setCount(prev => prev + 1); // ✅ correct
  setCount(count + 1);        // ❌ risky — may use stale value
  ```
- For objects/arrays, use the spread operator to maintain immutability:
  ```js
  setUser(prev => ({ ...prev, name: "Alice" }));
  setItems(prev => [...prev, newItem]);
  ```

### Choosing State Structure — Best Practices

| Rule | Description |
|------|-------------|
| **Group related state** | If two values always change together, put them in one object |
| **Avoid contradictions** | Replace multiple booleans with a single `status` string |
| **Avoid redundant state** | Compute derived values during render, don't store them |
| **Avoid duplication** | Store IDs/references, not full copied objects |
| **Avoid deep nesting** | Keep state flat and normalized for easier updates |

### Lifting State Up
When multiple components need to share the same data:
1. Remove local state from children.
2. Move it to the **closest common parent**.
3. Pass state and updater functions down as props.
4. Children become **controlled components**.

### Preserving & Resetting State
- React preserves state when a component stays in the **same position** in the tree.
- State is **destroyed** when the component is removed or replaced by a different type.
- To force a reset at the same position, change the `key` prop:
  ```jsx
  <UserForm key={userId} />  {/* resets every time userId changes */}
  ```

### useReducer — Complex State

Use `useReducer` over `useState` when:
- State logic is complex or multi-step.
- Next state depends heavily on previous state.
- Multiple sub-values are updated together.

```js
function reducer(state, action) {
  switch (action.type) {
    case "increment": return { count: state.count + 1 };
    case "reset":     return { count: 0 };
    default:          throw new Error("Unknown action: " + action.type);
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: "increment" });
```

---

## 3. React Hooks — Core

### useEffect

```js
useEffect(() => {
  // side effect logic here

  return () => {
    // cleanup (runs on unmount or before next effect)
  };
}, [dependency]);
```

| Dependency Array | When Effect Runs |
|-----------------|-----------------|
| Omitted | After every render |
| `[]` | Once on mount only |
| `[a, b]` | When `a` or `b` changes |

**Critical rules:**
- Don't put objects/arrays created inside the component into the dependency array without `useMemo` — they cause infinite loops.
- Don't fetch data directly in `useEffect` for production — use React Query or SWR instead.
- Always clean up subscriptions, timers, and event listeners.

### useContext — Avoiding Prop Drilling

```js
// 1. Create
const ThemeContext = createContext(null);

// 2. Provide
<ThemeContext.Provider value={theme}>
  <App />
</ThemeContext.Provider>

// 3. Consume (anywhere in the tree)
const theme = useContext(ThemeContext);
```

### useRef

Two primary use cases:

1. **DOM access** — does not trigger re-render:
   ```js
   const inputRef = useRef(null);
   inputRef.current.focus();
   ```

2. **Persist mutable values** across renders without re-rendering:
   ```js
   const renderCount = useRef(0);
   renderCount.current += 1;  // silent — no re-render
   ```

**Key difference from `useState`:** Changing `.current` does NOT trigger a re-render.

---

## 4. React Hooks — Advanced

### useMemo — Caching Expensive Computations

```js
const expensiveResult = useMemo(() => {
  return heavyCalculation(a, b);
}, [a, b]);
```

- Also stabilizes object/array **references** across renders (prevents downstream re-renders or useEffect loops).
- Only use when the computation is genuinely expensive — premature optimization adds noise.

### Custom Hooks — Extracting Reusable Logic

- Must start with `use` prefix.
- Can use other hooks internally.
- Encapsulate stateful logic (fetching, form handling, timers) for reuse across components.

```js
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); });
  }, [url]);

  return { data, loading };
}
```

### Compound Components Pattern

Used for flexible, reusable UI (Tabs, Accordions, Dropdowns):
- Parent manages shared internal state via Context.
- Sub-components consume that context.
- Consumer controls structure; component controls logic.
- Achieves **Inversion of Control**.

---

## 5. Data Fetching & API Integration

### Pattern: Fetch on Mount

```js
useEffect(() => {
  async function load() {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
  }
  load();
}, []); // empty array = fetch once on mount
```

### Generic API Utility Function

```js
async function apiRequest(url, method = "GET", body = null) {
  const options = {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : null,
  };
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`${method} ${url} failed: ${res.status}`);
    return method === "DELETE" ? null : await res.json();
  } catch (err) {
    console.error("API error:", err);
    throw err;
  } finally {
    // e.g., setLoading(false)
  }
}
```

### Optimistic UI Updates
Update local state immediately for perceived speed, then sync with the server in the background. Roll back on error.

### Axios vs Fetch

| Feature | fetch | axios |
|---------|-------|-------|
| Built-in | ✅ | ❌ (install required) |
| Auto JSON parse | ❌ (manual `.json()`) | ✅ |
| Throws on 4xx/5xx | ❌ (manual `res.ok` check) | ✅ |
| Centralized config | ❌ | ✅ via `axios.create()` |

```js
// Axios instance (recommended pattern)
const api = axios.create({
  baseURL: "https://api.example.com",
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});
```

---

## 6. Component Architecture Patterns

### Container vs Presentational Components

| Type | Responsibility |
|------|---------------|
| **Container** (Smart) | Fetches data, manages state, holds business logic |
| **Presentational** (Dumb) | Renders UI only, receives everything via props |

### Controlled vs Uncontrolled Inputs

| Type | State managed by | How to read value |
|------|-----------------|------------------|
| Controlled | React (`useState`) | `value` + `onChange` |
| Uncontrolled | DOM | `useRef` + `.current.value` |

```jsx
// Controlled (preferred)
<input value={name} onChange={e => setName(e.target.value)} />

// Uncontrolled (use for non-React integrations)
<input ref={inputRef} defaultValue="initial" />
```

### Props vs State

| | Props | State |
|---|-------|-------|
| Mutability | Immutable (from parent) | Mutable (local) |
| Ownership | Parent | Component itself |
| Change trigger | Parent re-renders | Setter function |

---

## 7. React Router v6

### Core Setup

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "contacts/:id",
        element: <Contact />,
        loader: contactLoader,
        action: contactAction,
      },
    ],
  },
]);

<RouterProvider router={router} />
```

### Key Components & Hooks

| API | Purpose |
|-----|---------|
| `<Outlet />` | Renders matched child route inside a layout |
| `<Link to="...">` | Client-side navigation anchor |
| `<NavLink>` | Like Link, adds `isActive` class/style for current route |
| `<Navigate to="...">` | Declarative redirect in JSX |
| `useParams()` | Read dynamic URL segments (`:id`) |
| `useNavigate()` | Programmatic navigation (`navigate(-1)` = go back) |
| `useSearchParams()` | Read/write query string like `useState` |
| `useLocation()` | Access full location object (pathname, state, etc.) |
| `useFetcher()` | Run actions/loaders without full navigation |
| `useNavigation()` | Track in-flight navigation state (`idle`, `loading`, `submitting`) |
| `useLoaderData()` | Access data returned by the route's `loader` function |
| `useRouteError()` | Access error inside `errorElement` |

### Route Matching Priority
Routes are scored automatically — no manual ordering needed:
```
/teams/new  >  /teams/:id  >  /teams/*
(static)       (dynamic)      (wildcard)
```

### Data Loading Pattern (v6.4+)

```js
// Loader — runs before component renders
export async function contactLoader({ params }) {
  const contact = await fetchContact(params.id);
  if (!contact) throw new Response("Not Found", { status: 404 });
  return contact;
}

// In component
const contact = useLoaderData();
```

### Navigation State (invisible URL data)
```jsx
<Link to="/profile" state={{ from: "dashboard" }}>Go</Link>

// In destination
const { state } = useLocation();
console.log(state.from); // "dashboard"
```

---

## 8. Performance Optimization

### When to Use useMemo / useCallback

Use them when:
- A computation is measurably expensive.
- An object/array reference is in a `useEffect` dependency array.
- A function is passed to a memoized child component (`React.memo`).

Do NOT use them everywhere — they add overhead and reduce readability.

### Avoiding Infinite useEffect Loops

```js
// ❌ WRONG — object is recreated every render → always "new" reference
const options = { page: 1 };
useEffect(() => { fetch(options); }, [options]);

// ✅ CORRECT — stabilize with useMemo
const options = useMemo(() => ({ page: 1 }), []);
useEffect(() => { fetch(options); }, [options]);
```

### Fetch Race Conditions — AbortController

```js
useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(err => {
      if (err.name !== "AbortError") console.error(err);
    });

  return () => controller.abort(); // cancel on unmount / dep change
}, [url]);
```

---

## 9. Common Mistakes & Pitfalls

### useState Mistakes

| Mistake | Fix |
|---------|-----|
| `setState(count + 1)` when dependent on previous | `setState(prev => prev + 1)` |
| Mutating objects directly (`state.name = "x"`) | Spread: `setState({ ...state, name: "x" })` |
| Storing derived values in state | Compute during render instead |
| Using `useState` for values that don't affect UI | Use `useRef` instead |
| Reading state immediately after setting | Use `useEffect` to react to changes |

### useEffect Mistakes

| Mistake | Fix |
|---------|-----|
| Missing dependency causes stale closure | Add all values used inside to the dep array |
| Object/array in dep array causes loop | Wrap with `useMemo`, or move outside component |
| No cleanup for subscriptions/timers | Return cleanup function |
| Fetching directly in useEffect in production | Use React Query, SWR, or Next.js Server Components |
| Syncing state via useEffect | Compute derived state during render |

### Top 6 Hook Mistakes (Web Dev Simplified)

1. **Unnecessary State** — use `useRef` for values that don't trigger re-render.
2. **Functional Updates** — always use `prev =>` form when new state depends on old.
3. **Async State** — don't read state immediately after setting; use `useEffect`.
4. **Derived State** — don't sync with `useEffect`; compute during render.
5. **Referential Equality** — use `useMemo`/`useCallback` for objects/functions in dep arrays.
6. **Fetch Race Conditions** — use `AbortController` for cleanup.

---

## 10. Project Architecture & Folder Structure

### Beginner (flat)
```
src/
  components/
  App.jsx
  index.js
```

### Intermediate (type-based)
```
src/
  components/
  hooks/
  services/
  utils/
  pages/
```

### Advanced (feature-based — recommended for large apps)
```
src/
  features/
    auth/
      components/
      hooks/
      api.js
      index.js       ← Facade / barrel export
    dashboard/
  shared/
    components/
    hooks/
    utils/
  lib/               ← Third-party wrappers (Facade Pattern)
  pages/             ← Route-level components only
```

**Key principles:**
- **Colocation** — keep tests, styles, and assets next to the code they relate to.
- **Facade Pattern** — wrap third-party libraries in `lib/` so you can swap them without touching the rest of the app.
- **Feature barrel exports** — `features/auth/index.js` exposes only the public API of that feature.

---

## 11. Dev Tools & Mocking

### JSON Server — Mock REST API

```bash
npx json-server --watch db.json --port 3001
```

`db.json` example:
```json
{
  "posts": [{ "id": 1, "title": "Hello", "userId": 1 }],
  "users": [{ "id": 1, "name": "Alice" }]
}
```

Auto-generated RESTful routes:
| Method | URL | Action |
|--------|-----|--------|
| GET | `/posts` | List all |
| GET | `/posts/1` | Get one |
| POST | `/posts` | Create |
| PATCH | `/posts/1` | Update |
| DELETE | `/posts/1` | Delete |

### JSONPlaceholder — Public Fake API

Base URL: `https://jsonplaceholder.typicode.com`

Available endpoints: `/users`, `/posts`, `/comments`, `/todos`, `/albums`, `/photos`

**Important caveat:** POST/PUT/DELETE requests return a successful-looking response but do **not** actually persist data. Use for GET requests and UI testing only. For full CRUD testing, use `json-server` locally.

```js
// Example: fetch a todo
const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
const todo = await res.json();
// { userId: 1, id: 1, title: "...", completed: false }
```

---

## Quick Reference — Hook Decision Tree

```
Need to render UI value that changes?
  └─ useState

Need to run a side effect (fetch, timer, subscription)?
  └─ useEffect (with proper cleanup)

Need to share state deep in the tree without prop drilling?
  └─ useContext

Need a mutable value that persists across renders without re-render?
  └─ useRef

Need to cache an expensive computed value?
  └─ useMemo

Need complex state with multiple actions?
  └─ useReducer

Need to reuse stateful logic across components?
  └─ Custom Hook (name must start with "use")
```

---

*This README was generated from course notes covering Advanced React. Sections map 1:1 to source topics.*
