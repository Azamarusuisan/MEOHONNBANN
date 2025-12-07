import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Card,
  CardContent,
} from '@mui/material'
import { ArrowBack, Store } from '@mui/icons-material'
import api from '../utils/api'

interface Customer {
  id: string
  name: string
  companyName: string | null
  email: string | null
  phone: string | null
  notes: string | null
  isActive: boolean
  createdAt: string
  stores?: Array<{
    id: string
    name: string
    address: string | null
  }>
}

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(`/customers/${id}`)
        setCustomer(response.data.data)
      } catch (error) {
        console.error('Failed to fetch customer:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [id])

  if (loading) {
    return <Typography>読み込み中...</Typography>
  }

  if (!customer) {
    return <Typography>顧客が見つかりません</Typography>
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/customers')}
        sx={{ mb: 2 }}
      >
        戻る
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4">{customer.name}</Typography>
          <Chip
            label={customer.isActive ? '有効' : '無効'}
            color={customer.isActive ? 'success' : 'default'}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography color="textSecondary">会社名</Typography>
            <Typography>{customer.companyName || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="textSecondary">メールアドレス</Typography>
            <Typography>{customer.email || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="textSecondary">電話番号</Typography>
            <Typography>{customer.phone || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="textSecondary">登録日</Typography>
            <Typography>
              {new Date(customer.createdAt).toLocaleDateString('ja-JP')}
            </Typography>
          </Grid>
          {customer.notes && (
            <Grid item xs={12}>
              <Typography color="textSecondary">備考</Typography>
              <Typography>{customer.notes}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Typography variant="h5" sx={{ mb: 2 }}>
        店舗一覧
      </Typography>
      <Grid container spacing={2}>
        {customer.stores && customer.stores.length > 0 ? (
          customer.stores.map((store) => (
            <Grid item xs={12} md={4} key={store.id}>
              <Card
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/stores/${store.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Store sx={{ mr: 1 }} />
                    <Typography variant="h6">{store.name}</Typography>
                  </Box>
                  <Typography color="textSecondary">
                    {store.address || '住所未設定'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography color="textSecondary">店舗が登録されていません</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
