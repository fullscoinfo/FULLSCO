import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

// واجهة لإعدادات الموقع
export interface SiteSettings {
  id: number;
  siteName: string;
  siteTagline?: string;
  siteDescription?: string;
  favicon?: string;
  logo?: string;
  logoDark?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  enableDarkMode: boolean;
  rtlDirection: boolean;
  defaultLanguage: string;
  enableNewsletter: boolean;
  enableScholarshipSearch: boolean;
  footerText?: string;
}

interface SiteSettingsContextValue {
  settings: SiteSettings | null;
  isLoading: boolean;
  error: Error | null;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { data: settings, isLoading, error } = useQuery<SiteSettings, Error>({
    queryKey: ['/api/site-settings'],
    queryFn: async () => {
      const response = await fetch('/api/site-settings');
      if (!response.ok) {
        throw new Error('Failed to fetch site settings');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });

  // تطبيق الإعدادات على المستند
  if (settings) {
    // تطبيق اتجاه RTL
    document.documentElement.dir = settings.rtlDirection ? 'rtl' : 'ltr';
    
    // تطبيق اللغة الافتراضية
    document.documentElement.lang = settings.defaultLanguage || 'ar';
    
    // تطبيق الألوان على المتغيرات في CSS
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--primary', settings.primaryColor);
    }
    if (settings.secondaryColor) {
      document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
    }
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--accent', settings.accentColor);
    }
    
    // تطبيق أيقونة الموقع (favicon)
    if (settings.favicon) {
      const existingFavicon = document.querySelector('link[rel="icon"]');
      if (existingFavicon) {
        existingFavicon.setAttribute('href', settings.favicon);
      } else {
        const faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.href = settings.favicon;
        document.head.appendChild(faviconLink);
      }
    }
  }

  return (
    <SiteSettingsContext.Provider value={{ settings: settings || null, isLoading, error: error || null }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}