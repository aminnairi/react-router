import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { home } from "./pages/home";
import { user } from "./pages/user";
import { useNavigateToPage } from "@aminnairi/react-router";

export const Fallback = () => {
  const navigateToHomePage = useNavigateToPage(home)
  const navigateToUserPage = useNavigateToPage(user)

  return (
    <Stack spacing={3}>
      <Typography variant="h2" align="center">
        Not found
      </Typography>
      <Button variant="contained" sx={{ alignSelf: "center" }} onClick={navigateToHomePage}>
        Home
      </Button>
      <Button variant="contained" sx={{ alignSelf: "center" }} onClick={() => navigateToUserPage({ user: "123" })}>
        Navigate to users page
      </Button>
    </Stack>
  );
};