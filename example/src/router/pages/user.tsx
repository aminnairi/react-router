import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { createPage } from "@aminnairi/react-router";
import { home } from "./home";

export const user = createPage({
  path: "/users/:user",
  element: ({ parameters }) => {
    return (
      <Stack spacing={3}>
        <Typography variant="h2" align="center">
          User #{parameters.user}
        </Typography>
        <Button variant="contained" sx={{ alignSelf: "center" }} onClick={home.navigate}>
          Home
        </Button>
      </Stack>
    );
  }
});