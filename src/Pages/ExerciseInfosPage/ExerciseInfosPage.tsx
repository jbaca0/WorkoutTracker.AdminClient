import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type ExerciseInfoData from '../../DataTransferObjects/Common/ExerciseInfo'
import { ExerciseInfoService } from '../../Services/ExerciseInfoService'
import { type MuscleGroup, MuscleGroup as MG, MuscleGroupLabels, AllMuscleGroups } from '../../Enums/MuscleGroup'

// The API returns secondaryMuscleGroups as string enum names (e.g. "Chest").
// Build a reverse map to convert them to numeric MuscleGroup values.
const muscleGroupByName: Record<string, MuscleGroup> = {}
for (const [name, value] of Object.entries(MG)) {
  if (typeof value === 'number') muscleGroupByName[name] = value
}

function parseSecondaryMuscleGroups(raw: (MuscleGroup | string)[]): MuscleGroup[] {
  return raw.map((v) => (typeof v === 'string' ? muscleGroupByName[v] ?? MG.Other : v))
}

export default function ExerciseInfosPage() {
  const [exerciseInfos, setExerciseInfos] = useState<ExerciseInfoData[]>([])

  // Create/Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState<MuscleGroup>(MG.Other)
  const [secondaryMuscleGroups, setSecondaryMuscleGroups] = useState<MuscleGroup[]>([])
  const [dialogError, setDialogError] = useState('')

  // Delete dialog state
  const [deletingExercise, setDeletingExercise] = useState<ExerciseInfoData | null>(null)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const response = await ExerciseInfoService.getExerciseInfos()
    // Convert string secondary muscle groups from API to numeric values
    const normalized = response.exerciseInfos.map((ei) => ({
      ...ei,
      secondaryMuscleGroups: parseSecondaryMuscleGroups(ei.secondaryMuscleGroups),
    }))
    setExerciseInfos(normalized)
  }

  function openCreateDialog() {
    setEditingId(null)
    setName('')
    setPrimaryMuscleGroup(MG.Other)
    setSecondaryMuscleGroups([])
    setDialogError('')
    setDialogOpen(true)
  }

  function openEditDialog(exerciseInfo: ExerciseInfoData) {
    setEditingId(exerciseInfo.id)
    setName(exerciseInfo.name)
    setPrimaryMuscleGroup(exerciseInfo.primaryMuscleGroup)
    setSecondaryMuscleGroups([...exerciseInfo.secondaryMuscleGroups])
    setDialogError('')
    setDialogOpen(true)
  }

  function handleSecondaryToggle(group: MuscleGroup) {
    setSecondaryMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    )
  }

  async function handleSave() {
    setDialogError('')
    const request = {
      name,
      primaryMuscleGroup,
      secondaryMuscleGroups,
    }
    try {
      if (editingId) {
        await ExerciseInfoService.updateExerciseInfo(editingId, request)
      } else {
        await ExerciseInfoService.createExerciseInfo(request)
      }
      setDialogOpen(false)
      await loadData()
    } catch (error: any) {
      setDialogError(error.message)
    }
  }

  async function handleDelete() {
    if (!deletingExercise) return
    setDeleteError('')
    try {
      await ExerciseInfoService.deleteExerciseInfo(deletingExercise.id)
      setDeletingExercise(null)
      await loadData()
    } catch (error: any) {
      setDeleteError(error.message)
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Exercises</Typography>
        <Button variant="contained" onClick={openCreateDialog}>
          Create Exercise
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Primary Muscle Group</TableCell>
              <TableCell>Secondary Muscle Groups</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exerciseInfos.map((ei) => (
              <TableRow key={ei.id}>
                <TableCell>{ei.name}</TableCell>
                <TableCell>{MuscleGroupLabels[ei.primaryMuscleGroup]}</TableCell>
                <TableCell>
                  {ei.secondaryMuscleGroups.map((mg) => (
                    <Chip key={mg} label={MuscleGroupLabels[mg]} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEditDialog(ei)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => { setDeleteError(''); setDeletingExercise(ei) }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit Exercise' : 'Create Exercise'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Primary Muscle Group</InputLabel>
            <Select
              value={primaryMuscleGroup}
              label="Primary Muscle Group"
              onChange={(e) => setPrimaryMuscleGroup(e.target.value as MuscleGroup)}
            >
              {AllMuscleGroups.map((mg) => (
                <MenuItem key={mg} value={mg}>
                  {MuscleGroupLabels[mg]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Secondary Muscle Groups
          </Typography>
          {AllMuscleGroups.map((mg) => (
            <FormControlLabel
              key={mg}
              control={
                <Checkbox
                  checked={secondaryMuscleGroups.includes(mg)}
                  onChange={() => handleSecondaryToggle(mg)}
                />
              }
              label={MuscleGroupLabels[mg]}
            />
          ))}
          {dialogError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {dialogError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!name}>
            {editingId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deletingExercise !== null} onClose={() => setDeletingExercise(null)}>
        <DialogTitle>Delete Exercise</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deletingExercise?.name}</strong>? This action cannot be undone.
          </Typography>
          {deleteError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {deleteError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingExercise(null)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
