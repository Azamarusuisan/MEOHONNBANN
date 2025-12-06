import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Cancel as CancelIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { schedulesApi, Schedule, ScheduleStatus } from '../../api/schedules.api';

const scheduleStatusLabels: Record<ScheduleStatus, string> = {
  pending: '予約中',
  completed: '完了',
  cancelled: 'キャンセル',
  failed: '失敗'
};

const scheduleStatusColors: Record<ScheduleStatus, 'default' | 'primary' | 'success' | 'error' | 'warning'> = {
  pending: 'primary',
  completed: 'success',
  cancelled: 'default',
  failed: 'error'
};

export const ScheduleList: React.FC = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | 'all'>('all');

  useEffect(() => {
    loadSchedules();
  }, [statusFilter]);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      let data: Schedule[];

      if (statusFilter === 'all') {
        data = await schedulesApi.getAll();
      } else {
        data = await schedulesApi.getByStatus(statusFilter);
      }

      setSchedules(data);
    } catch (error) {
      console.error('スケジュールの読み込みに失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value as ScheduleStatus | 'all');
  };

  const handleCancel = async (scheduleId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!window.confirm('このスケジュールをキャンセルしますか？')) {
      return;
    }

    try {
      await schedulesApi.cancel(scheduleId);
      await loadSchedules();
    } catch (error) {
      console.error('スケジュールのキャンセルに失敗しました:', error);
    }
  };

  const handleViewPost = (postId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/posts/${postId}`);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70
    },
    {
      field: 'store_name',
      headerName: '店舗名',
      width: 150,
      valueGetter: (params, row) => row.post?.store?.name || '-'
    },
    {
      field: 'post_title',
      headerName: '投稿タイトル',
      width: 250,
      flex: 1,
      valueGetter: (params, row) => row.post?.title || '-'
    },
    {
      field: 'post_type',
      headerName: '投稿タイプ',
      width: 120,
      valueGetter: (params, row) => {
        const typeLabels: Record<string, string> = {
          event: 'イベント',
          offer: 'オファー',
          update: '更新情報',
          product: '商品'
        };
        return typeLabels[row.post?.post_type] || '-';
      }
    },
    {
      field: 'scheduled_at',
      headerName: '予約日時',
      width: 180,
      valueFormatter: (params) => {
        return new Date(params).toLocaleString('ja-JP');
      }
    },
    {
      field: 'status',
      headerName: 'ステータス',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={scheduleStatusLabels[params.value as ScheduleStatus]}
          size="small"
          color={scheduleStatusColors[params.value as ScheduleStatus]}
        />
      )
    },
    {
      field: 'executed_at',
      headerName: '実行日時',
      width: 180,
      valueFormatter: (params) => {
        return params ? new Date(params).toLocaleString('ja-JP') : '-';
      }
    },
    {
      field: 'error_message',
      headerName: 'エラーメッセージ',
      width: 200,
      flex: 1,
      valueGetter: (params) => params || '-'
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={(e) => handleViewPost(params.row.post_id, e)}
            title="投稿を表示"
          >
            <VisibilityIcon />
          </IconButton>
          {params.row.status === 'pending' && (
            <IconButton
              size="small"
              color="error"
              onClick={(e) => handleCancel(params.row.id, e)}
              title="キャンセル"
            >
              <CancelIcon />
            </IconButton>
          )}
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          予約一覧
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>ステータスフィルタ</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="ステータスフィルタ"
          >
            <MenuItem value="all">すべて</MenuItem>
            {Object.entries(scheduleStatusLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={schedules}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 }
            },
            sorting: {
              sortModel: [{ field: 'scheduled_at', sort: 'desc' }]
            }
          }}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
};
