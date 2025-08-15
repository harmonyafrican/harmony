const API_BASE_URL = 'http://localhost:5000/api';

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  src: string; // Main image URL or video thumbnail
  videoUrl?: string; // For video items - YouTube, Vimeo, or direct video URL
  title: string;
  description: string;
  category: 'education' | 'technology' | 'arts' | 'community' | 'events' | 'other';
  date: string | {
    _seconds: number;
    _nanoseconds: number;
  };
  location: string;
  participants: number;
  tags?: string[];
  photographer?: string; // Credit for the photo/video
  isActive: boolean;
  views: number;
  likes: number;
  createdAt: string | {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: string | {
    _seconds: number;
    _nanoseconds: number;
  };
  // Admin fields
  status?: 'active' | 'inactive' | 'featured';
  uploadedBy?: string;
  fileSize?: string;
}

export interface GalleryStats {
  totalPhotos: number;
  totalVideos: number;
  totalEvents: number;
  totalMemories: number;
}

class GalleryApiService {
  async getGalleryItems(): Promise<GalleryItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch gallery items');
      }
      
      return result.data;
    } catch (error) {
      console.error('Gallery API Error:', error);
      throw error;
    }
  }

  async getGalleryStats(): Promise<GalleryStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch gallery stats');
      }
      
      return result.data;
    } catch (error) {
      console.error('Gallery Stats API Error:', error);
      throw error;
    }
  }

  async likeGalleryItem(itemId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/${itemId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to like gallery item');
      }
      
      return result.data;
    } catch (error) {
      console.error('Gallery Like API Error:', error);
      throw error;
    }
  }

  // Admin methods
  async getAllGalleryItems(): Promise<GalleryItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/gallery`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch all gallery items');
      }
      
      // Transform the data to include simplified fields for admin interface
      const transformedData = result.data.map((item: any) => {
        const itemDate = item.date ? 
          (typeof item.date === 'string' ? item.date : convertFirestoreTimestamp(item.date)) : 
          new Date().toISOString();
        
        const createdDate = item.createdAt ? 
          (typeof item.createdAt === 'string' ? item.createdAt : convertFirestoreTimestamp(item.createdAt)) : 
          new Date().toISOString();

        return {
          ...item,
          date: itemDate,
          createdAt: createdDate,
          status: item.isActive ? 'active' : 'inactive',
          uploadedBy: item.photographer || 'Unknown',
          fileSize: this.generateFileSize()
        };
      });
      
      return transformedData;
    } catch (error) {
      console.error('Admin Gallery API Error:', error);
      throw error;
    }
  }

  async createGalleryItem(itemData: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>): Promise<GalleryItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create gallery item');
      }
      
      return result.data;
    } catch (error) {
      console.error('Create Gallery Item Error:', error);
      throw error;
    }
  }

  async updateGalleryItem(itemId: string, itemData: Partial<GalleryItem>): Promise<GalleryItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/gallery/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update gallery item');
      }
      
      return result.data;
    } catch (error) {
      console.error('Update Gallery Item Error:', error);
      throw error;
    }
  }

  async deleteGalleryItem(itemId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/gallery/${itemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete gallery item');
      }
    } catch (error) {
      console.error('Delete Gallery Item Error:', error);
      throw error;
    }
  }

  async toggleGalleryItemStatus(itemId: string, isActive: boolean): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/gallery/${itemId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update gallery item status');
      }
    } catch (error) {
      console.error('Toggle Gallery Item Status Error:', error);
      throw error;
    }
  }

  private generateFileSize(): string {
    const sizes = ['2.5 MB', '1.8 MB', '3.2 MB', '892 KB', '1.4 MB', '2.1 MB', '756 KB', '4.1 MB'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }
}

export const galleryApi = new GalleryApiService();

// Helper function to convert Firestore timestamp to Date
export const convertFirestoreTimestamp = (timestamp: { _seconds: number; _nanoseconds: number }) => {
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
};

// Helper function to format date
export const formatDate = (dateString: string | { _seconds: number; _nanoseconds: number }) => {
  let date: Date;
  
  if (typeof dateString === 'string') {
    date = new Date(dateString);
  } else {
    date = convertFirestoreTimestamp(dateString);
  }
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Helper function to get category icon
export const getCategoryIcon = (category: string) => {
  const icons = {
    education: '📚',
    technology: '💻',
    arts: '🎨',
    community: '👥',
    events: '🎉',
    other: '📷'
  };
  return icons[category as keyof typeof icons] || icons.other;
};

// Helper function to get category color
export const getCategoryColor = (category: string) => {
  const colors = {
    education: 'from-blue-400 to-blue-600',
    technology: 'from-purple-400 to-purple-600',
    arts: 'from-pink-400 to-pink-600',
    community: 'from-green-400 to-green-600',
    events: 'from-amber-400 to-orange-500',
    other: 'from-gray-400 to-gray-600'
  };
  return colors[category as keyof typeof colors] || colors.other;
};