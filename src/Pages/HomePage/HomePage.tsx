import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { useAuth } from '../../Hooks/useAuth'

export default function HomePage() {
  const { user, logout } = useAuth()

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.email}
        </Typography>
        <Typography color="text.secondary">
          Admin dashboard coming soon.
        </Typography>
      </Container>
    </Box>
  )
}
