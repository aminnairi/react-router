import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { IssueProps } from "@aminnairi/react-router";
import Layout from "../components/layout";

export const Issue = ({ error, resetError }: IssueProps) => {
  return (
    <Layout>
      <Stack spacing={3}>
        <Typography variant="h2" align="center">Error</Typography>
        <Typography align="center">{String(error)}</Typography>
        <Button onClick={resetError} variant="contained" sx={{ alignSelf: "center" }}>
          Reset
        </Button>
      </Stack>
    </Layout>
  );
};
