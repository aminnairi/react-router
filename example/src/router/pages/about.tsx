import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { createPage } from "@aminnairi/react-router"
import { home } from "./home";
import { user } from "./user";
import { useNavigateToPage } from "..";
import { Button } from "@mui/material";
import Layout from "../../components/layout";

export const about = createPage({
  path: "/about",
  element: function AboutPage() {
    const navigateToHomePage = useNavigateToPage(home);
    const navigateToUserPage = useNavigateToPage(user);

    return (
      <Layout>
        <Stack spacing={3}>
          <Typography variant="h2" align="center">
            About Us
          </Typography>
          <Button onClick={navigateToHomePage}>
            Home
          </Button>
          <Typography>
            Or go to the <Button onClick={() => navigateToUserPage({ user: "123" })}>User#123</Button>
          </Typography>
        </Stack>
      </Layout>
    );
  }
})
