import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { createPage } from "@aminnairi/react-router";
import { home } from "./home";
import { useNavigateToPage } from "..";
import Layout from "../../components/layout";

export const user = createPage({
  path: "/users/:userIdentifier",
  element: function UserPage({ parameters }) {
    const navigateToHomePage = useNavigateToPage(home);

    return (
      <Layout>
        <Stack spacing={3}>
          <Typography variant="h2" align="center">
            User #{parameters.userIdentifier}
          </Typography>
          <Button variant="contained" sx={{ alignSelf: "center" }} onClick={navigateToHomePage}>
            Home
          </Button>
        </Stack>
      </Layout>
    );
  }
});
