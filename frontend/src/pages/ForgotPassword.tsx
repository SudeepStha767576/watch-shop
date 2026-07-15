import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { api, ApiError } from '@/lib/api'
import { toast } from 'sonner'
import { Watch } from 'lucide-react'

export default function ForgotPassword() {
  const [form, setForm] = useState({ username: '', dob: '', new_password: '', confirm_password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api('/auth/reset-password', { method: 'POST', body: JSON.stringify(form) })
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Watch className="h-10 w-10 text-amber-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your username and date of birth</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Username</Label><Input value={form.username} onChange={update('username')} required /></div>
          <div><Label>Date of Birth</Label><Input type="date" value={form.dob} onChange={update('dob')} required /></div>
          <div><Label>New Password (min 6 chars)</Label><Input type="password" value={form.new_password} onChange={update('new_password')} required minLength={6} /></div>
          <div><Label>Confirm New Password</Label><Input type="password" value={form.confirm_password} onChange={update('confirm_password')} required minLength={6} /></div>
          <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</Button>
        </form>
        <p className="text-center mt-6 text-sm text-muted-foreground">
          <Link to="/login" className="text-amber-600 hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  )
}
