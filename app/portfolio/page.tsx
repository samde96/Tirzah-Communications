'use client';

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { HeroHeader } from '@/components/header'
import Footer from '@/components/footer';

interface WorkItem {
    id: string
    title: string
    category: string
    mediaType: 'image' | 'video'
    mediaSrc: string
    videoSrc?: string
    description: string
    link?: string
    isActive: boolean
}

export default function PortfolioPage() {
    const [activeCategory, setActiveCategory] = useState('All')
    const [workItems, setWorkItems] = useState<WorkItem[]>([])
    const [categories, setCategories] = useState<string[]>(['All'])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPortfolioItems()
    }, [])

    const fetchPortfolioItems = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio?isActive=true`)
            const data = await response.json()

            setWorkItems(data)

            // Extract unique categories
            const uniqueCategories = ['All', ...new Set(data.map((item: WorkItem) => item.category))]
            setCategories(uniqueCategories as string[])
        } catch (error) {
            console.error('Error fetching portfolio items:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredWork = activeCategory === 'All'
        ? workItems
        : workItems.filter((item: WorkItem) => item.category === activeCategory)

    if (loading) {
        return (
            <>
                <HeroHeader />
                <section className="bg-background py-16 md:py-32 min-h-screen">
                    <div className="mx-auto max-w-7xl px-6 text-center">
                        <p className="text-muted-foreground">Loading portfolio items...</p>
                    </div>
                </section>
            </>
        )
    }

    return (
        <>
            <HeroHeader />
            <section className="bg-background py-16 md:py-32 min-h-screen">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">Portfolio</h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            A showcase of our recent projects delivered to our partners
                        </p>
                    </div>

                    {/* Category Filters */}
                    <div className="flex items-center justify-center gap-4 mb-12 flex-wrap">
                        {categories.map((category: string) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`text-sm font-medium transition-colors ${
                                    activeCategory === category
                                        ? 'text-foreground underline decoration-[#261592] decoration-2 underline-offset-4 cursor-pointer'
                                        : 'text-muted-foreground hover:text-foreground cursor-pointer'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Portfolio Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredWork.map((work: WorkItem) => (
                            <Card
                                key={work.id}
                                className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <Link href={`/portfolio/${work.id}`}>
                                    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                        {work.mediaType === 'image' ? (
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_API_URL}${work.mediaSrc}`}
                                                alt={work.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                unoptimized
                                            />
                                        ) : (
                                            <video
                                                src={`${process.env.NEXT_PUBLIC_API_URL}${work.videoSrc}`}
                                                className="h-full w-full object-cover"
                                                muted
                                                loop
                                                playsInline
                                                onMouseEnter={(e) => e.currentTarget.play()}
                                                onMouseLeave={(e) => e.currentTarget.pause()}
                                            />
                                        )}
                                    </div>
                                    <CardContent className="p-6">
                                        <p className="text-xs font-light text-gray-400  tracking-wider">
                                            {work.category}
                                        </p>
                                        <h3 className="mt-2 text-xl font-semibold group-hover:text-primary transition-colors">
                                            {work.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {work.description}
                                        </p>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredWork.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No portfolio items found in this category.</p>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </>
    )
}
