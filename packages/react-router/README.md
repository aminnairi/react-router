# @aminnairi/react-router

Type-safe router for the React library

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
    return (
      <h1>Home page</h1>
    );
  }
});
```

```bash
touch src/router/fallback.tsx
```

```tsx
import { useNavigateToPage } from "@aminnairi/react-router";
import { home } from "./pages/home";

export const Fallback = () => {
  const navigateToHomePage = useNavigateToPage(home);

  return (
    <button onClick={navigateToHomePage}>
      Go back home
    </button>
  );
}
```

```bash
touch src/router/issue.tsx
```

```tsx
import { Fragment } from "react";
import { useNavigateToPage } from "@aminnairi/react-router";
import { home } from "./pages/home";

export const Issue = () => {
  const navigateToHomePage = useNavigateToPage(home);

  return (
    <Fragment>
      <h1>An issue occurred</h1>
      <button onClick={home.navigate}>
        Go back home
      </button>
    </Fragment>
  );
}
```

```bash
touch src/router/index.ts
```

```tsx
import { createRouter } from "@aminnairi/react-router";
import { Fallback } from "./router/fallback";
import { Issue } from "./router/issue";
import { home } from "./router/pages/home";

export const router = createRouter({
  fallback: Fallback,
  issue: Issue,
  pages: [
    home
  ]
});
```

```bash
touch src/App.tsx
```

```tsx
import { router } from "./router";

export default function App() {
  return (
    <router.View />
  );
}
```

```bash
touch src/main.tsx
```

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./router";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <router.Provider>
      <App />
    </router.Provider>
  </StrictMode>
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
    return (
      <h1>Home</h1>
    );
  }
});
```

You can then inject the page inside a router.

```tsx
import { createPage, createRouter } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: function Home() {
    return (
      <h1>Home</h1>
    );
  }
});

createRouter({
  fallback: () => (
    <h1>
      Not found
    </h1>
  ),
  issue: () => (
    <h1>
      An error occurred
    </h1>
  ),
  pages: [home]
});
```

You can define a page that has dynamic parameters, and get back into the element the needed parameters.

```tsx
import { createPage } from "@aminnairi/react-router";

createPage({
  path: "/users/:user",
  element: function User({ parameters: { user }}) {
    return (
      <h1>User#{user}</h1>
    );
  }
});
```

And you can have of course more than one dynamic parameter.

```tsx
import { createPage } from "@aminnairi/react-router";

createPage({
  path: "/users/:user/articles/:article",
  element: function UserArticle({ parameters: { user, article }}) {
    return (
      <h1>Article#{article } of user#{user}</h1>
    );
  }
});
```

### useNavigateToPage

You can navigate from one page from another.

```tsx
import { Fragment } from "react";
import { createPage, useNavigateToPage } from "@aminnairi/react-router";

const login = createPage({
  path: "/login",
  element: function Login() {
    return (
      <h1>Login</h1>
    );
  }
});

const about = createPage({
  path: "/about",
  element: function About() {
    const navigateToLoginPage = useNavigateToPage(login);

    return (
      <Fragment>
        <h1>
          About Us
        </h1>
        <button onClick={navigateToLoginPage}>
          Login
        </button>
      </Fragment>
    );
  }
});

createPage({
  path: "/",
  element: function Home() {
    const navigateToAboutPage = useNavigateToPage(about);

    return (
      <Fragment>
        <h1>
          Home
        </h1>
        <button onClick={navigateToAboutPage}>
          About Us
        </button>
      </Fragment>
    );
  }
});
```

And you can of course navigate to pages that have dynamic parameters as well.

```tsx
import { Fragment } from "react";
import { createPage, useNavigateToPage } from "@aminnairi/react-router";

const user = createPage({
  path: "/users/:user",
  element: function User({ parameters: { user }}) {
    return (
      <h1>User#{user}</h1>
    );
  }
});

createPage({
  path: "/",
  element: function Home() {
    const navigateToUserPage = useNavigateToPage(user);

    return (
      <Fragment>
        <h1>
          Home
        </h1>
        <button onClick={() => navigateToUserPage({ user: "123" })}>
          User#123
        </button>
      </Fragment>
    );
  }
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
    return (
      <h1>Home</h1>
    );
  }
});

const router = createRouter({
  fallback: () => (
    <h1>Not found</h1>
  ),
  issue: () => (
    <h1>An error occurred</h1>
  ),
  pages: [
    home
  ]
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
        <router.View />
      </main>
      <footer>
        Credit © Yourself 2025
      </footer>
    </Fragment>
  );
}

root.render(
  <StrictMode>
    <router.Provider>
      <App />
    </router.Provider>
  </StrictMode>
);
```

