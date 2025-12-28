'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function AddTestimonialPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        organization: '',
        quote: '',
        order: 0,
    })
    const [logo, setLogo] = useState<File | null>(null)

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
            formDataToSend.append('role', formData.role)
            formDataToSend.append('organization', formData.organization)
            formDataToSend.append('quote', formData.quote)
            formDataToSend.append('order', formData.order.toString())

            if (logo) {
                formDataToSend.append('logo', logo)
            }

            const response = await fetch('https://trizah-communications.onrender.com/api/testimonials', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            })

            if (response.ok) {
                router.push('/admin/dashboard/testimonials')
            } else {
                const error = await response.json()
                alert(`Failed to create testimonial: ${error.error}`)
            }
        } catch (error) {
            console.error('Error creating testimonial:', error)
            alert('Failed to create testimonial')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <div className="flex gap-2 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/admin/dashboard/testimonials')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Add New Testimonial</h1>
                <p className="text-muted-foreground mt-2">
                    Create a new client testimonial
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="e.g., Dr. Nancy Juma"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Input
                        id="role"
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                        placeholder="e.g., Assistant Director"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="organization">Organization *</Label>
                    <Input
                        id="organization"
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        required
                        placeholder="e.g., Center for African Bio-Entrepreneurship"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="quote">Testimonial Quote *</Label>
                    <Textarea
                        id="quote"
                        value={formData.quote}
                        onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                        required
                        placeholder="Enter the testimonial text..."
                        rows={8}
                        className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                        {formData.quote.length} characters
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="logo">Organization Logo (Optional)</Label>
                    <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogo(e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-muted-foreground">
                        Recommended size: 200x200px. Max size: 5MB
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                        id="order"
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">
                        Lower numbers appear first
                    </p>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1">
                        {loading ? 'Creating...' : 'Create Testimonial'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/dashboard/testimonials')}
                        className="flex-1">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}
