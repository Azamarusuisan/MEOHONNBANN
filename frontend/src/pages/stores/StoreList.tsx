import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { storesApi, Store } from '../../api/stores.api';

export const StoreList: React.FC = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      const data = await storesApi.getAll();
      setStores(data);
    } catch (error) {
      console.error('店舗の読み込みに失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (params: GridRowParams) => {
    navigate(`/stores/${params.id}`);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70
    },
    {
      field: 'name',
      headerName: '店舗名',
      width: 200,
      flex: 1
    },
    {
      field: 'location_name',
      headerName: 'ロケーション名',
      width: 200,
      flex: 1
    },
    {
      field: 'address',
      headerName: '住所',
      width: 300,
      flex: 1
    },
    {
      field: 'phone',
      headerName: '電話番号',
      width: 150
    },
    {
      field: 'gbp_account_id',
      headerName: 'GBPアカウントID',
      width: 200
    },
    {
      field: 'created_at',
      headerName: '登録日',
      width: 180,
      valueFormatter: (params) => {
        return new Date(params).toLocaleString('ja-JP');
      }
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/stores/${params.row.id}`);
          }}
        >
          <EditIcon />
        </IconButton>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          店舗一覧
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/stores/new')}
        >
          新規店舗登録
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={stores}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 }
            }
          }}
          onRowClick={handleRowClick}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer'
            }
          }}
        />
      </Paper>
    </Box>
  );
};
