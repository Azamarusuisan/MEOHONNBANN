import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import StarIcon from '@mui/icons-material/Star'
import ChatIcon from '@mui/icons-material/Chat'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

const Dashboard = () => {
  const stats = [
    {
      title: '総顧客数',
      value: '1,234',
      icon: <PeopleIcon />,
      color: '#1976d2',
      change: '+12%',
    },
    {
      title: 'レビュー数',
      value: '567',
      icon: <StarIcon />,
      color: '#f57c00',
      change: '+8%',
    },
    {
      title: 'LINE友だち',
      value: '890',
      icon: <ChatIcon />,
      color: '#06c755',
      change: '+15%',
    },
    {
      title: '今月の成長率',
      value: '23%',
      icon: <TrendingUpIcon />,
      color: '#d32f2f',
      change: '+5%',
    },
  ]

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        ダッシュボード
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5">{stat.value}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="success.main">
                  {stat.change} 前月比
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              レビュー推移
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                color: 'text.secondary',
              }}
            >
              グラフエリア（準備中）
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              最近のアクティビティ
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                データ取得中...
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              最新レビュー
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: 'text.secondary',
              }}
            >
              レビュー一覧（準備中）
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
