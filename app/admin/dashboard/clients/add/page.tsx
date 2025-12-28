'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

export default function AddClientPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        order: 0,
    })
    const [logo, setLogo] = useState<File | null>(null)
    const [preview, setPreview] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setLogo(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = localStorage.getItem('adminToken')
            if (!token) {
                router.push('/admin/login')
                return
            }

            const formDataToSend = new FormData()
            formDataToSend.append('name', formData.name)
            formDataToSend.append('order', formData.order.toString())
            if (logo) {
                formDataToSend.append('logo', logo)
            }

            const response = await fetch('https://trizah-communications.onrender.com/api/clients', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            })

            if (response.ok) {
                router.push('/admin/dashboard/clients')
            } else {
                const data = await response.json()
                alert(data.error || 'Failed to add client')
            }
        } catch (error) {
            console.error('Error adding client:', error)
            alert('Failed to add client')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            <div className="flex gap-2 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button
                    variant="outline"
                    onClick={() => router.push('/admin/dashboard')}
                >
                    <Home className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>

            <h1 className="text-3xl font-bold mb-8">Add New Client</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                        Client Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Enter client name"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="logo" className="text-sm font-medium">
                        Client Logo <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        id="logo"
                        required
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {preview && (
                        <div className="mt-4 flex items-center justify-center p-6 border rounded-lg bg-muted/30">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-h-32 object-contain"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="order" className="text-sm font-medium">
                        Display Order
                    </label>
                    <input
                        type="number"
                        id="order"
                        value={formData.order}
                        onChange={(e) =>
                            setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="0"
                    />
                    <p className="text-sm text-muted-foreground">
                        Lower numbers appear first
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1">
                        {loading ? 'Adding...' : 'Add Client'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex-1">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}
