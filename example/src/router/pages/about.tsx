import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MaterialLink from "@mui/material/Link";

import { createPage, useLink } from "@aminnairi/react-router"
import { home } from "./home";
import { user } from "./user";

export const about = createPage({
  path: "/about",
  element: function AboutPage() {
    const HomeLink = useLink(home);

    const UserLink = useLink(user, ({ path, onClick }) => {
      return (
        <MaterialLink
          href={path}
          onClick={onClick}
          color="primary">
          User#123
        </MaterialLink>
      );
    });

    return (
      <Stack spacing={3}>
        <Typography variant="h2" align="center">
          About Us
        </Typography>
        <HomeLink parameters={{}}>
          Home
        </HomeLink>
        <Typography>
          Or go to the <UserLink parameters={{ user: "123" }}>User#123</UserLink>
        </Typography>
      </Stack>
    );
  }
})