You can also activate the View Transition Web API if you want before each page renders. This is nice because by default, the browser already has some styling that allows for a smooth and simple transition between pages.

All you have to do is to set the `withViewTransition` property to `true` in the arguments of the `createRouter` function. By default, its value is set to `false` if not provided in the arguments of the `createRouter` function.

```tsx
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, createPage } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: function Page() {
    return (
      <h1>Home</h1>
    );
  }
});

const router = createRouter({
  transition: true,
  fallback: () => (
    <h1>Not found</h1>
  ),
  issue: () => (
    <h1>An error occurred</h1>
  ),
  pages: [
    home
  ]
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
        <router.View />
      </main>
      <footer>
        Credit © Yourself 2025
      </footer>
    </Fragment>
  );
}

root.render(
  <StrictMode>
    <router.Provider>
      <App />
    </router.Provider>
  </StrictMode>
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
    return (
      <h1>Home</h1>
    );
  }
});

const router = createRouter({
  transition: true,
  fallback: () => (
    <h1>Not found</h1>
  ),
  issue: ({ error, reset }) => (
    return (
      <Fragment>
        <h1>Error</h1>
        <p>{error.message}</p>
        <button onClick={reset}>Reset</button>
      </Fragment>
    );
  ),
  pages: [
    home
  ]
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
        <router.View />
      </main>
      <footer>
        Credit © Yourself 2025
      </footer>
    </Fragment>
  );
}

root.render(
  <StrictMode>
    <router.Provider>
      <App />
    </router.Provider>
  </StrictMode>
);
```

You can also define this function from the outside by using the `createIssue` function.

```tsx
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, createPage, createIssue } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: function Home() {
    return (
      <h1>Home</h1>
    );
  }
});

const Fallback = () => {
  return (
    <h1>Not found</h1>
  );
}

const Issue = createIssue(({ error, reset }) => (
  return (
    <Fragment>
      <h1>Error</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Reset</button>
    </Fragment>
  );
));

const router = createRouter({
  transition: true,
  fallback: Fallback,
  issue: Issue,
  pages: [
    home
  ]
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
        <router.View />
      </main>
      <footer>
        Credit © Yourself 2025
      </footer>
    </Fragment>
  );
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

You can use a prefix for your routes, useful if you need to publish this app in a scope like GitHub Pages.

You don't have to manually append this prefix when creating pages, its automatically added for you.

```tsx
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, createPage, createIssue, useNavigateToPage } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: function Home() {
    return (
      <h1>Home</h1>
    );
  }
});

const Fallback = () => {
  const navigateToHomePage = useNavigateToPage(home);

  return (
    <Fragment>
      <h1>Not found</h1>
      <button onClick={navigateToHomePage}>
        Go Back Home
      </button>
    </Fragment>
  );
}

const Issue = createIssue(({ error, reset }) => (
  return (
    <Fragment>
      <h1>Error</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Reset</button>
    </Fragment>
  );
));

