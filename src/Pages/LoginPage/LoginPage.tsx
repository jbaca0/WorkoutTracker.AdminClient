import { useState } from 'react'
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material'
import { useAuth } from '../../Hooks/useAuth'

export default function LoginPage() {
  const auth = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit() {
    await auth.login(email, password)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Admin Login
        </Typography>
        {auth.errorMessage && <Alert severity="error" sx={{ width: '100%' }}>{auth.errorMessage}</Alert>}
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Log In
        </Button>
      </Box>
    </Container>
  )
}
