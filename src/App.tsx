import { Routes, Route } from 'react-router'
import { AuthProvider } from './Hooks/useAuth'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import AppLayout from './Components/AppLayout/AppLayout'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import LoginPage from './Pages/LoginPage/LoginPage'
import HomePage from './Pages/HomePage/HomePage'
import UsersPage from './Pages/UsersPage/UsersPage'
import ExerciseInfosPage from './Pages/ExerciseInfosPage/ExerciseInfosPage'
import LogsPage from './Pages/LogsPage/LogsPage'

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
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/exercises" element={<ExerciseInfosPage />} />
              <Route path="/logs" element={<LogsPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
