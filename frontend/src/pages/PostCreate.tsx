import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import api from '../utils/api'

export default function PostCreate() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    postType: 'NEWS',
    imageUrl: '',
    ctaType: '',
    ctaUrl: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      const fetchPost = async () => {
        try {
          const response = await api.get(`/posts/${id}`)
          const post = response.data.data
          setFormData({
            title: post.title || '',
            content: post.content,
            postType: post.postType,
            imageUrl: post.imageUrl || '',
            ctaType: post.ctaType || '',
            ctaUrl: post.ctaUrl || '',
          })
        } catch (error) {
          console.error('Failed to fetch post:', error)
        }
      }
      fetchPost()
    }
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) {
        await api.put(`/posts/${id}`, formData)
      } else {
        await api.post('/posts', formData)
      }
      navigate('/posts')
    } catch (error) {
      console.error('Failed to save post:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/posts')}
        sx={{ mb: 2 }}
      >
        戻る
      </Button>

      <Typography variant="h4" sx={{ mb: 3 }}>
        {isEdit ? '投稿編集' : '新規投稿'}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="タイトル"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="内容"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            margin="normal"
            required
            multiline
            rows={4}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>投稿種別</InputLabel>
            <Select
              value={formData.postType}
              label="投稿種別"
              onChange={(e) => setFormData({ ...formData, postType: e.target.value })}
            >
              <MenuItem value="NEWS">お知らせ</MenuItem>
              <MenuItem value="EVENT">イベント</MenuItem>
              <MenuItem value="OFFER">特典</MenuItem>
              <MenuItem value="PRODUCT">商品</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="画像URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>CTAタイプ</InputLabel>
            <Select
              value={formData.ctaType}
              label="CTAタイプ"
              onChange={(e) => setFormData({ ...formData, ctaType: e.target.value })}
            >
              <MenuItem value="">なし</MenuItem>
              <MenuItem value="BOOK">予約</MenuItem>
              <MenuItem value="ORDER">注文</MenuItem>
              <MenuItem value="SHOP">購入</MenuItem>
              <MenuItem value="LEARN_MORE">詳細</MenuItem>
              <MenuItem value="SIGN_UP">登録</MenuItem>
              <MenuItem value="CALL">電話</MenuItem>
            </Select>
          </FormControl>

          {formData.ctaType && (
            <TextField
              fullWidth
              label="CTA URL"
              value={formData.ctaUrl}
              onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
              margin="normal"
            />
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? '保存中...' : '保存'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/posts')}
            >
              キャンセル
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}
