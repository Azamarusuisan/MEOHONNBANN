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
import { customersApi, Customer, CreateCustomerDto, UpdateCustomerDto } from '../../api/customers.api';

export const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewCustomer = id === 'new';

  const [customer, setCustomer] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    line_user_id: ''
  });
  const [loading, setLoading] = useState(!isNewCustomer);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!isNewCustomer && id) {
      loadCustomer(parseInt(id));
    }
  }, [id]);

  const loadCustomer = async (customerId: number) => {
    try {
      setLoading(true);
      const data = await customersApi.getById(customerId);
      setCustomer(data);
    } catch (error) {
      console.error('顧客の読み込みに失敗しました:', error);
      setError('顧客情報の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (isNewCustomer) {
        const newCustomer = await customersApi.create(customer as CreateCustomerDto);
        setSuccess('顧客を登録しました');
        setTimeout(() => {
          navigate(`/customers/${newCustomer.id}`);
        }, 1500);
      } else if (id) {
        await customersApi.update(parseInt(id), customer as UpdateCustomerDto);
        setSuccess('顧客情報を更新しました');
        await loadCustomer(parseInt(id));
      }
    } catch (error) {
      console.error('保存に失敗しました:', error);
      setError('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isNewCustomer) return;

    try {
      setSaving(true);
      await customersApi.delete(parseInt(id));
      setSuccess('顧客を削除しました');
      setTimeout(() => {
        navigate('/customers');
      }, 1500);
    } catch (error) {
      console.error('削除に失敗しました:', error);
      setError('削除に失敗しました');
      setSaving(false);
    }
    setDeleteDialogOpen(false);
  };

  const handleChange = (field: keyof Customer) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomer({ ...customer, [field]: event.target.value });
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
            onClick={() => navigate('/customers')}
          >
            戻る
          </Button>
          <Typography variant="h4" component="h1">
            {isNewCustomer ? '新規顧客登録' : '顧客詳細'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {!isNewCustomer && (
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
            disabled={saving || !customer.name || !customer.email || !customer.phone}
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
              label="名前"
              value={customer.name || ''}
              onChange={handleChange('name')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="メールアドレス"
              type="email"
              value={customer.email || ''}
              onChange={handleChange('email')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="電話番号"
              value={customer.phone || ''}
              onChange={handleChange('phone')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="LINE ユーザーID"
              value={customer.line_user_id || ''}
              onChange={handleChange('line_user_id')}
            />
          </Grid>
          {!isNewCustomer && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="登録日"
                  value={customer.created_at ? new Date(customer.created_at).toLocaleString('ja-JP') : ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="更新日"
                  value={customer.updated_at ? new Date(customer.updated_at).toLocaleString('ja-JP') : ''}
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
        <DialogTitle>顧客の削除</DialogTitle>
        <DialogContent>
          本当にこの顧客を削除しますか？この操作は取り消せません。
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
