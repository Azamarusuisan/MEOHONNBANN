import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import api from '../utils/api'

interface Store {
  id: string
  name: string
  address: string | null
  phone: string | null
  customerId: string
  customer?: { name: string }
  isActive: boolean
}

interface Customer {
  id: string
  name: string
}

export default function StoreList() {
  const navigate = useNavigate()
  const [stores, setStores] = useState<Store[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    customerId: '',
  })

  const fetchData = async () => {
    try {
      const [storesRes, customersRes] = await Promise.all([
        api.get('/stores'),
        api.get('/customers'),
      ])
      setStores(storesRes.data.data || [])
      setCustomers(customersRes.data.data || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenDialog = (store?: Store) => {
    if (store) {
      setEditingStore(store)
      setFormData({
        name: store.name,
        address: store.address || '',
        phone: store.phone || '',
        customerId: store.customerId,
      })
    } else {
      setEditingStore(null)
      setFormData({ name: '', address: '', phone: '', customerId: '' })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingStore(null)
  }

  const handleSubmit = async () => {
    try {
      if (editingStore) {
        await api.put(`/stores/${editingStore.id}`, formData)
      } else {
        await api.post('/stores', formData)
      }
      handleCloseDialog()
      fetchData()
    } catch (error) {
      console.error('Failed to save store:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('この店舗を削除しますか？')) {
      try {
        await api.delete(`/stores/${id}`)
        fetchData()
      } catch (error) {
        console.error('Failed to delete store:', error)
      }
    }
  }

  if (loading) {
    return <Typography>読み込み中...</Typography>
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">店舗管理</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          新規店舗
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>店舗名</TableCell>
              <TableCell>顧客</TableCell>
              <TableCell>住所</TableCell>
              <TableCell>電話番号</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.customer?.name || '-'}</TableCell>
                <TableCell>{store.address || '-'}</TableCell>
                <TableCell>{store.phone || '-'}</TableCell>
                <TableCell>{store.isActive ? '有効' : '無効'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/stores/${store.id}`)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDialog(store)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(store.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {stores.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  店舗が登録されていません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingStore ? '店舗編集' : '新規店舗'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>顧客</InputLabel>
            <Select
              value={formData.customerId}
              label="顧客"
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            >
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="店舗名"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="住所"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="電話番号"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button onClick={handleSubmit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
