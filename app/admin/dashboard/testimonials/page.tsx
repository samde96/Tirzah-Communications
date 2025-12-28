'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
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

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            if (!token) {
                router.push('/admin/login')
                return
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setTestimonials(data)
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return

        try {
            const token = localStorage.getItem('adminToken')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                fetchTestimonials()
            } else {
                alert('Failed to delete testimonial')
            }
        } catch (error) {
            console.error('Error deleting testimonial:', error)
            alert('Failed to delete testimonial')
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

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex gap-2 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/admin/dashboard')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Manage Testimonials</h1>
                    <p className="text-muted-foreground mt-2">
                        Add, edit, or remove client testimonials
                    </p>
                </div>
                <Button onClick={() => router.push('/admin/dashboard/testimonials/add')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Testimonial
                </Button>
            </div>

            {testimonials.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <p className="text-lg text-muted-foreground mb-4">No testimonials added yet</p>
                    <Button onClick={() => router.push('/admin/dashboard/testimonials/add')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Testimonial
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow">
                            <div className="flex gap-6">
                                {testimonial.logo && (
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_URL}${testimonial.logo}`}
                                            alt={testimonial.organization}
                                            width={80}
                                            height={80}
                                            className="object-contain rounded"
                                            unoptimized
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                            <p className="text-sm font-medium text-primary">{testimonial.organization}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">Order: {testimonial.order}</span>
                                    </div>
                                    <blockquote className="text-sm text-muted-foreground italic border-l-4 border-primary pl-4 mb-4">
                                        {testimonial.quote.length > 200
                                            ? `${testimonial.quote.substring(0, 200)}...`
                                            : testimonial.quote}
                                    </blockquote>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.push(`/admin/dashboard/testimonials/edit/${testimonial.id}`)
                                            }>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(testimonial.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
