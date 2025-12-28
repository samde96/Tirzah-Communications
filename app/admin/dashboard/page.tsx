'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  mediaType: string;
  mediaSrc: string;
  videoSrc?: string;
  description: string;
  link?: string;
  isActive: boolean;
  createdAt: string;
}

interface Admin {
  id: string;
  email: string;
  name: string;
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchPortfolioItems();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');

    if (!token || !adminData) {
      router.push('/admin/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      setAdmin(JSON.parse(adminData));
    } catch (error) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      router.push('/admin/login');
    }
  };

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`);
      const data = await response.json();
      setPortfolioItems(data);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchPortfolioItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleToggleActive = async (item: PortfolioItem) => {
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('isActive', (!item.isActive).toString());

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/${item.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchPortfolioItems();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg sm:text-xl font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold truncate">Admin Dashboard</h1>
                <p className="text-sm sm:text-base text-muted-foreground truncate mt-1">Welcome back, {admin?.name}</p>
              </div>
              <div className="flex gap-2 shrink-0 w-full sm:w-auto items-center">
                <Button
                  onClick={() => router.push('/')}
                  style={{ backgroundColor: '#261592' }}
                  className="flex-1 sm:flex-none text-sm sm:text-base h-10 px-4"
                >
                  View Website
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none text-sm sm:text-base h-10 px-4"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/dashboard/clients')}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Manage Clients</h3>
              <p className="text-sm text-muted-foreground">Add and manage partner logos</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/dashboard/testimonials')}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Manage Testimonials</h3>
              <p className="text-sm text-muted-foreground">Add and manage client testimonials</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/dashboard/add')}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Add Portfolio Item</h3>
              <p className="text-sm text-muted-foreground">Create a new portfolio entry</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">Portfolio Items</h2>
          <Button
            onClick={() => router.push('/admin/dashboard/add')}
            style={{ backgroundColor: '#261592' }}
            className="w-full sm:w-auto text-sm sm:text-base h-10 px-4"
          >
            + Add New Item
          </Button>
        </div>

        {portfolioItems.length === 0 ? (
          <Card className="w-full">
            <CardContent className="py-12 text-center">
              <p className="text-sm sm:text-base text-muted-foreground">No portfolio items yet. Add your first one!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {portfolioItems.map((item) => (
              <Card key={item.id} className={`w-full h-full flex flex-col ${!item.isActive ? 'opacity-50' : ''}`}>
                <div className="relative w-full aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900">
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
                    />
                  )}
                </div>
                <CardContent className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide truncate">{item.category}</p>
                    <h3 className="font-semibold text-sm sm:text-base mt-2 line-clamp-1">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full pt-2">
                    <Button
                      onClick={() => router.push(`/admin/dashboard/edit/${item.id}`)}
                      variant="outline"
                      className="flex-1 text-xs h-8 px-2"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleToggleActive(item)}
                      variant="outline"
                      className="flex-1 text-xs h-8 px-2"
                    >
                      {item.isActive ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                      {item.isActive ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      variant="outline"
                      className="flex-1 text-xs h-8 px-2"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
