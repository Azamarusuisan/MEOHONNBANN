import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ja';
import dayjs, { Dayjs } from 'dayjs';
import { Save as SaveIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon, Publish as PublishIcon } from '@mui/icons-material';
import { postsApi, Post, CreatePostDto, UpdatePostDto, PostType } from '../../api/posts.api';
import { storesApi, Store } from '../../api/stores.api';

const postTypeLabels: Record<PostType, string> = {
  event: 'イベント',
  offer: 'オファー',
  update: '更新情報',
  product: '商品'
};

export const PostCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewPost = id === 'new';

  const [post, setPost] = useState<Partial<Post>>({
    store_id: 0,
    post_type: 'update',
    title: '',
    content: '',
    image_url: '',
    status: 'draft'
  });
  const [scheduledAt, setScheduledAt] = useState<Dayjs | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(!isNewPost);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadStores();
    if (!isNewPost && id) {
      loadPost(parseInt(id));
    }
  }, [id]);

  const loadStores = async () => {
    try {
      const data = await storesApi.getAll();
      setStores(data);
    } catch (error) {
      console.error('店舗の読み込みに失敗しました:', error);
    }
  };

  const loadPost = async (postId: number) => {
    try {
      setLoading(true);
      const data = await postsApi.getById(postId);
      setPost(data);
      if (data.scheduled_at) {
        setScheduledAt(new Date(data.scheduled_at));
      }
    } catch (error) {
      console.error('投稿の読み込みに失敗しました:', error);
      setError('投稿情報の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (publish: boolean = false) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const postData = {
        ...post,
        scheduled_at: scheduledAt?.toISOString()
      };

      if (isNewPost) {
        const newPost = await postsApi.create(postData as CreatePostDto);
        if (publish) {
          await postsApi.publish(newPost.id);
        }
        setSuccess(publish ? '投稿を公開しました' : '投稿を作成しました');
        setTimeout(() => {
          navigate('/posts');
        }, 1500);
      } else if (id) {
        await postsApi.update(parseInt(id), postData as UpdatePostDto);
        if (publish) {
          await postsApi.publish(parseInt(id));
        }
        setSuccess(publish ? '投稿を公開しました' : '投稿を更新しました');
        await loadPost(parseInt(id));
      }
    } catch (error) {
      console.error('保存に失敗しました:', error);
      setError('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isNewPost) return;

    try {
      setSaving(true);
      await postsApi.delete(parseInt(id));
      setSuccess('投稿を削除しました');
      setTimeout(() => {
        navigate('/posts');
      }, 1500);
    } catch (error) {
      console.error('削除に失敗しました:', error);
      setError('削除に失敗しました');
      setSaving(false);
    }
    setDeleteDialogOpen(false);
  };

  const handleChange = (field: keyof Post) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setPost({ ...post, [field]: event.target.value });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/posts')}
            >
              戻る
            </Button>
            <Typography variant="h4" component="h1">
              {isNewPost ? '新規投稿作成' : '投稿編集'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isNewPost && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                disabled={saving}
              >
                削除
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={() => handleSave(false)}
              disabled={saving || !post.store_id || !post.title || !post.content}
            >
              下書き保存
            </Button>
            <Button
              variant="contained"
              startIcon={<PublishIcon />}
              onClick={() => handleSave(true)}
              disabled={saving || !post.store_id || !post.title || !post.content}
            >
              {saving ? '処理中...' : '公開'}
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>対象店舗</InputLabel>
                <Select
                  value={post.store_id || ''}
                  onChange={(e) => setPost({ ...post, store_id: e.target.value as number })}
                  label="対象店舗"
                >
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>投稿タイプ</InputLabel>
                <Select
                  value={post.post_type || 'update'}
                  onChange={(e) => setPost({ ...post, post_type: e.target.value as PostType })}
                  label="投稿タイプ"
                >
                  {Object.entries(postTypeLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="タイトル"
                value={post.title || ''}
                onChange={handleChange('title')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={6}
                label="本文"
                value={post.content || ''}
                onChange={handleChange('content')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="画像URL"
                value={post.image_url || ''}
                onChange={handleChange('image_url')}
                helperText="投稿に表示する画像のURLを入力してください"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="予約日時"
                value={scheduledAt}
                onChange={(newValue) => setScheduledAt(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    helperText: '指定した日時に自動的に投稿を公開します'
                  }
                }}
              />
            </Grid>
            {!isNewPost && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="作成日"
                    value={post.created_at ? new Date(post.created_at).toLocaleString('ja-JP') : ''}
                    disabled
                  />
                </Grid>
                {post.published_at && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="公開日時"
                      value={new Date(post.published_at).toLocaleString('ja-JP')}
                      disabled
                    />
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Paper>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>投稿の削除</DialogTitle>
          <DialogContent>
            本当にこの投稿を削除しますか？この操作は取り消せません。
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              削除
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};
