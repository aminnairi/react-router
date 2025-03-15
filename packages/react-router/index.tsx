import { useEffect, useState, FunctionComponent, useMemo, Component, PropsWithChildren } from "react";

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
  pages: Array<Page<string>>
  fallback: FunctionComponent
  issue: FunctionComponent<IssueProps>
}

export interface CreateRouteOutput<Path extends string> {
  page: Page<Path>,
  navigate: (parameters: Parameters<Path>) => void
}

export interface FindPageOptions {
  pages: Array<Page<string>>
}

export const createPage = <Path extends string>(page: Page<Path>): CreateRouteOutput<Path> => {
  const navigate = (parameters: Parameters<Path>, replace: boolean = false) => {
    const pathWithParameters = Object.entries(parameters).reduce((path, [parameterName, parameterValue]) => {
      return path.replace(`:${parameterName}`, parameterValue);
    }, page.path as string);

    if (replace) {
      window.history.replaceState(null, pathWithParameters, pathWithParameters);
    } else {
      window.history.pushState(null, pathWithParameters, pathWithParameters);
    }

    window.dispatchEvent(new CustomEvent("popstate"));
  };

  return {
    page,
    navigate
  };
}

export const doesRouteMatchPath = (path: string, route: string, prefix?: string): boolean => {
  const pathParts = sanitizePath(`${prefix ?? ""}/${path}`).split("/").filter(Boolean);
  const routeParts = sanitizePath(route).split("/").filter(Boolean);

  return (
    pathParts.length === routeParts.length &&
    pathParts.every((part, index) => part.startsWith(":") || part === routeParts[index])
  );
}

export const getParameters = <Path extends string>(config: { path: Path; route: string }): Parameters<Path> => {
  return Object.fromEntries(
    config.path
      .split("/")
      .map((part, index) => (part.startsWith(":") ? [part.slice(1), config.route.split("/")[index]] : null))
      .filter((entry): entry is [string, string] => entry !== null)
  ) as Parameters<Path>;
}

const findPage = ({ pages }: FindPageOptions) => {
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

  const View = () => {
    const [page, setPage] = useState(findPage({ pages }));
    const shouldTransitionBetweenPages = useMemo(() => typeof document.startViewTransition === "function" && withViewTransition ? true : false, [withViewTransition]);
    const Fallback = useMemo(() => fallback, []);

    const parameters = useMemo(() => {
      if (page) {
        return getParameters({
          path: page.path,
          route: window.location.pathname
        })
      }

      return {};
    }, [page]);
export const createRouter = <Path extends string>({ pages, fallback, transition: withViewTransition, issue, prefix }: CreateRouterOptions<Path>) => {

    useEffect(() => {
      const onWindowPopstate = () => {
        const foundPage = findPage({ pages });

        if (shouldTransitionBetweenPages) {
          document.startViewTransition(() => {
            setPage(foundPage);
          });
        } else {
          setPage(foundPage);
        }
      };

      window.addEventListener("popstate", onWindowPopstate);

      return () => {
        window.removeEventListener("popstate", onWindowPopstate);
      }
    }, []);

    if (page) {
      return (
        <ErrorBoundary fallback={issue} transition={shouldTransitionBetweenPages}>
          {<page.element parameters={parameters} />}
        </ErrorBoundary>
      );
    }

    return <Fallback />;
  };

  return {
    View
  };
}