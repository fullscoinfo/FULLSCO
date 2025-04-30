import { createContext, ReactNode, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

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
      try {
        const response = await fetch('/api/site-settings');
        if (!response.ok) {
          throw new Error('Failed to fetch site settings');
        }
        const data = await response.json();
        console.log('Site settings loaded successfully:', data);
        return data;
      } catch (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });

  // تطبيق الإعدادات على المستند
  useEffect(() => {
    if (settings) {
      console.log('Applying site settings to document:', settings);
      
      // تطبيق اتجاه RTL
      document.documentElement.dir = settings.rtlDirection ? 'rtl' : 'ltr';
      
      // تطبيق اللغة الافتراضية
      document.documentElement.lang = settings.defaultLanguage || 'ar';
      
      // تطبيق الألوان على المتغيرات في CSS
      if (settings.primaryColor) {
        // تطبيق لون أساسي كمتغير CSS
        document.documentElement.style.setProperty('--primary', settings.primaryColor);
        
        // تحويل اللون الأساسي إلى hsl للاستفادة من نظام الألوان في tailwind
        try {
          // محاولة استخراج القيم من لون hex
          const hexColor = settings.primaryColor.replace('#', '');
          const r = parseInt(hexColor.substr(0, 2), 16) / 255;
          const g = parseInt(hexColor.substr(2, 2), 16) / 255;
          const b = parseInt(hexColor.substr(4, 2), 16) / 255;
          
          // حساب القيم HSL
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          let h = 0, s = 0, l = (max + min) / 2;

          if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
            
            h *= 60;
          }
          
          // تطبيق HSL على متغيرات الألوان
          document.documentElement.style.setProperty('--primary-hue', `${h.toFixed(0)}deg`);
          document.documentElement.style.setProperty('--primary-saturation', `${(s * 100).toFixed(0)}%`);
          document.documentElement.style.setProperty('--primary-lightness', `${(l * 100).toFixed(0)}%`);
        } catch (e) {
          console.error('Error parsing primary color:', e);
        }
      }
      
      if (settings.secondaryColor) {
        document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
      }
      
      if (settings.accentColor) {
        document.documentElement.style.setProperty('--accent', settings.accentColor);
        document.documentElement.style.setProperty('--accent-foreground', '#ffffff');
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
  }, [settings]);

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