import { Router, Request, Response } from 'express';
import { FirebaseService } from '../services/firebaseService.js';

const router = Router();

// Admin credentials (in production, these should be stored securely in Firebase or environment variables)
const ADMIN_CREDENTIALS = {
  email: 'harmonyafricans@gmail.com',
  password: 'HarmonyAfrica2024!', // This should be hashed in production
  user: {
    id: 'admin-001',
    name: 'Harmony Africa Admin',
    email: 'harmonyafricans@gmail.com',
    role: 'admin' as const
  }
};

// Generate a simple token (in production, use JWT or proper session management)
function generateToken(): string {
  return `harmony_admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Admin login
router.post('/admin/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Email and password are required'
        }
      });
      return;
    }

    // Validate credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const token = generateToken();
      
      // Store token in Firebase for session management (optional)
      try {
        await FirebaseService.createAdminSession(ADMIN_CREDENTIALS.user.id, token);
      } catch (error) {
        console.warn('Failed to store admin session:', error);
      }

      res.status(200).json({
        success: true,
        user: {
          ...ADMIN_CREDENTIALS.user,
          lastLogin: new Date()
        },
        token,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password'
        }
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Login failed. Please try again.'
      }
    });
  }
});

// Admin logout
router.post('/admin/auth/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (token) {
      // Remove token from Firebase (optional)
      try {
        await FirebaseService.deleteAdminSession(token);
      } catch (error) {
        console.warn('Failed to delete admin session:', error);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Logout failed'
      }
    });
  }
});

// Verify admin token
router.get('/admin/auth/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          message: 'No token provided'
        }
      });
      return;
    }

    // Verify token format (basic validation)
    if (token.startsWith('harmony_admin_')) {
      // In production, verify token against database/cache
      const isValid = await FirebaseService.verifyAdminSession(token);
      
      if (isValid) {
        res.status(200).json({
          success: true,
          data: ADMIN_CREDENTIALS.user
        });
      } else {
        res.status(401).json({
          success: false,
          error: {
            message: 'Invalid or expired token'
          }
        });
      }
    } else {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token format'
        }
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Token verification failed'
      }
    });
  }
});

// Refresh admin token
router.post('/admin/auth/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const oldToken = authHeader?.split(' ')[1];

    if (!oldToken || !oldToken.startsWith('harmony_admin_')) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token'
        }
      });
      return;
    }

    // Verify old token and generate new one
    const isValid = await FirebaseService.verifyAdminSession(oldToken);
    
    if (isValid) {
      const newToken = generateToken();
      
      // Replace old token with new one
      await FirebaseService.replaceAdminSession(oldToken, newToken);
      
      res.status(200).json({
        success: true,
        token: newToken
      });
    } else {
      res.status(401).json({
        success: false,
        error: {
          message: 'Token refresh failed'
        }
      });
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Token refresh failed'
      }
    });
  }
});

// Update admin profile
router.put('/admin/auth/profile', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token || !token.startsWith('harmony_admin_')) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized'
        }
      });
      return;
    }

    const { name } = req.body;
    
    // In production, update user data in database
    const updatedUser = {
      ...ADMIN_CREDENTIALS.user,
      name: name || ADMIN_CREDENTIALS.user.name
    };

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Profile update failed'
      }
    });
  }
});

// Change admin password
router.post('/admin/auth/change-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token || !token.startsWith('harmony_admin_')) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized'
        }
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Current password and new password are required'
        }
      });
      return;
    }

    if (currentPassword !== ADMIN_CREDENTIALS.password) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Current password is incorrect'
        }
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({
        success: false,
        error: {
          message: 'New password must be at least 8 characters long'
        }
      });
      return;
    }

    // In production, update password in secure storage
    ADMIN_CREDENTIALS.password = newPassword;

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Password change failed'
      }
    });
  }
});

export default router;