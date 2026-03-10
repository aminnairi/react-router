# @aminnairi/react-router

Type-safe router for the React library

## Documentation

- [Requirements](#requirements)
- [Usage](#usage)
  - [Project initialization](#project-initialization)
  - [Dependencies installation](#dependencies-installation)
  - [Library installation](#library-installation)
  - [Setup](#setup)
  - [Startup](#startup)
- [API](#api)
  - [createPage](#createpage)
  - [useNavigateToPage](#usenavigatetopage)
  - [createRouter](#createrouter)
  - [useIsActivePage](#useisactivepage)
  - [useLocale](#uselocale)
  - [usePrefix](#useprefix)
  - [usePath](#usepath)
- [Features](#features)
  - [TypeScript](#typescript)
  - [No codegen](#no-codegen)
  - [Simplicity](#simplicity)
  - [Transition](#transition)
  - [Error handling](#error-handling)
- [License](#license)
- [Changelogs](#changelogs)
  - [Versions](#versions)
  - [3.0.0](#300)
  - [2.1.0](#210)
  - [2.0.1](#201)
  - [2.0.0](#200)
  - [1.1.0](#110)
  - [1.0.1](#101)
  - [1.0.0](#100)
  - [0.1.1](#011)
  - [0.1.0](#010)

## Requirements

- [Node](https://nodejs.org/)
- [NPM](https://npmjs.com/)

## Usage

### Project initialization

```bash
npm create vite -- --template react-ts project
cd project
```

### Dependencies installation

```bash
npm install
```

### Library installation

```bash
npm install @aminnairi/react-router
```

### Setup

```bash
mkdir src/router
mkdir src/router/pages
touch src/router/pages/home.tsx
```

```tsx
import { createPage } from "@aminnairi/react-router";

export const home = createPage({
  path: "/",
  element: function Home() {
    return <h1>Home page</h1>;
  },
});
```

```bash
touch src/router/fallback.tsx
```

```tsx
import { Fragment } from "react";
import { createPage, createRouter } from "@aminnairi/react-router";

export const home = createPage({
  path: "/",
  element: function Home() {
    return <h1>Home page</h1>;
  },
});

const { useNavigateToPage } = createRouter({
  fallback: () => <h1>Not found</h1>,
  issue: () => <h1>An error occurred</h1>,
  pages: [home],
});

export const Fallback = () => {
  const navigateToHomePage = useNavigateToPage(home);

  return <button onClick={navigateToHomePage}>Go back home</button>;
};
```

```bash
touch src/router/issue.tsx
```

```tsx
import { Fragment } from "react";
import { createPage, createRouter } from "@aminnairi/react-router";

export const home = createPage({
  path: "/",
  element: function Home() {
    return <h1>Home page</h1>;
  },
});

const { useNavigateToPage } = createRouter({
  fallback: () => <h1>Not found</h1>,
  issue: () => <h1>An error occurred</h1>,
  pages: [home],
});

export const Issue = () => {
  const navigateToHomePage = useNavigateToPage(home);

  return (
    <Fragment>
      <h1>An issue occurred</h1>
      <button onClick={navigateToHomePage}>Go back home</button>
    </Fragment>
  );
};
```

```bash
touch src/router/index.ts
```

```ts
import { createRouter } from "@aminnairi/react-router";
import { Fallback } from "./fallback";
import { Issue } from "./issue";
import { home } from "./pages/home";

export const { RouterProvider, RouterView } = createRouter({
  fallback: Fallback,
  issue: Issue,
  pages: [home],
});
```

```bash
touch src/App.tsx
```

```tsx
import { RouterView } from "./router";

export default function App() {
  return <RouterView />;
}
```

```bash
touch src/main.tsx
```

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "./router";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>,
);
```

### Startup

```bash
npm run dev
```

## API

### createPage

Creates a new page definition that can then later be used to create a router. It takes the path of the page to create as well as the element that needs to be rendered when a client navigates to this page.

```tsx
import { createPage } from "@aminnairi/react-router";

createPage({
  path: "/",
  element: function Home() {
    return <h1>Home</h1>;
  },
});
```

You can then inject the page inside a router.

```tsx
import { createPage, createRouter } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: function Home() {
    return <h1>Home</h1>;
  },
});

createRouter({
  fallback: () => <h1>Not found</h1>,
  issue: () => <h1>An error occurred</h1>,
  pages: [home],
});
```

You can define a page that has dynamic parameters, and get back into the element the needed parameters.

```tsx
import { createPage } from "@aminnairi/react-router";

createPage({
  path: "/users/:user",
  element: function User({ parameters: { user } }) {
    return <h1>User#{user}</h1>;
  },
});
```

And you can have of course more than one dynamic parameter.

```tsx
import { createPage } from "@aminnairi/react-router";

createPage({
  path: "/users/:user/articles/:article",
  element: function UserArticle({ parameters: { user, article } }) {
    return (
      <h1>
        Article#{article} of user#{user}
      </h1>
    );
  },
});
```

### useNavigateToPage

You can navigate from one page from another.

Note: This hook is returned from `createRouter`, not imported directly from the library.

```tsx
import { Fragment } from "react";
import { createPage, createRouter } from "@aminnairi/react-router";

const login = createPage({
  path: "/login",
  element: function Login() {
    return <h1>Login</h1>;
  },
});

const about = createPage({
  path: "/about",
  element: function About() {
    const navigateToLoginPage = useNavigateToPage(login);

    return (
      <Fragment>
        <h1>About Us</h1>
        <button onClick={navigateToLoginPage}>Login</button>
      </Fragment>
    );
  },
});

const { useNavigateToPage } = createRouter({
  fallback: () => <h1>Not found</h1>,
  issue: () => <h1>An error occurred</h1>,
  pages: [login, about],
});

createPage({
  path: "/",
  element: function Home() {
    const navigateToAboutPage = useNavigateToPage(about);

    return (
      <Fragment>
        <h1>Home</h1>
        <button onClick={navigateToAboutPage}>About Us</button>
      </Fragment>
    );
  },
});
```

And you can of course navigate to pages that have dynamic parameters as well.

```tsx
import { Fragment } from "react";
import { createPage, createRouter } from "@aminnairi/react-router";

const user = createPage({
  path: "/users/:user",
  element: function User({ parameters: { user } }) {
    return <h1>User#{user}</h1>;
  },
});

const { useNavigateToPage } = createRouter({
  fallback: () => <h1>Not found</h1>,
  issue: () => <h1>An error occurred</h1>,
  pages: [user],
});

createPage({
  path: "/",
  element: function Home() {
    const navigateToUserPage = useNavigateToPage(user);

    return (
      <Fragment>
        <h1>Home</h1>
        <button onClick={() => navigateToUserPage({ user: "123" })}>
          User#123
        </button>
      </Fragment>
    );
  },
});
```

### createRouter

Creates a router that you can then use to display the view, which is the page matching the current browser's location.

```tsx
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, createPage } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: function Home() {
    return <h1>Home</h1>;
  },
});

const { RouterProvider, RouterView } = createRouter({
  fallback: () => <h1>Not found</h1>,
  issue: () => <h1>An error occurred</h1>,
  pages: [home],
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

const App = () => {
  return (
    <Fragment>
      <header>
        <h1>App</h1>
      </header>
      <main>
        <RouterView />
      </main>
      <footer>Credit © Yourself 2025</footer>
    </Fragment>
  );
};

root.render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>,
);
```

You can also activate the View Transition Web API if you want before each page renders. This is nice because by default, the browser already has some styling that allows for a smooth and simple transition between pages.

All you have to do is to provide a `transition` function in the arguments of the `createRouter` function. This function receives the navigation direction (`"forward"` or `"backward"`) and a `next` callback to render the next page.

This library also exports several transitions that you can use out-of-the-box: `slideHorizontalTransition`, `slideVerticalTransition`, `crossFadeTransition`, and `scaleFadeTransition`.

```tsx
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createRouter,
  createPage,
  slideHorizontalTransition,
} from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: function Page() {
    return <h1>Home</h1>;
  },
});

const { RouterProvider, RouterView } = createRouter({
  transition: slideHorizontalTransition,
  fallback: () => <h1>Not found</h1>,
  issue: () => <h1>An error occurred</h1>,
  pages: [home],
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

const App = () => {
  return (
    <Fragment>
      <header>
        <h1>App</h1>
      </header>
      <main>
        <RouterView />
      </main>
      <footer>Credit © Yourself 2025</footer>
    </Fragment>
  );
};

root.render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>,
);
```

The `createRouter` takes a functional component that allow you to react to error in case a component throws. You can use the props to get a property `error` containing the error that has been thrown as well as a `reset` function that allow you to reset the error.

```tsx
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, createPage } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: function Home() {
    return <h1>Home</h1>;
  },
});

const { RouterProvider, RouterView } = createRouter({
  fallback: () => <h1>Not found</h1>,
  issue: ({ error, resetError }) => (
    <Fragment>
      <h1>Error</h1>
      <p>{error.message}</p>
      <button onClick={resetError}>Reset</button>
    </Fragment>
  ),
  pages: [home],
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

const App = () => {
  return (
    <Fragment>
      <header>
        <h1>App</h1>
      </header>
      <main>
        <RouterView />
      </main>
      <footer>Credit © Yourself 2025</footer>
    </Fragment>
  );
};

root.render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>,
);
```

You can also define the issue component from the outside.

```tsx
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, createPage } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: function Home() {
    return <h1>Home</h1>;
  },
});

const Fallback = () => {
  return <h1>Not found</h1>;
};

const Issue = ({ error, resetError }: { error: Error; resetError: () => void }) => (
  <Fragment>
    <h1>Error</h1>
    <p>{error.message}</p>
    <button onClick={resetError}>Reset</button>
  </Fragment>
);

const { RouterProvider, RouterView } = createRouter({
  fallback: Fallback,
  issue: Issue,
  pages: [home],
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

const App = () => {
  return (
    <Fragment>
      <header>
        <h1>App</h1>
      </header>
      <main>
        <RouterView />
      </main>
      <footer>Credit © Yourself 2025</footer>
    </Fragment>
  );
};

root.render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>,
);
```

You can use a prefix for your routes, useful if you need to publish this app in a scope like GitHub Pages.

You don't have to manually append this prefix when creating pages, its automatically added for you.

```tsx
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createRouter,
  createPage,
} from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: function Home() {
    return <h1>Home</h1>;
  },
});

const Fallback = () => {
  const navigateToHomePage = useNavigateToPage(home);

  return (
    <Fragment>
      <h1>Not found</h1>
      <button onClick={navigateToHomePage}>Go Back Home</button>
    </Fragment>
  );
};

const Issue = ({ error, resetError }: { error: Error; resetError: () => void }) => (
  <Fragment>
    <h1>Error</h1>
    <p>{error.message}</p>
    <button onClick={resetError}>Reset</button>
  </Fragment>
);

const { RouterProvider, RouterView, useNavigateToPage } = createRouter({
  prefix: "/portfolio",
  fallback: Fallback,
  issue: Issue,
  pages: [home],
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

const App = () => {
  return (
    <Fragment>
      <header>
        <h1>App</h1>
      </header>
      <main>
        <RouterView />
      </main>
      <footer>Credit © Yourself 2025</footer>
    </Fragment>
  );
};

root.render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>,
);
```

### useNavigateToPage

Allow you to create a function that can then be called to navigate to another page inside a React component.

It accepts a page that has been created using `createPage`.

Note: This hook is returned from `createRouter`, not imported directly from the library.

```tsx
import { Fragment } from "react";
import { createPage, createRouter } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: function Home() {
    return <h1>Home</h1>;
  },
});

const { useNavigateToPage } = createRouter({
  fallback: () => <h1>Not found</h1>,
  issue: () => <h1>An error occurred</h1>,
  pages: [home],
});

createPage({
  path: "/about",
  element: function About() {
    const navigateToHomePage = useNavigateToPage(home);

    return (
      <Fragment>
        <h1>About</h1>
        <button onClick={navigateToHomePage}>Home</button>
      </Fragment>
    );
  },
});
```

If this page has dynamic parameters, it forces you to provide them when called inside your component.

The parameters should always be provided as string, as they are the only data type that can be used inside a URL.

```tsx
import { Fragment } from "react";
import { createPage, createRouter } from "@aminnairi/react-router";

const user = createPage({
  path: "/users/:user",
  element: function User({ parameters: { user } }) {
    return <h1>User#{user}</h1>;
  },
});

createPage({
  path: "/about",
  element: function About() {
    const navigateToUserPage = useNavigateToPage(user);

    return (
      <Fragment>
        <h1>About</h1>
        <button onClick={() => navigateToUserPage({ user: "123" })}>
          Home
        </button>
      </Fragment>
    );
  },
});
```

### useIsActivePage

Allow you to check if a page is currently active.

Note: This hook is returned from `createRouter`, not imported directly from the library.

```tsx
// router/index.ts
import { createPage, createRouter } from "@aminnairi/react-router";

export const home = createPage({
  path: "/",
  element: function Home() {
    return <h1>Home</h1>;
  },
});

export const about = createPage({
  path: "/about",
  element: function About() {
    return <h1>About</h1>;
  },
});

export const { useIsActivePage } = createRouter({
  fallback: () => <h1>Not found</h1>,
  issue: () => <h1>An error occurred</h1>,
  pages: [home, about],
});
```

```tsx
// components/layout.tsx
import { Fragment } from "react";
import { useIsActivePage, useNavigateToPage } from "../router";
import { home, about } from "../router";

export default function Layout() {
  const isHomeActive = useIsActivePage(home);
  const isAboutActive = useIsActivePage(about);

  return (
    <Fragment>
      <nav>
        <button style={{ fontWeight: isHomeActive ? "bold" : "normal" }}>
          Home
        </button>
        <button style={{ fontWeight: isAboutActive ? "bold" : "normal" }}>
          About
        </button>
      </nav>
    </Fragment>
  );
}
```

### useLocale

Allow you to get and set the current locale for internationalization.

Note: This hook is returned from `createRouter`, not imported directly from the library.

```tsx
// router/index.ts
import { createPage, createRouter } from "@aminnairi/react-router";

export const home = createPage({
  path: "/",
  element: function Home() {
    return <h1>Home</h1>;
  },
});

export const { RouterProvider, RouterView, useLocale } = createRouter({
  locales: ["en", "fr"],
  fallback: () => <h1>Not found</h1>,
  issue: () => <h1>An error occurred</h1>,
  pages: [home],
});
```

```tsx
// components/layout.tsx
import { Fragment } from "react";
import { useLocale } from "../router";

export default function Layout() {
  const { locale, setLocale } = useLocale();

  return (
    <Fragment>
      <nav>
        <p>Current locale: {locale ?? "none"}</p>
        <button onClick={() => setLocale("en")}>English</button>
        <button onClick={() => setLocale("fr")}>Français</button>
      </nav>
    </Fragment>
  );
}
```

### usePrefix

Allow you to get the current route prefix.

Note: This hook is returned from `createRouter`, not imported directly from the library.

```tsx
// router/index.ts
import { createPage, createRouter } from "@aminnairi/react-router";

export const home = createPage({
  path: "/",
  element: function Home() {
    return <h1>Home</h1>;
  },
});

export const { RouterProvider, RouterView, usePrefix } = createRouter({
  prefix: "/portfolio",
  fallback: () => <h1>Not found</h1>,
  issue: () => <h1>An error occurred</h1>,
  pages: [home],
});
```

```tsx
// components/layout.tsx
import { Fragment } from "react";
import { usePrefix } from "../router";

export default function Layout() {
  const { prefix } = usePrefix();

  return (
    <Fragment>
      <nav>
        <p>Current prefix: {prefix ?? "none"}</p>
      </nav>
    </Fragment>
  );
}
```

### usePath

Allow you to get the current path.

Note: This hook is returned from `createRouter`, not imported directly from the library.

```tsx
// router/index.ts
import { createPage, createRouter } from "@aminnairi/react-router";

export const home = createPage({
  path: "/",
  element: function Home() {
    return <h1>Home</h1>;
  },
});

export const { RouterProvider, RouterView, usePath } = createRouter({
  fallback: () => <h1>Not found</h1>,
  issue: () => <h1>An error occurred</h1>,
  pages: [home],
});
```

```tsx
// components/layout.tsx
import { Fragment } from "react";
import { usePath } from "../router";

export default function Layout() {
  const { path } = usePath();

  return (
    <Fragment>
      <nav>
        <p>Current path: {path}</p>
      </nav>
    </Fragment>
  );
}
```

## Features

### TypeScript

This library has been written in TypeScript from the ground up, no manual definition types created, only pure TypeScript.

Type-safety has been the #1 goal, this means that you can fearlessly refactor your code without forgetting to update one part of your code that might break, types got you covered.

### No codegen

Code generation is useful in environment where multiple languages may be used, but in the case of a Web application written in TypeScript, there is no need for any codegen at all, thus reducing the surface of errors possibly generated by such tools, and greatly reducing complexity when setting up a router.

### Simplicity

This library does nothing more other than abstracting for your the complexity of using the History Web API, as well as providing you with type safety out of the box.

This means that you can use this library with other popular solutions for handling metadata for instance.

### Transition

Support for the View Transition API is built-in and allows for painless and smooth view transition out-of-the-box. You can create your own transition animation, and the library also exports several transitions ready to be used: `slideHorizontalTransition`, `slideVerticalTransition`, `crossFadeTransition`, and `scaleFadeTransition`.

### Error handling

Never fear having a blank page again when a component throws. This library lets you define a functional component that will answer to any error that might be raised by any pages so that you can react accordingly by providing a nice and friendly error page instead of a blank or white page.

## License

See [`LICENSE`](./LICENSE).

## Changelogs

### Versions

- [`3.0.1`](#301)
- [`3.0.0`](#300)
- [`2.1.0`](#210)
- [`2.0.1`](#201)
- [`2.0.0`](#200)
- [`1.1.0`](#110)
- [`1.0.1`](#101)
- [`1.0.0`](#100)
- [`0.1.1`](#011)
- [`0.1.0`](#010)

### 3.0.1

#### Major changes

None.

#### Minor changes

None.

#### Bug & security fixes

- Fixed incorrect imports in documentation - hooks like `useNavigateToPage`, `useIsActivePage`, `useLocale`, `usePrefix`, and `usePath` are returned from `createRouter` and should not be imported directly from the package

### 3.0.0

#### Major changes

- Full rewrite of the library implementation
- Added `locales` support for internationalization
- Added `useLocale` hook for locale management
- Added `usePrefix` and `usePath` hooks
- Renamed `slideFadeTransition` to `slideHorizontalTransition` and added new transitions: `scaleFadeTransition`, `crossFadeTransition`, `slideVerticalTransition`
- Changed API structure: `router.View` → `router.RouterView` and `router.Provider` → `RouterProvider`
- Renamed `reset` to `resetError` in `IssueProps`
- Renamed internal functions: `doesRouteMatchPath` → `matchPath`, `getParameters` → `matchParameters`
- Added `Uri` class for URL parsing
- Changed `createRouter` return value structure
- Removed `useLink`, `useSearch`, and `useHash` hooks and `UseLinkRenderFunction` type

#### Minor changes

- Added better URL normalization with `normalize` function
- Improved error handling with `ErrorBoundary` component

#### Bug & security fixes

- None.

### 2.1.0

#### Major changes

None.

#### Minor changes

- Added optional `render` parameter to `useLink` hook for custom render functions
- Added `UseLinkRenderFunction` type for custom render function signatures

#### Bug & security fixes

None.

### 2.0.1

#### Major changes

None.

#### Minor changes

- Now running a linter with eslint and TypeScript and a stricter configuration to prevent type errors

#### Bug & security fixes

- Fixed an error while the error boundary was not using an override when using a stricter typescript configuration

### 2.0.0

#### Major changes

- The `transition` property in `createRouter` is now a function instead of a boolean, which allows for more control over the animation. This is a breaking change.
- A `slideFadeTransition` is now exported and can be used directly.

#### Minor changes

None.

#### Bug & security fixes

None.

### 1.1.0

#### Major changes

None.

#### Minor changes

- Added a new `useLink` hook to create components that allow for navigating to another page

#### Bug & security fixes

None.

### 1.0.1

#### Major changes

None.

#### Minor changes

None.

#### Bug & security fixes

- Fixed an issue when navigating to a page that already starts with a slash

### 1.0.0

#### Major changes

- The arguments of `findPage` have moved from an object to regular arguments, with the first one being the path, and the second being the current route
- Removed the `page.navigate` property in favor of the new `useNavigateTo` hook
- The `createPage` now returns the page directly instead of exposing it in an object

#### Minor changes

- Added a `Provider` component from the created `router` which exposes variables for the children such as the location
- Added a new `useIsActivePage` hook for the created `router` which helps computing if a given page is active or not
- Added a new `useSearch` hook for the created `router` for getting search parameters from the current URL
- Added a new `useHash` hook for the created `router` for getting the URL fragment
- Added a new `sanitizePath` function for removing unecessary and extra slashes in a given string
- Added a new `useNavigateTo` hook that replaces the old `page.navigate` function
- Added a `prefix` property in order to use prefix for routes that need it like GitHub Pages

### 0.1.1

#### Major changes

None.

#### Minor changes

None.

#### Bug & security fixes

Fixed peer dependency for react.

### 0.1.0

#### Major changes

None.

#### Minor changes

None.

#### Bug & security fixes

None.
