import { useEffect, useState, FunctionComponent, useMemo, Component, PropsWithChildren, createContext, SetStateAction, Dispatch, ReactNode, useContext, useCallback, memo, MouseEvent } from "react";

export type AbsolutePath<Path extends string> =
  Path extends `${infer Start}:${string}/${infer Rest}`
  ? `${Start}${string}/${AbsolutePath<Rest>}`
  : Path extends `${infer Start}:${string}`
  ? `${Start}${string}`
  : Path;

export type Parameters<Path extends string> =
  Path extends `${string}/:${infer Segment}/${infer Rest}`
  ? { [K in Segment]: string } & Parameters<`/${Rest}`>
  : Path extends `${string}/:${infer Segment}`
  ? { [K in Segment]: string }
  : object;

export type GoToPageFunction<Path extends string> = (path: AbsolutePath<Path>) => void;

export interface PageComponentProps<Path extends string> {
  parameters: Parameters<Path>,
}

export interface Page<Path extends string> {
  path: Path,
  element: FunctionComponent<PageComponentProps<Path>>
}

export interface CreateRouterOptions<Path extends string> {
  transition?: boolean,
  prefix?: string,
  pages: Array<Page<Path>>
  fallback: FunctionComponent
  issue: FunctionComponent<IssueProps>
}

export interface FindPageOptions {
  pages: Array<Page<string>>
  path: string
}

export const sanitizePath = (path: string): string => {
  const sanitizedPath = path.replace(/\/+/g, "/").replace(/^\/|\/$/g, "")
  return "/" + sanitizedPath;
}


export const createPage = <Path extends string>(page: Page<Path>) => {
  return page
}

export const doesRouteMatchPath = (path: string, route: string, prefix?: string): boolean => {
  const pathParts = sanitizePath(`${prefix ?? ""}/${path}`).split("/").filter(Boolean);
  const routeParts = sanitizePath(route).split("/").filter(Boolean);

  return (
    pathParts.length === routeParts.length &&
    pathParts.every((part, index) => part.startsWith(":") || part === routeParts[index])
  );
}

export const getParameters = <Path extends string>(path: Path, route: string, prefix?: string): Parameters<Path> => {
  if (!doesRouteMatchPath(path, route, prefix)) {
    return {} as Parameters<Path>;
  }

  const pathParts = sanitizePath(`${prefix ?? ""}/${path}`).split("/").filter(Boolean);
  const routeParts = sanitizePath(route).split("/").filter(Boolean);

  return pathParts.reduce((parameters, pathPart, pathPartIndex) => {
    const routePart = routeParts[pathPartIndex];

    if (!routePart) {
      return parameters;
    }

    if (!pathPart.startsWith(":")) {
      return parameters;
    }

    return {
      ...parameters,
      [`${pathPart.slice(1)}`]: routePart
    }
  }, {} as Parameters<Path>);
}

const findPage = (pages: Array<Page<string>>, path: string, prefix?: string) => {
  const foundPage = pages.find(route => {
    return doesRouteMatchPath(sanitizePath(`${prefix ?? ""}/${route.path}`), sanitizePath(path));
  });

  return foundPage;
};

export interface IssueProps {
  error: Error,
  reset: () => void,
}

export interface ErrorBoundaryProps {
  fallback: FunctionComponent<IssueProps>,
  transition: boolean
}

export interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<PropsWithChildren<ErrorBoundaryProps>, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    const normalizedError = error instanceof Error ? error : new Error(String(error));

    return { error: normalizedError };
  }

  render() {
    const viewTransitionSupported = typeof document.startViewTransition === "function";

    if (this.state.error) {
      const reset = () => {
        if (this.props.transition && viewTransitionSupported) {
          document.startViewTransition(() => {
            this.setState({
              error: null
            });
          });

          return;
        }

        this.setState({
          error: null
        });
      }

      return this.props.fallback({
        error: this.state.error,
        reset
      });
    }

    return this.props.children;
  }
}

export const createIssue = (issue: FunctionComponent<IssueProps>) => {
  return issue;
}

export interface ContextInterface {
  prefix: string,
  pathname: string,
  setPathname: Dispatch<SetStateAction<string>>,
  search: URLSearchParams,
  setSearch: Dispatch<SetStateAction<URLSearchParams>>,
  hash: string,
  setHash: Dispatch<SetStateAction<string>>
}

