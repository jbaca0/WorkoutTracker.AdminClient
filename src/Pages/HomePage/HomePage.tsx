import { Container, Typography } from '@mui/material'
import { useAuth } from '../../Hooks/useAuth'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.email}
      </Typography>
      <Typography color="text.secondary">
        Admin dashboard coming soon.
      </Typography>
    </Container>
  )
}
