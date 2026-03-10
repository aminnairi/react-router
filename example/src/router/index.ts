import { createRouter, slideHorizontalTransition } from "@aminnairi/react-router";
import { home } from "./pages/home";
import { user } from "./pages/user";
import { about } from "./pages/about";
import { Fallback } from "./fallback";
import { Issue } from "./issue";

export const { RouterProvider, useLocale, RouterView, useNavigateToPage, useIsActivePage, } = createRouter({
  transition: slideHorizontalTransition,
  prefix: "github",
  locales: ["en", "fr"],
  issue: Issue,
  fallback: Fallback,
  pages: [
    home,
    user,
    about
  ]
});
