import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { createPage, useNavigateToPage } from "@aminnairi/react-router"
import { about } from "./about";

export const home = createPage({
  path: "/",
  element: function HomePage() {
    const navigateToAboutPage = useNavigateToPage(about);

    return (
      <Stack spacing={3}>
        <Typography variant="h2" align="center">
          Home
        </Typography>
        <Button variant="contained" sx={{ alignSelf: "center" }} onClick={navigateToAboutPage}>
          About page
        </Button>
      </Stack>
    )
  }
});