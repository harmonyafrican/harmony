// src/context/ThemeContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { type ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeColors {
  primary: string
  primaryHover: string
  secondary: string
  secondaryHover: string
  accent: string
  accentHover: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
  gradient: string
}

interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  colors: ThemeColors
  isSystemTheme: boolean
}

const lightColors: ThemeColors = {
  primary: '#2E7D32', // Forest Green
  primaryHover: '#1B5E20',
  secondary: '#FF8F00', // Warm Orange  
  secondaryHover: '#E65100',
  accent: '#FFA726', // Light Orange
  accentHover: '#FF9800',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#212121',
  textSecondary: '#666666',
  border: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  gradient: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 50%, #FF8F00 100%)',
}

const darkColors: ThemeColors = {
  primary: '#4CAF50', // Lighter Green for dark mode
  primaryHover: '#66BB6A',
  secondary: '#FFB74D', // Warmer Orange for dark
  secondaryHover: '#FFA726', 
  accent: '#81C784',
  accentHover: '#A5D6A7',
  background: '#0A0A0A', // True black for better contrast
  surface: '#1A1A1A', // Slightly lighter surface
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#2A2A2A', // Softer border
  success: '#66BB6A',
  warning: '#FFB74D',
  error: '#EF5350',
  gradient: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #FF8F00 100%)',
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

// Constants for localStorage and CSS
const STORAGE_KEY = 'harmony-theme'
const CSS_SELECTOR = ':root'
const MEDIA_QUERY = '(prefers-color-scheme: dark)'

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get system preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light'
  }, [])

  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error)
    }
    
    return 'system' // Default to system preference
  })

  // Resolve the actual theme (light/dark) from theme setting
  const resolvedTheme = useMemo((): ResolvedTheme => {
    if (theme === 'system') {
      return getSystemTheme()
    }
    return theme as ResolvedTheme
  }, [theme, getSystemTheme])

  // Get colors based on resolved theme
  const colors = useMemo(() => {
    return resolvedTheme === 'light' ? lightColors : darkColors
  }, [resolvedTheme])

  // Enhanced toggle function with cycle: light -> dark -> system
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      switch (prevTheme) {
        case 'light': return 'dark'
        case 'dark': return 'system' 
        case 'system': return 'light'
        default: return 'light'
      }
    })
  }, [])

  // Apply theme changes to DOM and localStorage
  useEffect(() => {
    const root = document.querySelector(CSS_SELECTOR) as HTMLElement
    if (!root) return
    
    try {
      // Remove existing theme classes
      root.classList.remove('light', 'dark')
      
      // Add resolved theme class
      root.classList.add(resolvedTheme)
      
      // Set CSS custom properties for dynamic theming
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value)
      })
      
      // Persist theme setting (not resolved theme) to localStorage
      localStorage.setItem(STORAGE_KEY, theme)
    } catch (error) {
      console.warn('Failed to apply theme changes:', error)
    }
  }, [theme, resolvedTheme, colors])

  // Handle system theme changes
  const handleSystemThemeChange = useCallback((_e: MediaQueryListEvent) => {
    // Force re-render when system theme changes and we're using system theme
    if (theme === 'system') {
      // Trigger re-computation by updating a dependency
      setTheme('system')
    }
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia(MEDIA_QUERY)

    try {
      // Use the modern addEventListener if available, fallback to addListener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemThemeChange)
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleSystemThemeChange)
      }

      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleSystemThemeChange)
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(handleSystemThemeChange)
        }
      }
    } catch (error) {
      console.warn('Failed to listen for system theme changes:', error)
    }
  }, [handleSystemThemeChange])

  // Memoize context value to prevent unnecessary re-renders
  const value: ThemeContextType = useMemo(() => ({
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme,
    colors,
    isSystemTheme: theme === 'system',
  }), [theme, resolvedTheme, toggleTheme, colors])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Hook for accessing colors directly
export const useThemeColors = (): ThemeColors => {
  const { colors } = useTheme()
  return colors
}

// Hook for checking if current theme is dark
export const useIsDark = (): boolean => {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === 'dark'
}

// Hook for getting theme icon (useful for theme toggle buttons)
export const useThemeIcon = () => {
  const { theme } = useTheme()
  switch (theme) {
    case 'light': return '☀️'
    case 'dark': return '🌙' 
    case 'system': return '💻'
    default: return '☀️'
  }
}

// Utility function to get theme colors without context (for SSR compatibility)
export const getThemeColors = (theme: ResolvedTheme): ThemeColors => {
  return theme === 'light' ? lightColors : darkColors
}