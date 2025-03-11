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
  element: () => <h1>Home page</h1>
});
```

```bash
touch src/router/fallback.tsx
```

```tsx
import { home } from "./pages/home";

export const Fallback = () => {
  return (
    <button onClick={home.navigate}>
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
import { home } from "./pages/home";

export const Issue = () => {
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
  routes: [
    home.page
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
  element: () => (
    <h1>Home</h1>
  )
});
```

You can then inject the page inside a router.

```tsx
import { createPage, createRouter } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: () => (
    <h1>
      Home
    </h1>
  )
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
  pages: [
    home.page
  ]
});
```

You can define a page that has dynamic parameters, and get back into the element the needed parameters.

```tsx
import { createPage } from "@aminnairi/react-router";

createPage({
  path: "/users/:user",
  element: ({ parameters: { user }}) => (
    <h1>
      User#{user}
    </h1>
  )
});
```

And if you can have of course more than one dynamic parameter.

```tsx
import { createPage } from "@aminnairi/react-router";

createPage({
  path: "/users/:user/articles/:article",
  element: ({ parameters: { user, article }}) => (
    <h1>
      Article#{article } of user#{user}
    </h1>
  )
});
```

You can also navigate to one page from another.

```tsx
import { Fragment } from "react";
import { createPage } from "@aminnairi/react-router";

const login = createPage({
  path: "/login",
  element: () => (
    <h1>
      Login
    </h1>
  )
});

const about = createPage({
  path: "/about",
  element: () => (
    <Fragment>
      <h1>
        About Us
      </h1>
      <button onClick={() => login.navigate({})}>
      </button>
    </Fragment>
  )
});

createPage({
  path: "/",
  element: () => (
    <Fragment>
      <h1>
        Home
      </h1>
      <button onClick={about.navigate}>
        About Us
      </button>
    </Fragment>
  )
});
```

And you can of course navigate to pages that have dynamic parameters as well.

```tsx
import { Fragment } from "react";
import { createPage } from "@aminnairi/react-router";

const user = createPage({
  path: "/users/:user",
  element: ({ parameters: { user }}) => (
    <h1>
      User#{user}
    </h1>
  )
});

createPage({
  path: "/",
  element: () => (
    <Fragment>
      <h1>
        Home
      </h1>
      <button onClick={() => user.navigate({ user: "123" })}>
        User#123
      </button>
    </Fragment>
  )
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
  element: () => (
    <h1>Home</h1>
  )
});

const router = createRouter({
  fallback: () => (
    <h1>Not found</h1>
  ),
  issue: () => (
    <h1>An error occurred</h1>
  ),
  pages: [
    home.page
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

You can also activate the View Transition Web API if you want before each page renders. This is nice because by default, the browser already has some styling that allows for a smooth and simple transition between pages.

All you have to do is to set the `withViewTransition` property to `true` in the arguments of the `createRouter` function. By default, its value is set to `false` if not provided in the arguments of the `createRouter` function.

```tsx
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, createPage } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: () => (
    <h1>Home</h1>
  )
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
    home.page
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

The `createRouter` takes a functional component that allow you to react to error in case a component throws. You can use the props to get a property `error` containing the error that has been thrown as well as a `reset` function that allow you to reset the error.

```tsx
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, createPage } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: () => (
    <h1>Home</h1>
  )
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
    home.page
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

You can also define this function from the outside by using the `createIssue` function.

```tsx
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, createPage, createIssue } from "@aminnairi/react-router";

const home = createPage({
  path: "/",
  element: () => (
    <h1>Home</h1>
  )
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
    home.page
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

const foundPage = findPage({
  pages
});

if (foundPage) {
  console.log("Found a page matching the current location");
  console.log(foundPage.path);
} else {
  console.log("No page matching the current location.");
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

Support for the View Transition API is built-in and allows for painless and smooth view transition out-of-the-box without having to do anything.

This can also easily be disabled if needed.

### Error handling

Never fear having a blank page again when a component throws. This library lets you define a functional component that will answer to any error that might be raised by any pages so that you can react accordingly by providing a nice and friendly error page instead of a blank or white page.

## License

See [`LICENSE`](./LICENSE).