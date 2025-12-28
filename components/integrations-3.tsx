'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function IntegrationsSection() {
    return (
        <section>
            <div className="bg-muted dark:bg-background py-24 md:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Left Column - Why Tirzah Communications */}
                        <div className="space-y-6">
                            <p className="text-sm text-muted-foreground">Why Tirzah Communications?</p>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                For <span className='text-white'>1 year</span>, we've flourished with the sole purpose of making your brand <span className="text-[#ffff]">Amazing</span>.
                            </h2>
                            <Button
                                style={{ backgroundColor: '#261592' }}
                                size="lg"
                                asChild>
                                <Link href="/services">Learn more</Link>
                            </Button>
                           
                        </div>

                        {/* Right Column - Services */}
                        <div className="space-y-4">
                            <ServiceCard
                                title="Digital Marketing"
                                description="We assist Brands in identifying, and satisfying customer needs and wants through creation, promotion, and marketing of products or services. Additionally, we enable Brands to communicate the value of a product to consumers thus persuading them to buy."
                                delay={0.1}
                            />
                            <ServiceCard
                                title="Public relations"
                                description="Our expertise is to develop and implement a comprehensive plan that helps Brands to communicate effectively to their consumers while enabling the Brand to build and maintain a positive image, reputation and relationship with its publics."
                                delay={0.2}
                            />
                            <ServiceCard
                                title="Brand Storytelling"
                                description="We plan, organize, execute and coordinate events for Brands of any capacity. Further, we utilize our creativity and marketing skills to promote the event above and beyond. Brands benefit from our attention to detail and a post-event evaluation report."
                                delay={0.3}
                            />
                            <ServiceCard
                                title="Strategic communication"
                                description="Looking to enhance your public image, reputation or influence? We help you put yourself out there by training and polishing your public speaking and presentation skills."
                                delay={0.4}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const ServiceCard = ({ title, description, delay }: { title: string; description: string; delay: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className="bg-blue-50/50 dark:bg-card border border-blue-100 dark:border-border rounded-lg p-6 space-y-3 hover:shadow-lg hover:bg-blue-50 dark:hover:bg-card transition-all"
        >
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </motion.div>
    )
}
