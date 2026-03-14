import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Fragment, ReactNode } from "react";
import { useIsActivePage, useNavigateToPage } from "../router";
import { about } from "../router/pages/about";
import { home } from "../router/pages/home";
import { user } from "../router/pages/user";

export interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const isHomePageActive = useIsActivePage(home);
  const isAboutPageActive = useIsActivePage(about);
  const isUserPageActive = useIsActivePage(user);

  const navigateToHomePage = useNavigateToPage(home);
  const navigateToAboutPage = useNavigateToPage(about);
  const navigateToUserPage = useNavigateToPage(user);

  return (
    <Fragment>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" flex="1">
            React Router
          </Typography>
          <Button onClick={() => navigateToUserPage({ userIdentifier: "123" })} variant={isUserPageActive ? "outlined" : undefined} color="inherit">
            User#123
          </Button>
          <Button onClick={navigateToAboutPage} variant={isAboutPageActive ? "outlined" : undefined} color="inherit">
            About
          </Button>
          <Button onClick={navigateToHomePage} variant={isHomePageActive ? "outlined" : undefined} color="inherit">
            Home
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" paddingTop="100px" paddingBottom="100px">
        {children}
      </Box>
    </Fragment>
  );
}
