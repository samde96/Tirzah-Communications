'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { API_URL } from '@/lib/config'

type Testimonial = {
    id: string
    name: string
    role: string
    organization: string
    logo?: string
    quote: string
    order: number
}

export default function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch(`${API_URL}/api/testimonials`)
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

        fetchTestimonials()
    }, [])

    if (loading) {
        return (
            <section className="bg-muted/30 py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-black">
                        What do our clients say.
                    </h2>
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                </div>
            </section>
        )
    }

    if (testimonials.length === 0) {
        return null
    }

    return (
        <section className="bg-muted/30 text-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-sm uppercase tracking-wider text-black mb-4">
                        Feedbacks and Reviews
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-black">
                        What do our clients say.
                    </h2>
                </div>

                {/* Testimonials */}
                <div className="max-w-4xl mx-auto space-y-6">
                    {testimonials.map((testimonial) => (
                        <Card
                            key={testimonial.id}
                            className="bg-white text-black border-0">
                            <CardContent className="p-6">
                                {/* Quote Icon */}
                                <div className="mb-4">
                                    <svg
                                        className="w-10 h-10 text-[#241685]"
                                        fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                                    </svg>
                                </div>

                                {/* Quote Text */}
                                <blockquote className="mb-6">
                                    <p className="text-sm leading-relaxed">
                                        {testimonial.quote}
                                    </p>
                                </blockquote>

                                {/* Author Info */}
                                <div className="flex items-center justify-between pt-4 border-t">
                                    {testimonial.logo && (
                                        <div className="shrink-0">
                                            <Image
                                                src={`${API_URL}${testimonial.logo}`}
                                                alt={testimonial.organization}
                                                width={50}
                                                height={50}
                                                className="object-contain"
                                                unoptimized
                                            />
                                        </div>
                                    )}
                                    <div className="text-right">
                                        <h4 className="font-semibold text-sm mb-1">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-xs text-gray-600">
                                            {testimonial.role}
                                        </p>
                                        <p className="text-xs text-[#1d8bca] font-medium">
                                            {testimonial.organization}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
