'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
    const router = useRouter()

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('adminToken')

        if (token) {
            // If logged in, redirect to dashboard
            router.push('/admin/dashboard')
        } else {
            // If not logged in, redirect to login
            router.push('/admin/login')
        }
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    )
}
