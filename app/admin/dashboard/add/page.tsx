'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Service {
  title: string;
  description: string;
}

interface Achievement {
  title: string;
  description: string;
}

export default function AddPortfolioItem() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    mediaType: 'image',
    description: '',
    link: '',
    background: '',
    statsVisits: '',
    statsUsers: '',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [services, setServices] = useState<Service[]>([{ title: '', description: '' }]);
  const [achievements, setAchievements] = useState<Achievement[]>([{ title: '', description: '' }]);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`);
      const data = await response.json();

      // Extract unique categories
      const uniqueCategories = [...new Set(data.map((item: any) => item.category))];
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('mediaType', formData.mediaType);
      submitData.append('description', formData.description);
      if (formData.link) submitData.append('link', formData.link);
      if (formData.background) submitData.append('background', formData.background);

      // Add stats
      if (formData.statsVisits || formData.statsUsers) {
        const stats = {
          visits: formData.statsVisits || '0',
          users: formData.statsUsers || '0',
        };
        submitData.append('stats', JSON.stringify(stats));
      }

      // Add services
      const validServices = services.filter(s => s.title.trim() && s.description.trim());
      if (validServices.length > 0) {
        submitData.append('services', JSON.stringify(validServices));
      }

      // Add achievements
      const validAchievements = achievements.filter(a => a.title.trim() && a.description.trim());
      if (validAchievements.length > 0) {
        submitData.append('achievements', JSON.stringify(validAchievements));
      }

      if (mediaFile) {
        submitData.append('media', mediaFile);
      }

      if (videoFile && formData.mediaType === 'video') {
        submitData.append('video', videoFile);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create portfolio item');
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Add Portfolio Item</h1>
            <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Portfolio Item Details</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category *
                </label>
                <select
                  id="category"
                  value={showNewCategoryInput ? '__new__' : formData.category}
                  onChange={(e) => {
                    if (e.target.value === '__new__') {
                      setShowNewCategoryInput(true);
                      setFormData({ ...formData, category: '' });
                      setNewCategoryName('');
                    } else {
                      setShowNewCategoryInput(false);
                      setFormData({ ...formData, category: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required={!showNewCategoryInput}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__new__">+ Add New Category</option>
                </select>
                {showNewCategoryInput && (
                  <input
                    type="text"
                    placeholder="Enter new category name"
                    value={newCategoryName}
                    onChange={(e) => {
                      setNewCategoryName(e.target.value);
                      setFormData({ ...formData, category: e.target.value });
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                    autoFocus
                    required
                  />
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="mediaType" className="text-sm font-medium">
                  Media Type *
                </label>
                <select
                  id="mediaType"
                  value={formData.mediaType}
                  onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="media" className="text-sm font-medium">
                  {formData.mediaType === 'image' ? 'Image' : 'Thumbnail Image'} *
                </label>
                <input
                  id="media"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {formData.mediaType === 'video' && (
                <div className="space-y-2">
                  <label htmlFor="video" className="text-sm font-medium">
                    Video File *
                  </label>
                  <input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required={formData.mediaType === 'video'}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="link" className="text-sm font-medium">
                  Link (Optional)
                </label>
                <input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com"
                />
              </div>

              {/* Detail Page Content Section */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Detail Page Content (Optional)</h3>

                {/* Background */}
                <div className="space-y-2 mb-4">
                  <label htmlFor="background" className="text-sm font-medium">
                    Background / Project Context
                  </label>
                  <textarea
                    id="background"
                    value={formData.background}
                    onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                    placeholder="Describe the project background and context..."
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label htmlFor="statsVisits" className="text-sm font-medium">
                      Stats - Visits
                    </label>
                    <input
                      id="statsVisits"
                      type="text"
                      value={formData.statsVisits}
                      onChange={(e) => setFormData({ ...formData, statsVisits: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 48M+"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="statsUsers" className="text-sm font-medium">
                      Stats - Users
                    </label>
                    <input
                      id="statsUsers"
                      type="text"
                      value={formData.statsUsers}
                      onChange={(e) => setFormData({ ...formData, statsUsers: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 5M+"
                    />
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium">Services Offered</label>
                  {services.map((service, index) => (
                    <div key={index} className="border rounded-md p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Service {index + 1}</span>
                        {services.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setServices(services.filter((_, i) => i !== index))}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[index].title = e.target.value;
                          setServices(newServices);
                        }}
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Service title (e.g., Website Development)"
                      />
                      <textarea
                        value={service.description}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[index].description = e.target.value;
                          setServices(newServices);
                        }}
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
                        placeholder="Service description..."
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setServices([...services, { title: '', description: '' }])}
                    className="w-full"
                  >
                    + Add Service
                  </Button>
                </div>

                {/* Achievements */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium">Key Achievements</label>
                  {achievements.map((achievement, index) => (
                    <div key={index} className="border rounded-md p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Achievement {index + 1}</span>
                        {achievements.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setAchievements(achievements.filter((_, i) => i !== index))}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={achievement.title}
                        onChange={(e) => {
                          const newAchievements = [...achievements];
                          newAchievements[index].title = e.target.value;
                          setAchievements(newAchievements);
                        }}
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Achievement title (e.g., High Website Traffic)"
                      />
                      <textarea
                        value={achievement.description}
                        onChange={(e) => {
                          const newAchievements = [...achievements];
                          newAchievements[index].description = e.target.value;
                          setAchievements(newAchievements);
                        }}
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
                        placeholder="Achievement description..."
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAchievements([...achievements, { title: '', description: '' }])}
                    className="w-full"
                  >
                    + Add Achievement
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating...' : 'Create Portfolio Item'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
