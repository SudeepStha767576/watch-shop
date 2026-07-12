import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'
import { toast } from 'sonner'

export default function Signup() {
  const [form, setForm] = useState({ full_name: '', username: '', email: '', phone: '', dob: '', address: '', password: '', confirm_password: '' })
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signup(form)
      toast.success('Account created! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Full Name</Label><Input value={form.full_name} onChange={update('full_name')} required /></div>
            <div><Label>Username</Label><Input value={form.username} onChange={update('username')} required /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={update('email')} required /></div>
            <div><Label>Phone Number</Label><Input value={form.phone} onChange={update('phone')} placeholder="98XXXXXXXX" required /></div>
            <div><Label>Date of Birth</Label><Input type="date" value={form.dob} onChange={update('dob')} required /></div>
            <div><Label>Address</Label><Input value={form.address} onChange={update('address')} placeholder="City, District" required /></div>
            <div><Label>Password (min 6 chars)</Label><Input type="password" value={form.password} onChange={update('password')} required minLength={6} /></div>
            <div><Label>Confirm Password</Label><Input type="password" value={form.confirm_password} onChange={update('confirm_password')} required minLength={6} /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</Button>
          </form>
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-accent hover:underline">Login here</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
