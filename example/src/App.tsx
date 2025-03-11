import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";

import { router } from './router'

function App() {
  return (
    <Container>
      <CssBaseline />
      <router.View />
    </Container>
  )
}

export default App
