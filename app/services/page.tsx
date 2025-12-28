'use client'

import { HeroHeader } from '@/components/header'
import { motion } from 'framer-motion'

const services = [
    {
        title: "Digital Marketing",
        description: "We help brands thrive in the digital landscape with data-driven marketing campaigns that amplify your reach and drive measurable results. From social media management to SEO and paid advertising, we create strategies that connect you with your target audience and turn engagement into growth."
    },
    {
        title: "Public Relations",
        description: "Building and maintaining a positive public image is at the heart of what we do. Our PR expertise helps you craft compelling narratives, manage media relations, handle crisis communication, and establish your brand as a trusted voice in your industry."
    },
    {
        title: "Brand Storytelling",
        description: "Every brand has a unique story waiting to be told. We craft compelling narratives that resonate with your audience, create emotional connections, and bring your brand's values and mission to life through authentic storytelling across all channels."
    },
    {
        title: "Strategic Communication",
        description: "We develop comprehensive communication strategies that align with your business objectives and resonate with stakeholders. From internal communications to stakeholder engagement, we ensure your message is clear, consistent, and impactful across all touchpoints."
    }
]

export default function ServicesPage() {
    return (
        <>
            <HeroHeader />
            <section className="bg-background py-16 md:py-32 min-h-screen">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Page Header */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-sm text-muted-foreground mb-4">Our Services</p>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                What We Do Best
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                                For <span className="text-[#261592] font-semibold">1 year</span>, we've flourished with the sole purpose of making your brand <span className="text-[#261592] font-semibold">Amazing</span>.
                            </p>
                        </motion.div>
                    </div>

                    {/* Services Grid */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={index}
                                title={service.title}
                                description={service.description}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>

                    {/* Bottom Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mt-16 text-center"
                    >
                        <div className="bg-muted rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to elevate your brand?
                            </h2>
                            <p className="text-white mb-6">
                                Let's work together to create something amazing for your business.
                            </p>
                            {/* <div className="flex items-center justify-center gap-4 text-sm">
                                <span>We Research</span>
                                <span>•</span>
                                <span>We Innovate</span>
                                <span>•</span>
                                <span>We Create</span>
                            </div> */}
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    )
}

const ServiceCard = ({ title, description, delay }: { title: string; description: string; delay: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className="bg-blue-50/50 dark:bg-card border border-blue-100 dark:border-border rounded-lg p-8 space-y-4 hover:shadow-lg hover:bg-blue-50 dark:hover:bg-card transition-all"
        >
            <h3 className="text-2xl font-semibold">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </motion.div>
    )
}
