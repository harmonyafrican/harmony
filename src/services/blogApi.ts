const API_BASE_URL = 'http://localhost:5000/api';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  isPublished: boolean;
  publishedAt: string | { _seconds: number; _nanoseconds: number; };
  views: number;
  likes: number;
  comments: number;
  createdAt: string | { _seconds: number; _nanoseconds: number; };
  updatedAt: string | { _seconds: number; _nanoseconds: number; };
  // Additional fields for admin interface
  status?: 'draft' | 'published' | 'archived';
  readTime?: number;
}

class BlogApiService {
  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/blog`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch blog posts');
      }
      
      return result.data;
    } catch (error) {
      console.error('Blog API Error:', error);
      throw error;
    }
  }

  // Admin methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/blog-posts`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch all blog posts');
      }
      
      // Transform the data to include simplified fields for admin interface
      const transformedData = result.data.map((post: any) => {
        const publishedDate = post.publishedAt ? 
          (typeof post.publishedAt === 'string' ? post.publishedAt : convertFirestoreTimestamp(post.publishedAt)) : 
          new Date().toISOString();
        
        const createdDate = post.createdAt ? 
          (typeof post.createdAt === 'string' ? post.createdAt : convertFirestoreTimestamp(post.createdAt)) : 
          new Date().toISOString();

        return {
          ...post,
          publishedAt: publishedDate,
          createdAt: createdDate,
          status: post.isPublished ? 'published' : 'draft',
          readTime: Math.ceil(post.content?.split(' ').length / 200) || 5 // Estimate reading time
        };
      });
      
      return transformedData;
    } catch (error) {
      console.error('Admin Blog API Error:', error);
      throw error;
    }
  }

  async deleteBlogPost(postId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/blog-posts/${postId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete blog post');
      }
    } catch (error) {
      console.error('Delete Blog Post Error:', error);
      throw error;
    }
  }

  async togglePublishStatus(postId: string, isPublished: boolean): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/blog-posts/${postId}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update publish status');
      }
    } catch (error) {
      console.error('Toggle Publish Status Error:', error);
      throw error;
    }
  }

  async createBlogPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'comments'>): Promise<BlogPost> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/blog-posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create blog post');
      }
      
      return result.data;
    } catch (error) {
      console.error('Create Blog Post Error:', error);
      throw error;
    }
  }

  async updateBlogPost(postId: string, postData: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/blog-posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update blog post');
      }
      
      return result.data;
    } catch (error) {
      console.error('Update Blog Post Error:', error);
      throw error;
    }
  }

  async subscribeToNewsletter(email: string, firstName?: string, lastName?: string): Promise<{ subscriberId: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          preferences: {
            newsletter: true,
            events: false,
            programs: false,
            volunteering: false,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Subscription failed');
      }

      return result.data;
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      throw error;
    }
  }
}

export const blogApi = new BlogApiService();

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