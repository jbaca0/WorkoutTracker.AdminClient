import { Routes, Route } from 'react-router'
import { AuthProvider } from './Hooks/useAuth'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import LoginPage from './Pages/LoginPage/LoginPage'
import HomePage from './Pages/HomePage/HomePage'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
