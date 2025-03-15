import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

import { router } from './router'
import { home } from "./router/pages/home";
import { about } from "./router/pages/about";
import { user } from "./router/pages/user";
import { useIsActivePage, useNavigateToPage } from "@aminnairi/react-router";

function App() {
  const isHomePageActive = useIsActivePage(home);
  const isAboutPageActive = useIsActivePage(about);
  const isUserPageActive = useIsActivePage(user);

  const navigateToHomePage = useNavigateToPage(home);
  const navigateToAboutPage = useNavigateToPage(about)
  const navigateToUserPage = useNavigateToPage(user)

  return (
    <Container>
      <CssBaseline />
      <Drawer variant="persistent" open>
        <List sx={{ width: "200px" }} disablePadding>
          <ListItem onClick={navigateToHomePage} disablePadding>
            <ListItemButton selected={isHomePageActive}>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem onClick={navigateToAboutPage} disablePadding>
            <ListItemButton selected={isAboutPageActive}>
              <ListItemText primary="About" />
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => navigateToUserPage({ user: "123" })} disablePadding>
            <ListItemButton selected={isUserPageActive}>
              <ListItemText primary="User#123" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <router.View />
    </Container>
  )
}

export default App
