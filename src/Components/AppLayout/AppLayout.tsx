import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { Link, Outlet } from 'react-router'
import { useAuth } from '../../Hooks/useAuth'

export default function AppLayout() {
  const { logout } = useAuth()

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ mr: 4 }}>
            Admin
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Users
          </Button>
          <Button color="inherit" component={Link} to="/exercises">
            Exercises
          </Button>
          <Button color="inherit" component={Link} to="/logs">
            Logs
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  )
}
