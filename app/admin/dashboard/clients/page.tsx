'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, ArrowLeft, Home } from 'lucide-react'

interface Client {
    id: string
    name: string
    logo: string
    order: number
    isActive: boolean
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            if (!token) {
                router.push('/admin/login')
                return
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this client?')) return

        try {
            const token = localStorage.getItem('adminToken')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                fetchClients()
            } else {
                alert('Failed to delete client')
            }
        } catch (error) {
            console.error('Error deleting client:', error)
            alert('Failed to delete client')
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
                    <h1 className="text-3xl font-bold">Manage Clients</h1>
                    <p className="text-muted-foreground mt-2">
                        Add, edit, or remove client logos
                    </p>
                </div>
                <Button onClick={() => router.push('/admin/dashboard/clients/add')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
                </Button>
            </div>

            {clients.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <p className="text-lg text-muted-foreground mb-4">No clients added yet</p>
                    <Button onClick={() => router.push('/admin/dashboard/clients/add')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Client
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <div
                            key={client.id}
                            className="border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-center h-32 mb-4 bg-muted/30 rounded">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${client.logo}`}
                                    alt={client.name}
                                    className="max-h-24 max-w-full object-contain"
                                />
                            </div>
                            <h3 className="font-semibold text-lg mb-2 text-center">{client.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4 text-center">
                                Order: {client.order}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() =>
                                        router.push(`/admin/dashboard/clients/edit/${client.id}`)
                                    }>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleDelete(client.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
