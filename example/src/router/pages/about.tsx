import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { createPage, useNavigateToPage, useLink } from "@aminnairi/react-router"
import { home } from "./home";
import { user } from "./user";

export const about = createPage({
  path: "/about",
  element: function AboutPage() {
    const Link = useLink(user);
    const navigateToHome = useNavigateToPage(home);

    return (
      <Stack spacing={3}>
        <Typography variant="h2" align="center">
          About Us
        </Typography>
        <Button variant="contained" sx={{ alignSelf: "center" }} onClick={navigateToHome}>
          Home
        </Button>
        <Typography>
          Or go to the <Link parameters={{ user: "123" }}>user#123</Link> page.
        </Typography>
      </Stack>
    );
  }
})