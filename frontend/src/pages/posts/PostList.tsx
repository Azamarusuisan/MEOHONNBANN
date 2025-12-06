import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Publish as PublishIcon } from '@mui/icons-material';
import { postsApi, Post, PostType, PostStatus } from '../../api/posts.api';

const postTypeLabels: Record<PostType, string> = {
  event: 'イベント',
  offer: 'オファー',
  update: '更新情報',
  product: '商品'
};

const postStatusLabels: Record<PostStatus, string> = {
  draft: '下書き',
  scheduled: '予約済み',
  published: '公開済み',
  failed: '失敗'
};

const postStatusColors: Record<PostStatus, 'default' | 'primary' | 'success' | 'error'> = {
  draft: 'default',
  scheduled: 'primary',
  published: 'success',
  failed: 'error'
};

export const PostList: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postsApi.getAll();
      setPosts(data);
    } catch (error) {
      console.error('投稿の読み込みに失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (params: GridRowParams) => {
    navigate(`/posts/${params.id}`);
  };

  const handlePublish = async (postId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      await postsApi.publish(postId);
      await loadPosts();
    } catch (error) {
      console.error('投稿の公開に失敗しました:', error);
    }
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
      valueGetter: (params, row) => row.store?.name || '-'
    },
    {
      field: 'post_type',
      headerName: '投稿タイプ',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={postTypeLabels[params.value as PostType]}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'title',
      headerName: 'タイトル',
      width: 250,
      flex: 1
    },
    {
      field: 'status',
      headerName: 'ステータス',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={postStatusLabels[params.value as PostStatus]}
          size="small"
          color={postStatusColors[params.value as PostStatus]}
        />
      )
    },
    {
      field: 'scheduled_at',
      headerName: '予約日時',
      width: 180,
      valueFormatter: (params) => {
        return params ? new Date(params).toLocaleString('ja-JP') : '-';
      }
    },
    {
      field: 'published_at',
      headerName: '公開日時',
      width: 180,
      valueFormatter: (params) => {
        return params ? new Date(params).toLocaleString('ja-JP') : '-';
      }
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
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/posts/${params.row.id}`);
            }}
          >
            <EditIcon />
          </IconButton>
          {params.row.status === 'draft' && (
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => handlePublish(params.row.id, e)}
            >
              <PublishIcon />
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
          投稿一覧
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/posts/new')}
        >
          新規投稿作成
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={posts}
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
