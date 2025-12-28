'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { Variants, Transition } from 'framer-motion'
import { HeroHeader } from './header'
import { useState, useEffect, useRef } from 'react'

const transitionVariants: { item: Variants } = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            } as Transition,
        },
    },
}

const videos = [
    { mp4: '/videos/hero-video-1.mp4', webm: '/videos/hero-video-1.webm' },
    { mp4: '/videos/hero-video-2.mp4', webm: '/videos/hero-video-2.webm' },
    { mp4: '/videos/Video_7.mp4', webm: '/videos/Video_7.webm' },
]

export default function HeroSection() {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [showVideo, setShowVideo] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    // Start showing videos after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowVideo(true)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!showVideo) return

        const video = videoRef.current
        if (!video) return

        const handleVideoEnd = () => {
            setIsTransitioning(true)

            // Wait for fade out
            setTimeout(() => {
                setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
                setIsTransitioning(false)
            }, 500)
        }

        video.addEventListener('ended', handleVideoEnd)

        return () => {
            video.removeEventListener('ended', handleVideoEnd)
        }
    }, [showVideo])

    // Reset video when index changes
    useEffect(() => {
        if (!showVideo) return

        const video = videoRef.current
        if (video) {
            video.load()
            video.play().catch(err => console.log('Video play error:', err))
        }
    }, [currentVideoIndex, showVideo])

    return (
        <>
            <HeroHeader />
            <main className="relative min-h-screen overflow-hidden">
                {/* Background - Blue Gradient or Video */}
                <div className="absolute inset-0 w-full h-screen">
                    {/* Blue Gradient Background - Always visible */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#241588] via-[#1d8bca] to-[#56a7d7]" />

                    {/* Video Background - Fades in after 3 seconds */}
                    {showVideo && (
                        <>
                            <video
                                ref={videoRef}
                                muted
                                playsInline
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                                    isTransitioning ? 'opacity-0' : 'opacity-100'
                                }`}
                            >
                                <source src={videos[currentVideoIndex].mp4} type="video/mp4" />
                                <source src={videos[currentVideoIndex].webm} type="video/webm" />
                            </video>

                            {/* Blue Gradient Overlay on Videos */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#241588]/60 via-[#1d8bca]/50 to-[#56a7d7]/40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#241588]/70 via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-[#1d8bca]/30" />
                        </>
                    )}

                    {/* Blur effect at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
                </div>

                {/* Video Navigation Dots - Only show when videos are playing */}
                {showVideo && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                        {videos.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setIsTransitioning(true)
                                    setTimeout(() => {
                                        setCurrentVideoIndex(index)
                                        setIsTransitioning(false)
                                    }, 500)
                                }}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentVideoIndex
                                        ? 'bg-white w-8'
                                        : 'bg-white/50 hover:bg-white/75'
                                }`}
                                aria-label={`Go to video ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Content Section */}
                <section className="relative z-10">
                    <div className="flex items-center justify-center min-h-screen pt-20">
                        <div className="mx-auto max-w-7xl px-6 py-32">
                            <div className="text-center">
                                <h1 className="mx-auto max-w-4xl text-balance text-5xl font-bold text-white md:text-7xl lg:text-[5.25rem] drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] mb-8 leading-tight md:leading-tight lg:leading-tight tracking-tight">
                                    <span className="bg-linear-to-r from-blue-100 to-blue-400 bg-clip-text text-transparent">Your Voice</span> Amplified<br className="md:hidden" /> with Purpose
                                </h1>

                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-8 max-w-2xl text-balance text-lg text-white md:text-xl drop-shadow-lg">
                                    Let's connect, map out your goals, and postion your brand.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="bg-[#241685] hover:bg-[#1d8bca] text-white px-8 py-6 text-lg rounded-md shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold">
                                        <Link href="/contact">
                                            <span>Ask for a Quote </span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
