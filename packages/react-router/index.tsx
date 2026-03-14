import { Component, createContext, type Dispatch, type FunctionComponent, type ReactNode, type SetStateAction, useCallback, useContext, useEffect, useEffectEvent, useMemo, useState } from "react";

export interface IssueProps {
  error: Error | null,
  resetError: () => void
}

export interface Router<Path extends string, Locale> {
  prefix?: string
  locales?: Locale[]
  transition?: Transition
  fallback: FunctionComponent
  issue: FunctionComponent<IssueProps>
  pages: Array<Page<Path>>
}

export interface RouterProviderProps {
  children: ReactNode
}

export interface RouterContextInterface<Locale> {
  locale: Locale | null
  prefix: string | null
  path: string
  setLocale: Dispatch<SetStateAction<Locale | null>>
}

export type NavigationDirection = "forward" | "backward";

function normalize(uri: string) {
  return uri
    .trim()
    .toLowerCase()
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/$/g, "");
}

function matchPath(path: string, pathname: string) {
  const pathParts = normalize(path).split("/").filter(Boolean);
  const pathnameParts = normalize(pathname).split("/").filter(Boolean);

  return pathParts.length === pathnameParts.length && pathParts.every((pathPart, index) => {
    return pathPart.startsWith(":") || pathPart === pathnameParts.at(index);
  });
}

function matchParameters(path: string, pathname: string): Record<string, string> {
  const pathParts = normalize(path).split("/").filter(Boolean);
  const pathnameParts = normalize(pathname).split("/").filter(Boolean);

  if (pathParts.length !== pathnameParts.length) {
    return {};
  }

  return pathParts.reduce((parameters, pathPart, index) => {
    if (!pathPart.startsWith(":")) {
      return parameters;
    }

    return {
      ...parameters,
      [pathPart.slice(1)]: pathnameParts.at(index) ?? ""
    }
  }, {});
}

export class Uri<Locale> {
  private constructor(public readonly path: string, public readonly prefix: string | null, public readonly locale: Locale | null) { }

  public static from<Locale>(uri: string, expectedPrefix?: string, expectedLocales?: Locale[]): Uri<Locale> {
    const [prefixOrLocale, localeOrNothing, ...parts] = normalize(uri).split("/");
    const locales = expectedLocales ?? [];

    if (expectedPrefix && prefixOrLocale && prefixOrLocale === normalize(expectedPrefix)) {
      const locale = locales.find(expectedLocale => expectedLocale === localeOrNothing);

      if (locale) {
        return new Uri<Locale>(
          parts.join("/"),
          prefixOrLocale,
          locale,
        );
      }

      return new Uri<Locale>(
        [localeOrNothing, ...parts].join("/"),
        prefixOrLocale,
        null
      );
    }

    const locale = locales.find(expectedLocale => expectedLocale === prefixOrLocale);

    if (locale) {
      return new Uri<Locale>(
        [localeOrNothing, ...parts].join("/"),
        null,
        locale
      );
    }

    return new Uri<Locale>(
      [prefixOrLocale, localeOrNothing, ...parts].join("/"),
      null,
      null
    );
  }
}

export type ExtractParams<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
  ? Param | ExtractParams<Rest>
  : Path extends `${string}:${infer Param}`
  ? Param
  : never

export type Params<Path extends string> = {
  [Key in ExtractParams<Path>]: string
}

export interface PageParams<Path extends string> {
  parameters: Params<Path>
}

export interface Page<Path extends string> {
  path: Path
  element: FunctionComponent<PageParams<Path>>
}

interface ErrorBoundaryProps {
  children: ReactNode;
  issue: FunctionComponent<IssueProps>;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, IssueProps> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      error: null,
      resetError: this.resetError.bind(this)
    };
  }

  private resetError() {
    this.setState({ error: null });
  }

  public static getDerivedStateFromError(error: Error) {
    return {
      error
    };
  }

  public override componentDidCatch(error: unknown) {
    this.setState({
      error: error instanceof Error ? error : new Error(String(error))
    });
  }

  public override render() {
    if (this.state.error) {
      const Issue = this.props.issue;

      return <Issue error={this.state.error} resetError={this.state.resetError} />;
    }

    return this.props.children;
  }
}

