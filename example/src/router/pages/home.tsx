import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { createPage } from "@aminnairi/react-router"
import { about } from "./about";

export const home = createPage({
  path: "/",
  element: () => {
    if (Math.random() > 0.5) {
      throw new Error("Unknown error for testing purposes");
    }

    return (
      <Stack spacing={3}>
        <Typography variant="h2" align="center">
          Home
        </Typography>
        <Button variant="contained" sx={{ alignSelf: "center" }} onClick={about.navigate}>
          About page
        </Button>
      </Stack>
    )
  }
});