'use client'

import { useEffect, useState } from 'react'
import { API_URL } from '@/lib/config'

interface Client {
    id: string
    name: string
    logo: string
    order: number
}

export default function ContentSection() {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch(`${API_URL}/api/clients`)
                if (response.ok) {
                    const data = await response.json()
                    setClients(data)
                }
            } catch (error) {
                console.error('Error fetching clients:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchClients()
    }, [])

    if (loading) {
        return (
            <section className="py-16 md:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
                        Partners we've worked with
                    </h2>
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 md:py-32 bg-white">
            <div className="mx-auto max-w-7xl px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                   Clients we've worked with
                </h2>
                <p className="text-center text-muted-foreground text-light italic mb-16 max-w-2xl mx-auto">
                    Our amazing clients and brands that have chosen to collaborate with us
                </p>

                {clients.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        <p className="text-lg">No clients to display yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 items-center">
                        {clients.map((client) => (
                            <div
                                key={client.id}
                                className="flex items-center justify-center p-6 bg-background rounded-lg hover:shadow-lg transition-shadow duration-300 group">
                                <img
                                    src={`${API_URL}${client.logo}`}
                                    alt={client.name}
                                    className="w-full h-auto max-h-20 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
