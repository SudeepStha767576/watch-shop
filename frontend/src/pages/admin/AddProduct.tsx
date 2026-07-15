import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api, ApiError } from '@/lib/api'
import { toast } from 'sonner'
import type { Category } from '@/types'
import { ArrowLeft, Upload } from 'lucide-react'

export default function AddProduct() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', category_id: '', description: '', price: '', quantity: '' })
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    api<{ categories: Category[] }>('/categories').then((d) => setCategories(d.categories))
  }, [])

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setPreview((ev.target?.result as string) ?? null)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('category_id', form.category_id)
      fd.append('description', form.description)
      fd.append('price', form.price)
      fd.append('quantity', form.quantity)
      if (image) fd.append('image', image)

      await api('/admin/products', { method: 'POST', body: fd })
      toast.success('Product added!')
      navigate('/admin/products')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>
      <h1 className="text-2xl font-bold mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div><Label>Product Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>

        <div>
          <Label>Category</Label>
          <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v ?? '' })}>
            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} /></div>

        <div className="grid grid-cols-2 gap-4">
          <div><Label>Price (NPR)</Label><Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
          <div><Label>Stock Quantity</Label><Input type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required /></div>
        </div>

        <div>
          <Label>Product Image</Label>
          <div className="mt-1 border-2 border-dashed rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors cursor-pointer" onClick={() => document.getElementById('img-input')?.click()}>
            {preview ? (
              <img src={preview} alt="Preview" className="mx-auto w-40 h-40 object-contain rounded" />
            ) : (
              <div className="text-muted-foreground">
                <Upload className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Click to upload image</p>
                <p className="text-xs mt-1">JPEG, PNG, WebP - max 2MB</p>
              </div>
            )}
          </div>
          <Input id="img-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} className="hidden" />
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold">
          {loading ? 'Adding...' : 'Add Product'}
        </Button>
      </form>
    </div>
  )
}
