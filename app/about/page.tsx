'use client'

import { HeroHeader } from '@/components/header'
import FooterSection from '@/components/footer'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Target, Eye, Award, Users, Lightbulb, Heart } from 'lucide-react'

export default function AboutPage() {
    return (
        <>
            <HeroHeader />

            {/* Hero Section */}
            <section className="bg-background py-20 md:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            About Tirzah Communications
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Empowering brands with purpose-driven communication strategies that amplify your voice and connect with your audience.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    Tirzah Communications was born from a vision to transform how brands connect with their audiences. We believe that every brand has a unique story to tell, and our mission is to help you tell yours with clarity, impact, and authenticity.
                                </p>
                                <p>
                                    Founded on the principles of strategic communication and creative excellence, we've grown into a trusted partner for businesses looking to elevate their brand presence in the digital landscape.
                                </p>
                                <p>
                                    Our team combines expertise in marketing, design, content creation, and digital strategy to deliver comprehensive communication solutions that drive real results.
                                </p>
                            </div>
                        </div>
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                            <Image
                                src="/images/Logo-01.png"
                                alt="Tirzah Communications"
                                fill
                                className="object-contain p-8"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-card border rounded-lg p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-[#261592]/10">
                                    <Target className="w-8 h-8 text-[#261592]" />
                                </div>
                                <h3 className="text-2xl font-bold">Our Mission</h3>
                            </div>
                            <p className="text-muted-foreground">
                                To empower brands with innovative communication strategies that amplify their voice, build meaningful connections, and drive sustainable growth in an ever-evolving digital landscape.
                            </p>
                        </div>

                        <div className="bg-card border rounded-lg p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-[#261592]/10">
                                    <Eye className="w-8 h-8 text-[#261592]" />
                                </div>
                                <h3 className="text-2xl font-bold">Our Vision</h3>
                            </div>
                            <p className="text-muted-foreground">
                                To be the leading communication partner that transforms brands into powerful voices, creating lasting impact through strategic storytelling and authentic engagement.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
                        <p className="text-lg text-muted-foreground">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-card border rounded-lg p-6">
                            <div className="p-3 w-fit rounded-lg bg-[#261592]/10 mb-4">
                                <Award className="w-6 h-6 text-[#261592]" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                            <p className="text-muted-foreground">
                                We strive for excellence in every project, delivering quality that exceeds expectations.
                            </p>
                        </div>

                        <div className="bg-card border rounded-lg p-6">
                            <div className="p-3 w-fit rounded-lg bg-[#261592]/10 mb-4">
                                <Heart className="w-6 h-6 text-[#261592]" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Authenticity</h3>
                            <p className="text-muted-foreground">
                                We believe in genuine storytelling that resonates with real audiences and builds trust.
                            </p>
                        </div>

                        <div className="bg-card border rounded-lg p-6">
                            <div className="p-3 w-fit rounded-lg bg-[#261592]/10 mb-4">
                                <Lightbulb className="w-6 h-6 text-[#261592]" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                            <p className="text-muted-foreground">
                                We embrace creativity and innovation to deliver cutting-edge communication solutions.
                            </p>
                        </div>

                        <div className="bg-card border rounded-lg p-6">
                            <div className="p-3 w-fit rounded-lg bg-[#261592]/10 mb-4">
                                <Users className="w-6 h-6 text-[#261592]" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
                            <p className="text-muted-foreground">
                                We work closely with our clients as partners, ensuring their vision becomes reality.
                            </p>
                        </div>

                        <div className="bg-card border rounded-lg p-6">
                            <div className="p-3 w-fit rounded-lg bg-[#261592]/10 mb-4">
                                <Target className="w-6 h-6 text-[#261592]" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Results-Driven</h3>
                            <p className="text-muted-foreground">
                                We focus on measurable outcomes that contribute to your business success.
                            </p>
                        </div>

                        <div className="bg-card border rounded-lg p-6">
                            <div className="p-3 w-fit rounded-lg bg-[#261592]/10 mb-4">
                                <Heart className="w-6 h-6 text-[#261592]" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Integrity</h3>
                            <p className="text-muted-foreground">
                                We maintain the highest standards of honesty and transparency in all our relationships.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Do */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
                        <p className="text-lg text-muted-foreground">
                            Comprehensive communication solutions tailored to your brand
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Digital Marketing */}
                        <div className="text-center group hover:scale-105 transition-transform duration-300">
                            <div className="inline-block p-4 rounded-lg bg-[#1d8bca]/10 mb-4 group-hover:bg-[#1d8bca]/20 transition-colors">
                                <svg className="w-12 h-12 text-[#1d8bca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Digital Marketing</h3>
                            <p className="text-muted-foreground">
                                Data-driven campaigns that amplify your reach and drive measurable results across digital platforms.
                            </p>
                        </div>

                        {/* Public Relations */}
                        <div className="text-center group hover:scale-105 transition-transform duration-300">
                            <div className="inline-block p-4 rounded-lg bg-[#241588]/10 mb-4 group-hover:bg-[#241588]/20 transition-colors">
                                <svg className="w-12 h-12 text-[#241588]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Public Relations</h3>
                            <p className="text-muted-foreground">
                                Building and maintaining a positive public image through strategic media relations and reputation management.
                            </p>
                        </div>

                        {/* Brand Storytelling */}
                        <div className="text-center group hover:scale-105 transition-transform duration-300">
                            <div className="inline-block p-4 rounded-lg bg-[#56a7d7]/10 mb-4 group-hover:bg-[#56a7d7]/20 transition-colors">
                                <svg className="w-12 h-12 text-[#56a7d7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Brand Storytelling</h3>
                            <p className="text-muted-foreground">
                                Crafting compelling narratives that connect emotionally with your audience and bring your brand to life.
                            </p>
                        </div>

                        {/* Strategic Communication */}
                        <div className="text-center group hover:scale-105 transition-transform duration-300">
                            <div className="inline-block p-4 rounded-lg bg-[#554aa1]/10 mb-4 group-hover:bg-[#554aa1]/20 transition-colors">
                                <svg className="w-12 h-12 text-[#554aa1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Strategic Communication</h3>
                            <p className="text-muted-foreground">
                                Developing targeted messaging strategies that align with your business objectives and resonate with stakeholders.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-[#1f89ca]">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Amplify Your Brand?
                    </h2>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                        Let's connect and discuss how we can help elevate your brand's communication strategy.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-white text-[#1f89ca] hover:bg-white/90">
                            <Link href="/contact">Get Started</Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-white text-[#1f89ca] hover:bg-white/10">
                            <Link href="/portfolio">View Our Work</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <FooterSection />
        </>
    )
}
