'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface Testimonial {
    id: string
    name: string
    role: string
    organization: string
    logo?: string
    quote: string
    order: number
    isActive: boolean
}

export default function EditTestimonialPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [testimonial, setTestimonial] = useState<Testimonial | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        organization: '',
        quote: '',
        order: 0,
    })
    const [logo, setLogo] = useState<File | null>(null)

    useEffect(() => {
        fetchTestimonial()
    }, [id])

    const fetchTestimonial = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            if (!token) {
                router.push('/admin/login')
                return
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setTestimonial(data)
                setFormData({
                    name: data.name,
                    role: data.role,
                    organization: data.organization,
                    quote: data.quote,
                    order: data.order,
                })
            } else {
                alert('Testimonial not found')
                router.push('/admin/dashboard/testimonials')
            }
        } catch (error) {
            console.error('Error fetching testimonial:', error)
            alert('Failed to load testimonial')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            })

            if (response.ok) {
                router.push('/admin/dashboard/testimonials')
            } else {
                const error = await response.json()
                alert(`Failed to update testimonial: ${error.error}`)
            }
        } catch (error) {
            console.error('Error updating testimonial:', error)
            alert('Failed to update testimonial')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    if (!testimonial) {
        return null
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
                <h1 className="text-3xl font-bold">Edit Testimonial</h1>
                <p className="text-muted-foreground mt-2">
                    Update testimonial information
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
                    <Label htmlFor="logo">Organization Logo</Label>
                    {testimonial.logo && !logo && (
                        <div className="mb-3 p-4 border rounded-lg bg-muted/30">
                            <p className="text-sm text-muted-foreground mb-2">Current logo:</p>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}${testimonial.logo}`}
                                alt={testimonial.organization}
                                width={100}
                                height={100}
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                    )}
                    <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogo(e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-muted-foreground">
                        {logo ? 'New logo selected' : 'Upload a new logo to replace the current one'}
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
                        disabled={submitting}
                        className="flex-1">
                        {submitting ? 'Updating...' : 'Update Testimonial'}
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
