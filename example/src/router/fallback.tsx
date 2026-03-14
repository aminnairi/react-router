import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { home } from "./pages/home";
import { user } from "./pages/user";
import { useNavigateToPage } from ".";
import Layout from "../components/layout";

export const Fallback = () => {
  const navigateToHomePage = useNavigateToPage(home);
  const navigateToUserPage = useNavigateToPage(user);

  return (
    <Layout>
      <Stack spacing={3}>
        <Typography variant="h2" align="center">
          Not found
        </Typography>
        <Button variant="contained" sx={{ alignSelf: "center" }} onClick={navigateToHomePage}>
          Home
        </Button>
        <Button variant="contained" sx={{ alignSelf: "center" }} onClick={() => navigateToUserPage({ userIdentifier: "123" })}>
          Navigate to users page
        </Button>
      </Stack>
    </Layout>
  );
};