export function createPage<Path extends string>(page: Page<Path>): Page<Path> {
  return {
    ...page,
    path: normalize(page.path) as Path
  };
}

export type Transition = (direction: "forward" | "backward", next: () => void) => void;

export const scaleFadeTransition: Transition = async (direction: NavigationDirection, next) => {
  try {
    const transition = document.startViewTransition(() => {
      next();
    });

    await transition.ready;

    document.documentElement.animate(
      [
        {
          transform: 'scale(1)',
          opacity: 1
        },
        {
          transform: direction === "forward" ? "scale(1.04)" : "scale(0.96)",
          opacity: 0
        }
      ],
      {
        duration: 200,
        easing: "ease-in-out",
        fill: "both",
        pseudoElement: `::view-transition-old(root)`,
      }
    );

    document.documentElement.animate(
      [
        {
          transform: direction === "forward" ? "scale(0.96)" : "scale(1.04)",
          opacity: 0
        },
        {
          transform: 'scale(1)',
          opacity: 1
        }
      ],
      {
        duration: 200,
        easing: "ease-in-out",
        fill: "both",
        pseudoElement: `::view-transition-new(root)`,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

export const crossFadeTransition: Transition = async (direction: NavigationDirection, next) => {
  try {
    const transition = document.startViewTransition(() => {
      next();
    });

    await transition.ready;

    document.documentElement.animate(
      [
        { opacity: 1 },
        { opacity: 0 }
      ],
      {
        duration: 200,
        easing: "ease-in-out",
        fill: "both",
        pseudoElement: `::view-transition-old(root)`,
      }
    );

    document.documentElement.animate(
      [
        { opacity: 0 },
        { opacity: 1 }
      ],
      {
        duration: 200,
        easing: "ease-in-out",
        fill: "both",
        pseudoElement: `::view-transition-new(root)`,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

export const slideHorizontalTransition: Transition = async (direction: NavigationDirection, next) => {
  try {
    const transition = document.startViewTransition(() => {
      next();
    });

    await transition.ready;

    document.documentElement.animate(
      [
        { transform: 'translateX(0)' },
        { transform: direction === "forward" ? 'translateX(-100%)' : 'translateX(100%)' }
      ],
      {
        duration: 200,
        easing: "ease-in-out",
        fill: "both",
        pseudoElement: `::view-transition-old(root)`,
      }
    );

    document.documentElement.animate(
      [
        { transform: direction === "forward" ? 'translateX(100%)' : 'translateX(-100%)' },
        { transform: 'translateX(0)' }
      ],
      {
        duration: 200,
        easing: "ease-in-out",
        fill: "both",
        pseudoElement: `::view-transition-new(root)`,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

export const slideVerticalTransition: Transition = async (direction: NavigationDirection, next) => {
  try {
    const transition = document.startViewTransition(() => {
      next();
    });

    await transition.ready;

    document.documentElement.animate(
      [
        { transform: 'translateY(0)' },
        { transform: direction === "forward" ? 'translateY(-100%)' : 'translateY(100%)' }
      ],
      {
        duration: 200,
        easing: "ease-in-out",
        fill: "both",
        pseudoElement: `::view-transition-old(root)`,
      }
    );

    document.documentElement.animate(
      [
        { transform: direction === "forward" ? 'translateY(100%)' : 'translateY(-100%)' },
        { transform: 'translateY(0)' }
      ],
      {
        duration: 200,
        easing: "ease-in-out",
        fill: "both",
        pseudoElement: `::view-transition-new(root)`,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

export function createRouter<Locale extends string = never, Path extends string = never>({ prefix: expectedPrefix, locales, pages, fallback: Fallback, issue: Issue, transition }: Router<Path, Locale>) {
  const RouterContext = createContext<RouterContextInterface<Locale>>({
    locale: null,
    prefix: null,
    path: "/",
    setLocale: () => { },
  });


  function useIsActivePage<P extends Path>(page: Page<P>): boolean {
    const { path } = usePath();
    return matchPath(page.path, path);
  }

  function useLocale() {
    const context = useContext(RouterContext);

    if (!context) {
      throw new Error("component using the useLocale hook has not been wrapped inside RouterProvider.");
    }

    return {
      locale: context.locale,
      setLocale: (locale: Locale) => {
        if (!locales?.includes(locale)) {
          return;
        }

        window.history.pushState(null, "", `/${normalize(`${context.prefix ?? ""}/${locale}/${context.path}`)}`);
        window.dispatchEvent(new Event("pushstate"));
      }
    }
  }

  function usePrefix() {
    const context = useContext(RouterContext);

    if (!context) {
      throw new Error("Component using the usePrefix hook has not been wrapped inside RouterProvider");
    }

    return {
      prefix: context.prefix
    };
  }

  function usePath() {
    const context = useContext(RouterContext);

    if (!context) {
      throw new Error("Component using the usePath hook has not been wrapped inside RouterProvider");
    }

    return {
      path: context.path,
    };
  }

  function useNavigateToPage<P extends Path>(page: Page<P>) {
    const { locale } = useLocale();
    const { prefix } = usePrefix();

    return useCallback((...[params]: ExtractParams<P> extends never ? [] : [Params<P>]) => {
      const path = Object.entries(params ?? {}).reduce<string>((oldParams, [name, value]) => {
        return oldParams.replace(`:${name}`, String(value));
      }, page.path);

      const pathname = `/${normalize(`${prefix ?? ""}/${locale ?? ""}/${path}`)}`

      console.log({ pathname });

      window.history.pushState(null, "", pathname);
      window.dispatchEvent(new Event("pushstate"));
    }, [page, locale, prefix]);
  }

  function RouterProvider({ children }: RouterProviderProps) {
    const uri = useMemo(() => Uri.from(window.location.pathname, expectedPrefix, locales), []);
    const [locale, setLocale] = useState(uri.locale);
    const [path, setPath] = useState(uri.path);
    const [prefix, setPrefix] = useState(uri.prefix);

    function setHash(newHash: string) {
      window.location.hash = newHash;
    }

    const value = useMemo(() => {
      return {
        locale,
        path,
        prefix: prefix ?? null,
        setLocale,
        setHash,
      };
    }, [locale, prefix, path]);

    const onNavigation = useEffectEvent((direction: NavigationDirection) => {
      const pathname = normalize(window.location.pathname);
      const uri = Uri.from(pathname, expectedPrefix, locales);

      const defaultTransition: Transition = (_, next) => {
        next();
      }

      const currentTransition: Transition = transition ?? defaultTransition;

      currentTransition(direction, () => {
        setLocale(uri.locale);
        setPath(uri.path);
        setPrefix(uri.prefix);
      });
    });

    const onMount = useEffectEvent(() => {
      const pathname = `/${normalize(window.location.pathname)}`;
      const uri = Uri.from(pathname, expectedPrefix, [locale, ...locales ?? []]);
      const newPathname = `/${normalize(`${uri.prefix ?? expectedPrefix ?? ""}/${uri.locale ?? locales?.at(0) ?? ""}/${uri.path}`)}`;

      if (newPathname !== pathname) {
        window.history.pushState(null, "", newPathname);
        window.dispatchEvent(new Event("pushstate"));
      }
    });

    useEffect(() => {
      const abortController = new AbortController();

      window.addEventListener("pushstate", () => {
        onNavigation("forward");
      }, abortController);

      window.addEventListener("popstate", () => {
        onNavigation("backward");
      }, abortController);

      onMount();

      return () => {
        abortController.abort();
      };
    }, [onMount, onNavigation]);

    return (
      <RouterContext.Provider value={value}>
        {children}
      </RouterContext.Provider>
    );
  }

  function RouterView() {
    const { path } = usePath();

    const foundPage = useMemo(() => {
      return pages.find(page => {
        return matchPath(page.path, path);
      });
    }, [path]);

    if (foundPage) {
      return (
        <ErrorBoundary issue={Issue}>
          <foundPage.element parameters={matchParameters(foundPage.path, path) as Params<Path>} />
        </ErrorBoundary>
      );
    }

    return (
      <ErrorBoundary issue={Issue}>
        <Fallback />
      </ErrorBoundary>
    );
  }

  return {
    RouterProvider,
    RouterView,
    useLocale,
    usePrefix,
    usePath,
    useNavigateToPage,
    useIsActivePage,
  };
}
