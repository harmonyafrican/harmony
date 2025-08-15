import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';
import { realtimeService, formatUpdateMessage } from '../services/realtimeService';
import type { RealtimeUpdate } from '../services/realtimeService';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration (unless persistent)
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, [removeNotification]);

  // Initialize real-time connection and subscribe to updates
  useEffect(() => {
    let unsubscribeContact: (() => void) | undefined;
    let unsubscribeDonation: (() => void) | undefined;
    let unsubscribeVolunteer: (() => void) | undefined;
    let unsubscribeNewsletter: (() => void) | undefined;

    const initializeRealtime = async () => {
      try {
        await realtimeService.connect();

        // Subscribe to different types of real-time updates
        unsubscribeContact = realtimeService.subscribe('contact', (data: Record<string, unknown>) => {
          const update = data as RealtimeUpdate;
          const { title, message } = formatUpdateMessage(update);
          addNotification({ type: 'info', title, message });
        });

        unsubscribeDonation = realtimeService.subscribe('donation', (data: Record<string, unknown>) => {
          const update = data as RealtimeUpdate;
          const { title, message } = formatUpdateMessage(update);
          addNotification({ type: 'success', title, message });
        });

        unsubscribeVolunteer = realtimeService.subscribe('volunteer', (data: Record<string, unknown>) => {
          const update = data as RealtimeUpdate;
          const { title, message } = formatUpdateMessage(update);
          addNotification({ type: 'info', title, message });
        });

        unsubscribeNewsletter = realtimeService.subscribe('newsletter', (data: Record<string, unknown>) => {
          const update = data as RealtimeUpdate;
          const { title, message } = formatUpdateMessage(update);
          addNotification({ type: 'success', title, message });
        });

      } catch (error) {
        console.error('Failed to initialize real-time connection:', error);
        addNotification({ 
          type: 'error', 
          title: 'Connection Error', 
          message: 'Failed to connect to real-time updates'
        });
      }
    };

    initializeRealtime();

    // Cleanup function
    return () => {
      unsubscribeContact?.();
      unsubscribeDonation?.();
      unsubscribeVolunteer?.();
      unsubscribeNewsletter?.();
      realtimeService.disconnect();
    };
  }, [addNotification]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => {
    addNotification({ type: 'success', title, message });
  }, [addNotification]);

  const showError = useCallback((title: string, message?: string) => {
    addNotification({ type: 'error', title, message, persistent: true });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message?: string) => {
    addNotification({ type: 'warning', title, message });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message?: string) => {
    addNotification({ type: 'info', title, message });
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleRemove = () => {
    onRemove(notification.id);
  };

  return (
    <div
      className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4 min-w-0 transform transition-all duration-300 ease-in-out animate-slide-in-right`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {notification.title}
          </h4>
          {notification.message && (
            <p className="text-sm text-gray-600 mt-1">
              {notification.message}
            </p>
          )}
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 mt-2"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// CSS for slide-in animation (to be added to global styles)
export const notificationStyles = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
  }
`;

// eslint-disable-next-line react-refresh/only-export-components
export { useNotifications };