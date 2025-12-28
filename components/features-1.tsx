"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect } from "react"

interface WorkItem {
  id: string
  title: string
  category: string
  mediaType: "image" | "video"
  mediaSrc: string
  videoSrc?: string
  description: string
  link?: string
  isActive: boolean
}

export default function Features() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [workItems, setWorkItems] = useState<WorkItem[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [loading, setLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchPortfolioItems()
  }, [])

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio?isActive=true`)
      const data: WorkItem[] = await response.json()

      setWorkItems(data)

      // Extract unique categories
      const categorySet = new Set<string>(data.map((item) => item.category))
      const uniqueCategories: string[] = ["All", ...Array.from(categorySet)]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching portfolio items:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredWork =
    activeCategory === "All" ? workItems : workItems.filter((item: WorkItem) => item.category === activeCategory)

  // Reset scroll position when category changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0
      setScrollPosition(0)
    }
  }, [activeCategory])

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  const handleScrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft)
    }
  }

  const isAtStart = scrollPosition === 0
  const isAtEnd = scrollRef.current
    ? scrollPosition >= scrollRef.current.scrollWidth - scrollRef.current.offsetWidth - 10
    : false

  if (loading) {
    return (
      <section className="bg-background py-16 md:py-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-muted-foreground">Loading portfolio items...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="bg-background py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-balance text-2xl font-regular lg:text-3xl">Recent work</h2>
          </div>
          <div className="hidden md:flex gap-4">
            {categories.map((category: string) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "text-foreground underline decoration-[#261592] decoration-2 underline-offset-4 cursor-pointer"
                    : "text-muted-foreground hover:text-foreground cursor-pointer"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="md:hidden mt-4">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {categories.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="mt-12 flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredWork.map((work: WorkItem) => (
            <Card
              key={work.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-full min-[500px]:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] snap-start"
            >
              <Link href={`/portfolio/${work.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  {work.mediaType === "image" ? (
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
                  <p className="text-xs font-light text-gray-400 tracking-wider">{work.category}</p>
                  <h3 className="mt-2 text-xl font-semibold group-hover:text-primary transition-colors">
                    {work.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{work.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {filteredWork.length > 3 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={handleScrollLeft}
              disabled={isAtStart}
              className="flex items-center justify-center size-10 rounded-full border bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleScrollRight}
              disabled={isAtEnd}
              className="flex items-center justify-center size-10 rounded-full border bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
