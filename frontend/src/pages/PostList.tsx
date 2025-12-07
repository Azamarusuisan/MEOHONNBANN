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
  Chip,
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import api from '../utils/api'

interface Post {
  id: string
  title: string | null
  content: string
  postType: string
  isActive: boolean
  createdAt: string
}

const postTypeLabels: Record<string, string> = {
  NEWS: 'お知らせ',
  EVENT: 'イベント',
  OFFER: '特典',
  PRODUCT: '商品',
}

export default function PostList() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts')
      setPosts(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm('この投稿を削除しますか？')) {
      try {
        await api.delete(`/posts/${id}`)
        fetchPosts()
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    }
  }

  if (loading) {
    return <Typography>読み込み中...</Typography>
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">投稿管理</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/posts/new')}
        >
          新規投稿
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>タイトル</TableCell>
              <TableCell>内容</TableCell>
              <TableCell>種別</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>作成日</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title || '-'}</TableCell>
                <TableCell>
                  {post.content.length > 50
                    ? post.content.substring(0, 50) + '...'
                    : post.content}
                </TableCell>
                <TableCell>
                  <Chip
                    label={postTypeLabels[post.postType] || post.postType}
                    size="small"
                  />
                </TableCell>
                <TableCell>{post.isActive ? '有効' : '無効'}</TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/posts/${post.id}/edit`)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(post.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  投稿が登録されていません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
