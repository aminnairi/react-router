import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { createIssue } from "@aminnairi/react-router";

export const Issue = createIssue(({ error, reset }) => {
  return (
    <Stack spacing={3}>
      <Typography variant="h2" align="center">Error</Typography>
      <Typography align="center">{error.message}</Typography>
      <Button onClick={reset} variant="contained" sx={{ alignSelf: "center" }}>
        Reset
      </Button>
    </Stack>
  );
});