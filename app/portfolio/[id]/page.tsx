'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { HeroHeader } from '@/components/header';
import { ArrowLeft } from 'lucide-react';
import CalendlyButton from '@/components/CalendlyButton';

interface Service {
    title: string;
    description: string;
}

interface Achievement {
    title: string;
    description: string;
}

interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    mediaType: 'image' | 'video';
    mediaSrc: string;
    videoSrc?: string;
    description: string;
    link?: string;
    isActive: boolean;
    background?: string;
    services?: Service[];
    achievements?: Achievement[];
    stats?: {
        visits: string;
        users: string;
    };
    createdAt?: string;
}

export default function PortfolioDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [item, setItem] = useState<PortfolioItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPortfolioItem();
    }, [params.id]);

    const fetchPortfolioItem = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/${params.id}`);

            if (!response.ok) {
                throw new Error('Portfolio item not found');
            }

            const data = await response.json();
            setItem(data);
        } catch (error: any) {
            console.error('Error fetching portfolio item:', error);
            setError(error.message || 'Failed to load portfolio item');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <HeroHeader />
                <section className="bg-background py-16 md:py-32 min-h-screen">
                    <div className="mx-auto max-w-7xl px-6 text-center">
                        <p className="text-muted-foreground">Loading portfolio item...</p>
                    </div>
                </section>
            </>
        );
    }

    if (error || !item) {
        return (
            <>
                <HeroHeader />
                <section className="bg-background py-16 md:py-32 min-h-screen">
                    <div className="mx-auto max-w-7xl px-6 text-center">
                        <p className="text-destructive mb-4">{error || 'Portfolio item not found'}</p>
                        <Button onClick={() => router.push('/portfolio')} style={{ backgroundColor: '#1f89ca' }}>
                            Back to Portfolio
                        </Button>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <HeroHeader />
            <section className="bg-background py-16 md:py-32 min-h-screen">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/portfolio')}
                        className="mb-8 hover:bg-muted"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Portfolio
                    </Button>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Media Section */}
                        <div className="space-y-6">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                                {item.mediaType === 'image' ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${item.mediaSrc}`}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <video
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${item.videoSrc}`}
                                        className="h-full w-full object-cover"
                                        controls
                                        loop
                                    />
                                )}
                            </div>

                            {/* Stats */}
                            {item.stats && (item.stats.visits || item.stats.users) && (
                                <div className="grid grid-cols-2 gap-4">
                                    {item.stats.visits && (
                                        <div className="bg-card border rounded-lg p-6">
                                            <div className="text-2xl font-light text-[#261592]">{item.stats.visits}</div>
                                            <div className="text-sm text-muted-foreground mt-1">Visits</div>
                                        </div>
                                    )}
                                    {item.stats.users && (
                                        <div className="bg-card border rounded-lg p-6">
                                            <div className="text-2xl font-light text-[#261592]">{item.stats.users}</div>
                                            <div className="text-sm text-muted-foreground mt-1">users</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="space-y-8">
                            {/* Category Badge */}
                            <div>
                                <span className="inline-block px-4 py-1 text-xs font-medium text-[#261592] bg-[#261592]/10 rounded-full uppercase tracking-wider">
                                    {item.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-bold">{item.title}</h1>

                            {/* Description */}
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-muted-foreground leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            {/* Background Section */}
                            {item.background && (
                                <div className="space-y-4 pt-6 border-t">
                                    <h2 className="text-2xl font-semibold">Background</h2>
                                    <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {item.background}
                                    </div>
                                </div>
                            )}

                            {/* Services Offered Section */}
                            {item.services && item.services.length > 0 && (
                                <div className="space-y-4 pt-6 border-t">
                                    <h2 className="text-2xl font-semibold">Services Offered</h2>

                                    <div className="space-y-4">
                                        {item.services.map((service, index) => (
                                            <div key={index}>
                                                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                                                <p className="text-muted-foreground">
                                                    {service.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Key Achievements Section */}
                            {item.achievements && item.achievements.length > 0 && (
                                <div className="space-y-4 pt-6 border-t">
                                    <h2 className="text-2xl font-semibold">Key Achievements</h2>

                                    <div className="space-y-3">
                                        {item.achievements.map((achievement, index) => (
                                            <div key={index}>
                                                <h3 className="font-semibold mb-1">{achievement.title}</h3>
                                                <p className="text-muted-foreground text-sm">
                                                    {achievement.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA Buttons */}
                            <div className="flex gap-4 pt-6">
                                <Button
                                    onClick={() => router.push('/portfolio')}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    View to portfolio
                                </Button>
                                <CalendlyButton
                                    buttonText="Grab a coffee"
                                    buttonClassName="flex-1"
                                    buttonStyle={{ backgroundColor: '#1f89ca' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
