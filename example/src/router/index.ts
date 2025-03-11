import { createRouter } from "@aminnairi/react-router";
import { home } from "./pages/home";
import { user } from "./pages/user";
import { about } from "./pages/about";
import { Fallback } from "./fallback";
import { Issue } from "./issue";

export const router = createRouter({
  transition: true,
  issue: Issue,
  fallback: Fallback,
  pages: [
    home.page,
    user.page,
    about.page
  ]
});