import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Users as UsersIcon, Trash2, Shield, UserCircle } from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import { toast } from 'sonner'

interface UserItem {
  id: number
  full_name: string
  username: string
  email: string
  phone: string
  address: string
  role: 'user' | 'admin'
  created_at: string
}

export default function Users() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)

  const fetchUsers = () => {
    api<{ users: UserItem[] }>('/admin/users')
      .then((data) => setUsers(data.users))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const admins = users.filter((u) => u.role === 'admin')
  const normalUsers = users.filter((u) => u.role === 'user')

  const handleDelete = async (id: number) => {
    setDeleting(id)
    try {
      await api(`/admin/users/${id}`, { method: 'DELETE' })
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success('User deleted')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete user')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <UsersIcon className="h-6 w-6 text-amber-500" />
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <Badge variant="secondary" className="ml-auto text-xs">{users.length} users</Badge>
      </div>

      {users.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">No users found.</p>
      ) : (
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-500">Administrators</h2>
              <Badge variant="secondary" className="text-[10px]">{admins.length}</Badge>
            </div>
            <div className="space-y-3">
              {admins.map((u) => (
                <div key={u.id} className="flex items-center gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="h-10 w-10 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{u.full_name}</p>
                    <p className="text-sm text-muted-foreground truncate">@{u.username} &middot; {u.email} &middot; {u.phone}</p>
                  </div>
                  <p className="text-xs text-muted-foreground hidden md:block shrink-0">
                    {new Date(u.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Customers</h2>
              <Badge variant="secondary" className="text-[10px]">{normalUsers.length}</Badge>
            </div>
            {normalUsers.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground text-sm">No customers yet.</p>
            ) : (
              <div className="space-y-3">
                {normalUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-4 rounded-xl border p-4 hover:border-amber-500/20 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <UserCircle className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{u.full_name}</p>
                      <p className="text-sm text-muted-foreground truncate">@{u.username} &middot; {u.email} &middot; {u.phone}</p>
                    </div>
                    <p className="text-xs text-muted-foreground hidden md:block shrink-0">
                      {new Date(u.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                    {confirmId === u.id ? (
                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="sm" variant="destructive" onClick={() => { handleDelete(u.id); setConfirmId(null) }} disabled={deleting === u.id}>
                          {deleting === u.id ? '...' : 'Yes'}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>No</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => setConfirmId(u.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
