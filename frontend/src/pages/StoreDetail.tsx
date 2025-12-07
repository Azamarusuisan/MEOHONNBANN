import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import api from '../utils/api'

interface Store {
  id: string
  name: string
  address: string | null
  phone: string | null
  gbpLocationId: string | null
  isActive: boolean
  createdAt: string
  customer?: {
    id: string
    name: string
    companyName: string | null
  }
}

export default function StoreDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await api.get(`/stores/${id}`)
        setStore(response.data.data)
      } catch (error) {
        console.error('Failed to fetch store:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStore()
  }, [id])

  if (loading) {
    return <Typography>読み込み中...</Typography>
  }

  if (!store) {
    return <Typography>店舗が見つかりません</Typography>
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/stores')}
        sx={{ mb: 2 }}
      >
        戻る
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4">{store.name}</Typography>
          <Chip
            label={store.isActive ? '有効' : '無効'}
            color={store.isActive ? 'success' : 'default'}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography color="textSecondary">顧客</Typography>
            <Typography
              sx={{ cursor: 'pointer', color: 'primary.main' }}
              onClick={() => navigate(`/customers/${store.customer?.id}`)}
            >
              {store.customer?.name || '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="textSecondary">住所</Typography>
            <Typography>{store.address || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="textSecondary">電話番号</Typography>
            <Typography>{store.phone || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="textSecondary">GBP Location ID</Typography>
            <Typography>{store.gbpLocationId || '未連携'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="textSecondary">登録日</Typography>
            <Typography>
              {new Date(store.createdAt).toLocaleDateString('ja-JP')}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/posts?storeId=${store.id}`)}
        >
          この店舗の投稿を見る
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate(`/schedules?storeId=${store.id}`)}
        >
          この店舗のスケジュールを見る
        </Button>
      </Box>
    </Box>
  )
}
