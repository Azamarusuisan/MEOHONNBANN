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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Save as SaveIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { storesApi, Store, CreateStoreDto, UpdateStoreDto } from '../../api/stores.api';

export const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewStore = id === 'new';

  const [store, setStore] = useState<Partial<Store>>({
    name: '',
    location_name: '',
    address: '',
    phone: '',
    gbp_account_id: ''
  });
  const [loading, setLoading] = useState(!isNewStore);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!isNewStore && id) {
      loadStore(parseInt(id));
    }
  }, [id]);

  const loadStore = async (storeId: number) => {
    try {
      setLoading(true);
      const data = await storesApi.getById(storeId);
      setStore(data);
    } catch (error) {
      console.error('店舗の読み込みに失敗しました:', error);
      setError('店舗情報の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (isNewStore) {
        const newStore = await storesApi.create(store as CreateStoreDto);
        setSuccess('店舗を登録しました');
        setTimeout(() => {
          navigate(`/stores/${newStore.id}`);
        }, 1500);
      } else if (id) {
        await storesApi.update(parseInt(id), store as UpdateStoreDto);
        setSuccess('店舗情報を更新しました');
        await loadStore(parseInt(id));
      }
    } catch (error) {
      console.error('保存に失敗しました:', error);
      setError('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isNewStore) return;

    try {
      setSaving(true);
      await storesApi.delete(parseInt(id));
      setSuccess('店舗を削除しました');
      setTimeout(() => {
        navigate('/stores');
      }, 1500);
    } catch (error) {
      console.error('削除に失敗しました:', error);
      setError('削除に失敗しました');
      setSaving(false);
    }
    setDeleteDialogOpen(false);
  };

  const handleChange = (field: keyof Store) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStore({ ...store, [field]: event.target.value });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/stores')}
          >
            戻る
          </Button>
          <Typography variant="h4" component="h1">
            {isNewStore ? '新規店舗登録' : '店舗詳細'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {!isNewStore && (
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
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving || !store.name || !store.location_name || !store.address || !store.phone}
          >
            {saving ? '保存中...' : '保存'}
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
            <TextField
              fullWidth
              required
              label="店舗名"
              value={store.name || ''}
              onChange={handleChange('name')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="ロケーション名"
              value={store.location_name || ''}
              onChange={handleChange('location_name')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="住所"
              value={store.address || ''}
              onChange={handleChange('address')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="電話番号"
              value={store.phone || ''}
              onChange={handleChange('phone')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="GBPアカウントID"
              value={store.gbp_account_id || ''}
              onChange={handleChange('gbp_account_id')}
            />
          </Grid>
          {!isNewStore && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="登録日"
                  value={store.created_at ? new Date(store.created_at).toLocaleString('ja-JP') : ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="更新日"
                  value={store.updated_at ? new Date(store.updated_at).toLocaleString('ja-JP') : ''}
                  disabled
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>店舗の削除</DialogTitle>
        <DialogContent>
          本当にこの店舗を削除しますか？この操作は取り消せません。
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
  );
};
