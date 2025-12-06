import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import MainLayout from './components/Layout/MainLayout'
import LoadingSpinner from './components/common/LoadingSpinner'

// Lazy load pages
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const CustomerList = lazy(() => import('./pages/CustomerList'))
const CustomerDetail = lazy(() => import('./pages/CustomerDetail'))
const StoreList = lazy(() => import('./pages/StoreList'))
const StoreDetail = lazy(() => import('./pages/StoreDetail'))
const PostList = lazy(() => import('./pages/PostList'))
const PostCreate = lazy(() => import('./pages/PostCreate'))
const ScheduleList = lazy(() => import('./pages/ScheduleList'))

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Customer routes */}
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/:id" element={<CustomerDetail />} />

          {/* Store routes */}
          <Route path="stores" element={<StoreList />} />
          <Route path="stores/:id" element={<StoreDetail />} />

          {/* Post routes */}
          <Route path="posts" element={<PostList />} />
          <Route path="posts/new" element={<PostCreate />} />
          <Route path="posts/:id/edit" element={<PostCreate />} />

          {/* Schedule routes */}
          <Route path="schedules" element={<ScheduleList />} />

          {/* Legacy routes */}
          <Route path="reviews" element={<div>レビュー管理（準備中）</div>} />
          <Route path="line" element={<div>LINE連携（準備中）</div>} />
          <Route path="settings" element={<div>設定（準備中）</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
