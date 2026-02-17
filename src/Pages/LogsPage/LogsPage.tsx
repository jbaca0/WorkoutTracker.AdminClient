import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import type LogEntry from '../../DataTransferObjects/Common/LogEntry'
import { LogService } from '../../Services/LogService'

const LOG_LEVELS = ['Trace', 'Debug', 'Information', 'Warning', 'Error', 'Critical']

const levelColors: Record<string, 'default' | 'info' | 'success' | 'warning' | 'error'> = {
  Trace: 'default',
  Debug: 'default',
  Information: 'info',
  Warning: 'warning',
  Error: 'error',
  Critical: 'error',
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)

  // Filter state
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Applied filter state (only updates on Apply)
  const [appliedFilters, setAppliedFilters] = useState({ search: '', level: '', startDate: '', endDate: '' })

  // Clear dialog state
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [clearError, setClearError] = useState('')

  useEffect(() => {
    loadData()
  }, [page, rowsPerPage, appliedFilters])

  async function loadData() {
    try {
      const response = await LogService.getLogs({
        level: appliedFilters.level || undefined,
        startDate: appliedFilters.startDate || undefined,
        endDate: appliedFilters.endDate || undefined,
        search: appliedFilters.search || undefined,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      })
      setLogs(response.logs)
      setTotalCount(response.totalCount)
    } catch (error: any) {
      console.error('Failed to load logs:', error.message)
    }
  }

  function handleApplyFilters() {
    setPage(0)
    setAppliedFilters({ search, level, startDate, endDate })
  }

  function handleChangePage(_: unknown, newPage: number) {
    setPage(newPage)
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  async function handleClearAll() {
    setClearError('')
    try {
      await LogService.deleteAllLogs()
      setClearDialogOpen(false)
      setPage(0)
      await loadData()
    } catch (error: any) {
      setClearError(error.message)
    }
  }

  function formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Logs</Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => { setClearError(''); setClearDialogOpen(true) }}
        >
          Clear All Logs
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Search"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleApplyFilters() }}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Log Level</InputLabel>
          <Select
            value={level}
            label="Log Level"
            onChange={(e) => setLevel(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {LOG_LEVELS.map((l) => (
              <MenuItem key={l} value={l}>{l}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Start Date"
          type="datetime-local"
          size="small"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="End Date"
          type="datetime-local"
          size="small"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Button variant="contained" onClick={handleApplyFilters}>
          Apply
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatTimestamp(log.timestamp)}</TableCell>
                <TableCell>
                  <Chip
                    label={log.logLevel}
                    size="small"
                    color={levelColors[log.logLevel] || 'default'}
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {log.category}
                </TableCell>
                <TableCell>
                  {log.message}
                  {log.exception && (
                    <Typography variant="body2" color="error" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                      {log.exception}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No logs found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[25, 50, 100]}
      />

      {/* Clear All Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Clear All Logs</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all logs? This action cannot be undone.
          </Typography>
          {clearError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {clearError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearAll} variant="contained" color="error">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
