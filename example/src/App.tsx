import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";

import { RouterView } from './router'

function App() {
  return (
    <Container>
      <CssBaseline />
      <RouterView />
    </Container>
  )
}

export default App
