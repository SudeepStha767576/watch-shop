import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8"><Skeleton className="h-64 w-full" /></div>
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function AdminRoute() {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <div className="p-8"><Skeleton className="h-64 w-full" /></div>
  if (!user || !isAdmin) return <Navigate to="/login" replace />
  return <Outlet />
}
