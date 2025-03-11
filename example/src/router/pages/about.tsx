import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { createPage } from "@aminnairi/react-router"
import { home } from "./home";

export const about = createPage({
  path: "/about",
  element: () => {
    return (
      <Stack spacing={3}>
        <Typography variant="h2" align="center">
          About Us
        </Typography>
        <Button variant="contained" sx={{ alignSelf: "center" }} onClick={home.navigate}>
          Home
        </Button>
      </Stack>
    );
  }
})