const router = createRouter({
  prefix: "/portfolio",
  transition: true,
  fallback: Fallback,
  issue: Issue,
  pages: [
    home
  ]
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
        <router.View />
      </main>
      <footer>
        Credit © Yourself 2025
      </footer>
    </Fragment>
  );
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### useNavigateToPage

Allow you to create a function that can then be called to navigate to another page inside a React component.

It accepts a page that has been created using `createPage`.

```tsx
import { Fragment } from "react";
import { createPage, useNavigateToPage } from "@aminnairi/react-router";

const home = createPath({
  path: "/",
  element: function Home() {
    return (
      <h1>Home</h1>
    );
  }
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
  }
});
```

If this page has dynamic parameters, it forces you to provide them when called inside your component.

The parameters should always be provided as string, as they are the only data type that can be used inside a URL.

```tsx
import { Fragment } from "react";
import { createPage, useNavigateToPage } from "@aminnairi/react-router";

const user = createPath({
  path: "/users/:user",
  element: function User({ parameters: { user }}) {
    return (
      <h1>User#{user}</h1>
    );
  }
});

createPage({
  path: "/about",
  element: function About() {
    const navigateToUserPage = useNavigateToPage(user);

    return (
      <Fragment>
        <h1>About</h1>
        <button onClick={() => navigateToUserPage({ user: "123" })}>Home</button>
      </Fragment>
    );
  }
});
```

### useSearch

Allow you to get one or more search query from the URL.

This will return an instance of the `URLSearchParams` Web API so that you can use you existing knowledge to manipulate the search queries easily.

```tsx
import { useMemo } from "react";
import { createPage, useSearch } from "@aminnairi/react-router";

createPage({
  path: "/users",
  element: function Home() {
    const [search] = useSearch();
    const sortedByDate = useMemo(() => search.get("sort-by") === "date", [search]);

    return (
      <h1>Users</h1>
      <p>Sorted by date: {sortedByDate ? "yes" : "no"}</p>
    );
  }
});
```

You cannot set the search queries for now, this will be added in future release of this library.

### useHash

Allow you to get the hash, also called fragment, from the URL which is everything after the `#` symbol.

```tsx
import { createPage, useHash } from "@aminnairi/react-router";

createPage({
  path: "/oauth/callback",
  element: function OauthCallback() {
    const token = useHash();

    return (
      <h1>You token is {token}</h1>
    );
  }
});
```

## Internal API

### doesRouteMatchPath

Return a boolean in case a route matches a path. A route is a URI that looks something like `/users/:user/articles` and a path is the browser's location pathname that looks something like `/users/123/articles`.

This function is mainly used in the internals of the `createRouter` and in most case should not be necessary.

```typescript
import { doesRouteMatchPath } from "@aminnairi/react-router";

doesRoutePatchPath("/", "/"); // true

doesRoutePatchPath("/", "/about"); // false

doesRoutePatchPath("/users/:user", "/users/123"); // true

doesRoutePatchPath("/users/:user", "/users/123/articles"); // false
```

You can also optionally provide a prefix.

```typescript
import { doesRouteMatchPath } from "@aminnairi/react-router";

doesRoutePatchPath("/", "/github", "/github"); // true

doesRoutePatchPath("/", "/github/about", "/github"); // false

doesRoutePatchPath("/users/:user", "/github/users/123", "/github"); // true

doesRoutePatchPath("/users/:user", "/github/users/123/articles", "/github"); // false
```

### getParameters

Return an object in case a route matches a path, with its dynamic parameters as output. It returns a generic `object` type in case no dynamic parameters are found in the URI. Note that the parameters are always strings, if you need to, convert them to other types explicitely.

This function is mainly used in the internals of the `createRouter` and in most case should not be necessary.

```typescript
import { getParameters } from "@aminnairi/react-router";

getParameters("/", "/"); // object

getParameters("/", "/about"); // object

getParameters("/users/:user", "/users/123"); // { user: "123" }

getParameters("/users/:user", "/users/123/articles"); // { user: "123" }
```

You can also provide an optional prefix.

```typescript
import { getParameters } from "@aminnairi/react-router";

getParameters("/", "/github", "/github"); // object

getParameters("/", "/github/about", "/github"); // object

getParameters("/users/:user", "/github/users/123", "/github"); // { user: "123" }

getParameters("/users/:user", "/github/users/123/articles", "/github"); // { user: "123" }
```

### findPage

Return a page that matches the `window.location.pathname` property containing the current URI of the page from an array of pages.

If it does not match any pages, it returns `undefined` instead.

This function is mainly used in the internals of the `createRouter` and in most case should not be necessary.

```tsx
import { findPage, createPage } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: () => <h1>Home</h1>
});

const about = createPage({
  path: "/about",
  element: () => <h1>About</h1>
});

const login = createPage({
  path: "/login",
  element: () => <h1>Login</h1>
});

const pages = [
  home.page,
  about.page,
  login.page
];

const foundPage = findPage(pages, "/login");

if (foundPage) {
  console.log("Found a page matching the current location");
  console.log(foundPage.path);
} else {
  console.log("No page matching the current location.");
}
```

You can also provide an optional prefix.

```tsx
import { findPage, createPage } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: () => <h1>Home</h1>
});

const about = createPage({
  path: "/about",
  element: () => <h1>About</h1>
});

const login = createPage({
  path: "/login",
  element: () => <h1>Login</h1>
});

const pages = [
  home.page,
  about.page,
  login.page
];

const foundPage = findPage(pages, "/github/login", "/github");

if (foundPage) {
  console.log("Found a page matching the current location");
  console.log(foundPage.path);
} else {
  console.log("No page matching the current location.");
}
```

### sanitizePath

Internal function that helps normalizing the URL by removing trailing and leading slashes as well as removing any duplicate and unecessary slashes.

```ts
import { sanitizePath } from "@aminnairi/react-router";

sanitizePath("/"); // "/"

sanitizePath("users"); // "/users"

sanitizePath("users/"); // "/users"

sanitizePath("users//123///articles"); // "/users/123/articles"
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

Support for the View Transition API is built-in and allows for painless and smooth view transition out-of-the-box without having to do anything.

This can also easily be disabled if needed.

### Error handling

Never fear having a blank page again when a component throws. This library lets you define a functional component that will answer to any error that might be raised by any pages so that you can react accordingly by providing a nice and friendly error page instead of a blank or white page.

## License

See [`LICENSE`](./LICENSE).

## Changelogs

### Versions

- [`0.1.1`](#011)
- [`0.1.0`](#010)

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