export interface ProviderProps {
  children: ReactNode
}

const Context = createContext<ContextInterface>({
  prefix: "",
  pathname: sanitizePath(window.location.pathname),
  setPathname: () => { },
  search: new URLSearchParams(),
  setSearch: () => { },
  hash: window.location.hash,
  setHash: () => { }
});

export const useNavigateToPage = <Path extends string>(page: Page<Path>) => {
  const { prefix } = useContext(Context);

  return useCallback((parameters: Parameters<Path>, replace: boolean = false) => {
    const initialPath = sanitizePath(`${prefix ?? ""}/${page.path}`);

    const pathWithParameters = Object.entries(parameters).reduce((path, [parameterName, parameterValue]) => {
      return path.replace(`:${parameterName}`, parameterValue);
    }, initialPath);

    if (replace) {
      window.history.replaceState(null, pathWithParameters, pathWithParameters);
    } else {
      window.history.pushState(null, pathWithParameters, pathWithParameters);
    }

    window.dispatchEvent(new CustomEvent("popstate"));
  }, [page]);
};

export const useIsActivePage = (page: Page<string>) => {
  const { pathname, prefix } = useContext(Context);

  return doesRouteMatchPath(sanitizePath(page.path), sanitizePath(pathname), prefix);
};

export const useSearch = () => {
  const { search } = useContext(Context);

  return search;
};

export const useHash = () => {
  const { hash } = useContext(Context);
  return hash;
};

export const useLink = <Path extends string>(page: Page<Path>) => {
  const Link = memo(({ children, parameters }: { children: ReactNode, parameters: Parameters<Path> }) => {
    const { prefix } = useContext(Context);
    const navigateToPage = useNavigateToPage(page);

    const pathWithParameters = useMemo(() => {
      return Object.entries(parameters).reduce((previousPath, [parameterName, parameterValue]) => {
        return previousPath.replace(`:${parameterName}`, parameterValue);
      }, sanitizePath(`${prefix ?? ""}/${page.path}`));
    }, []);

    const navigate = useCallback((event: MouseEvent) => {
      event.preventDefault();
      navigateToPage(parameters);
    }, []);

    return (
      <a
        href={pathWithParameters}
        onClick={navigate}>
        {children}
      </a>
    );

  });

  return Link;
};

export const createRouter = <Path extends string>({ pages, fallback, transition: withViewTransition, issue, prefix }: CreateRouterOptions<Path>) => {
  const Provider = ({ children }: ProviderProps) => {
    const [pathname, setPathname] = useState(sanitizePath(window.location.pathname));
    const [search, setSearch] = useState(new URLSearchParams(sanitizePath(window.location.search)));
    const [hash, setHash] = useState(window.location.hash);
    const shouldTransitionBetweenPages = useMemo(() => typeof document.startViewTransition === "function" && withViewTransition ? true : false, [withViewTransition]);

    const value = useMemo(() => {
      return {
        prefix: prefix ?? "",
        pathname,
        search,
        hash,
        setPathname,
        setSearch,
        setHash
      };
    }, [prefix, pathname, search, hash]);

    useEffect(() => {
      const onWindowPopstate = () => {
        if (shouldTransitionBetweenPages) {
          document.startViewTransition(() => {
            setPathname(sanitizePath(window.location.pathname));
          });

          return;
        }

        setPathname(sanitizePath(window.location.pathname));
      };

      window.addEventListener("popstate", onWindowPopstate);

      return () => {
        window.removeEventListener("popstate", onWindowPopstate);
      }
    }, []);

    return (
      <Context.Provider value={value}>
        <ErrorBoundary fallback={issue} transition={shouldTransitionBetweenPages}>
          {children}
        </ErrorBoundary>
      </Context.Provider>
    );
  };

  const View = () => {
    const Fallback = useMemo(() => fallback, []);
    const { pathname } = useContext(Context);
    const page = useMemo(() => findPage(pages, pathname, prefix), [pathname]);

    const parameters = useMemo(() => {
      if (page) {
        return getParameters(sanitizePath(page.path), sanitizePath(window.location.pathname), prefix);
      }

      return {};
    }, [page]);

    if (page) {
      return (
        <page.element parameters={parameters} />
      );
    }

    return (
      <Fallback />
    );
  };

  return {
    View,
    Provider,
  };
}