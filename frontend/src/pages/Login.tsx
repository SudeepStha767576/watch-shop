import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'
import { toast } from 'sonner'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(username, password)
      toast.success('Login successful!')
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="text-center mt-4 text-sm text-muted-foreground space-y-1">
            <Link to="/forgot-password" className="text-accent hover:underline block">Forgot Password?</Link>
            <p>Don't have an account? <Link to="/signup" className="text-accent hover:underline">Sign up here</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
