import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { createPage } from "@aminnairi/react-router"
import { about } from "./about";
import { useNavigateToPage } from "..";
import Layout from "../../components/layout";

export const home = createPage({
  path: "/",
  element: function HomePage() {
    const navigateToAboutPage = useNavigateToPage(about);

    return (
      <Layout>
        <Stack spacing={3}>
          <Typography variant="h2" align="center">
            Home
          </Typography>
          <Button variant="contained" sx={{ alignSelf: "center" }} onClick={navigateToAboutPage}>
            About page
          </Button>
        </Stack>
      </Layout>
    )
  }
});
