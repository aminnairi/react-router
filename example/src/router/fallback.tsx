import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { home } from "./pages/home";
import { user } from "./pages/user";

export const Fallback = () => {
  return (
    <Stack spacing={3}>
      <Typography variant="h2" align="center">
        Not found
      </Typography>
      <Button variant="contained" sx={{ alignSelf: "center" }} onClick={home.navigate}>
        Home
      </Button>
      <Button variant="contained" sx={{ alignSelf: "center" }} onClick={() => user.navigate({ user: "123" })}>
        Navigate to users page
      </Button>
    </Stack>
  );
};