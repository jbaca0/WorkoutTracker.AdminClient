import { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Box,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import type UserSummary from '../../DataTransferObjects/Common/UserSummary'
import { AdminService } from '../../Services/AdminService'

export default function UsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([])
  const [availableRoles, setAvailableRoles] = useState<string[]>([])
  const [editingUser, setEditingUser] = useState<UserSummary | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  // Create user state
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRoles, setNewRoles] = useState<string[]>([])
  const [createError, setCreateError] = useState('')

  // Delete user state
  const [deletingUser, setDeletingUser] = useState<UserSummary | null>(null)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [usersResponse, rolesResponse] = await Promise.all([
      AdminService.getUsers(),
      AdminService.getRoles(),
    ])
    setUsers(usersResponse.users)
    setAvailableRoles(rolesResponse.roles)
  }

  function handleEditRoles(user: UserSummary) {
    setEditingUser(user)
    setSelectedRoles([...user.roles])
  }

  function handleRoleToggle(role: string) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  async function handleSaveRoles() {
    if (!editingUser) return
    await AdminService.updateUserRoles(editingUser.id, selectedRoles)
    setEditingUser(null)
    await loadData()
  }

  function openCreateDialog() {
    setNewEmail('')
    setNewPassword('')
    setNewRoles([])
    setCreateError('')
    setCreateDialogOpen(true)
  }

  function handleNewRoleToggle(role: string) {
    setNewRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  async function handleCreateUser() {
    setCreateError('')
    try {
      await AdminService.createUser({
        email: newEmail,
        password: newPassword,
        roles: newRoles.length > 0 ? newRoles : undefined,
      })
      setCreateDialogOpen(false)
      await loadData()
    } catch (error: any) {
      setCreateError(error.message)
    }
  }

  async function handleDeleteUser() {
    if (!deletingUser) return
    setDeleteError('')
    try {
      await AdminService.deleteUser(deletingUser.id)
      setDeletingUser(null)
      await loadData()
    } catch (error: any) {
      setDeleteError(error.message)
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Users</Typography>
        <Button variant="contained" onClick={openCreateDialog}>
          Create User
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.roles.map((role) => (
                    <Chip key={role} label={role} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => handleEditRoles(user)}>
                    Manage Roles
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => { setDeleteError(''); setDeletingUser(user) }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Roles Dialog */}
      <Dialog open={editingUser !== null} onClose={() => setEditingUser(null)}>
        <DialogTitle>Manage Roles — {editingUser?.email}</DialogTitle>
        <DialogContent>
          {availableRoles.map((role) => (
            <FormControlLabel
              key={role}
              control={
                <Checkbox
                  checked={selectedRoles.includes(role)}
                  onChange={() => handleRoleToggle(role)}
                />
              }
              label={role}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUser(null)}>Cancel</Button>
          <Button onClick={handleSaveRoles} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Roles
          </Typography>
          {availableRoles.map((role) => (
            <FormControlLabel
              key={role}
              control={
                <Checkbox
                  checked={newRoles.includes(role)}
                  onChange={() => handleNewRoleToggle(role)}
                />
              }
              label={role}
            />
          ))}
          {createError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {createError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            disabled={!newEmail || !newPassword}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={deletingUser !== null} onClose={() => setDeletingUser(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deletingUser?.email}</strong>? This action cannot be undone.
          </Typography>
          {deleteError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {deleteError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingUser(null)}>Cancel</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
