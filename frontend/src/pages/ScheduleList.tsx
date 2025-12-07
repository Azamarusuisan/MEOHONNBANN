import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material'
import { Add, Delete, Cancel } from '@mui/icons-material'
import api from '../utils/api'

interface Schedule {
  id: string
  postId: string
  storeId: string
  scheduledAt: string
  status: string
  post?: { title: string | null; content: string }
  store?: { name: string }
}

interface Post {
  id: string
  title: string | null
  content: string
}

interface Store {
  id: string
  name: string
}

const statusLabels: Record<string, { label: string; color: 'default' | 'primary' | 'warning' | 'success' | 'error' }> = {
  PENDING: { label: '待機中', color: 'default' },
  QUEUED: { label: 'キュー追加', color: 'primary' },
  PROCESSING: { label: '処理中', color: 'warning' },
  SUCCESS: { label: '成功', color: 'success' },
  FAILED: { label: '失敗', color: 'error' },
  CANCELLED: { label: 'キャンセル', color: 'default' },
}

export default function ScheduleList() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    postId: '',
    storeId: '',
    scheduledAt: '',
  })

  const fetchData = async () => {
    try {
      const [schedulesRes, postsRes, storesRes] = await Promise.all([
        api.get('/schedules'),
        api.get('/posts'),
        api.get('/stores'),
      ])
      setSchedules(schedulesRes.data.data || [])
      setPosts(postsRes.data.data || [])
      setStores(storesRes.data.data || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenDialog = () => {
    setFormData({ postId: '', storeId: '', scheduledAt: '' })
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSubmit = async () => {
    try {
      await api.post('/schedules', {
        ...formData,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
      })
      handleCloseDialog()
      fetchData()
    } catch (error) {
      console.error('Failed to create schedule:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('このスケジュールを削除しますか？')) {
      try {
        await api.delete(`/schedules/${id}`)
        fetchData()
      } catch (error) {
        console.error('Failed to delete schedule:', error)
      }
    }
  }

  const handleCancel = async (id: string) => {
    if (window.confirm('このスケジュールをキャンセルしますか？')) {
      try {
        await api.put(`/schedules/${id}`, { status: 'CANCELLED' })
        fetchData()
      } catch (error) {
        console.error('Failed to cancel schedule:', error)
      }
    }
  }

  if (loading) {
    return <Typography>読み込み中...</Typography>
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">スケジュール管理</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          新規スケジュール
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>投稿</TableCell>
              <TableCell>店舗</TableCell>
              <TableCell>予定日時</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  {schedule.post?.title || schedule.post?.content.substring(0, 30) || '-'}
                </TableCell>
                <TableCell>{schedule.store?.name || '-'}</TableCell>
                <TableCell>
                  {new Date(schedule.scheduledAt).toLocaleString('ja-JP')}
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[schedule.status]?.label || schedule.status}
                    color={statusLabels[schedule.status]?.color || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {schedule.status === 'PENDING' && (
                    <IconButton onClick={() => handleCancel(schedule.id)}>
                      <Cancel />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDelete(schedule.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {schedules.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  スケジュールが登録されていません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>新規スケジュール</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>投稿</InputLabel>
            <Select
              value={formData.postId}
              label="投稿"
              onChange={(e) => setFormData({ ...formData, postId: e.target.value })}
            >
              {posts.map((post) => (
                <MenuItem key={post.id} value={post.id}>
                  {post.title || post.content.substring(0, 30)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>店舗</InputLabel>
            <Select
              value={formData.storeId}
              label="店舗"
              onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
            >
              {stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="予定日時"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button onClick={handleSubmit} variant="contained">
            作成
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
