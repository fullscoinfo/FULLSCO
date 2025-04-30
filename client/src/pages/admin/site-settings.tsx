import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, RefreshCw, Check, Menu, Palette, Globe, Phone, Mail, MapPin, Image, FileType, Settings } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/admin/sidebar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// زودج سكيما للتحقق من صحة البيانات
const siteSettingsSchema = z.object({
  // إعدادات عامة
  siteName: z.string().min(1, 'اسم الموقع مطلوب'),
  siteTagline: z.string().optional(),
  siteDescription: z.string().optional(),
  favicon: z.string().url('يجب أن يكون رابط صورة صالح').optional().or(z.literal('')),
  logo: z.string().url('يجب أن يكون رابط صورة صالح').optional().or(z.literal('')),
  logoDark: z.string().url('يجب أن يكون رابط صورة صالح').optional().or(z.literal('')),
  
  // إعدادات التواصل
  email: z.string().email('يجب إدخال بريد إلكتروني صالح').optional().or(z.literal('')),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  
  // روابط التواصل الاجتماعي
  facebook: z.string().url('يجب أن يكون رابط صالح').optional().or(z.literal('')),
  twitter: z.string().url('يجب أن يكون رابط صالح').optional().or(z.literal('')),
  instagram: z.string().url('يجب أن يكون رابط صالح').optional().or(z.literal('')),
  youtube: z.string().url('يجب أن يكون رابط صالح').optional().or(z.literal('')),
  linkedin: z.string().url('يجب أن يكون رابط صالح').optional().or(z.literal('')),
  
  // إعدادات الألوان
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'يجب أن يكون لون صالح (هيكس)').optional().or(z.literal('')),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'يجب أن يكون لون صالح (هيكس)').optional().or(z.literal('')),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'يجب أن يكون لون صالح (هيكس)').optional().or(z.literal('')),
  
  // إعدادات أخرى
  enableDarkMode: z.boolean().default(true),
  rtlDirection: z.boolean().default(true),
  defaultLanguage: z.string().default('ar'),
  enableNewsletter: z.boolean().default(true),
  enableScholarshipSearch: z.boolean().default(true),
  footerText: z.string().optional(),
});

type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

// واجهة لإعدادات الموقع
interface SiteSettings {
  id: string;
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

export default function SiteSettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('general');

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // استلام إعدادات الموقع
  const { data: settings, isLoading, isError, refetch } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
    queryFn: async () => {
      try {
        // سنضيف نقطة نهاية API لاحقًا - في الوقت الحالي استخدم بيانات تجريبية للتطوير
        // const response = await fetch('/api/site-settings');
        // if (!response.ok) throw new Error('فشل في استلام إعدادات الموقع');
        // return response.json();
        
        // بيانات تجريبية للعرض أثناء التطوير
        return {
          id: 'settings',
          siteName: 'FULLSCO',
          siteTagline: 'منصة المنح الدراسية',
          siteDescription: 'منصة متخصصة في عرض المنح الدراسية حول العالم',
          favicon: '',
          logo: '',
          logoDark: '',
          email: 'info@fullsco.com',
          phone: '+1234567890',
          whatsapp: '',
          address: 'شارع الرياض، المملكة العربية السعودية',
          facebook: 'https://facebook.com/fullsco',
          twitter: 'https://twitter.com/fullsco',
          instagram: '',
          youtube: '',
          linkedin: '',
          primaryColor: '#3b82f6',
          secondaryColor: '#10b981',
          accentColor: '#8b5cf6',
          enableDarkMode: true,
          rtlDirection: true,
          defaultLanguage: 'ar',
          enableNewsletter: true,
          enableScholarshipSearch: true,
          footerText: '© 2025 FULLSCO. جميع الحقوق محفوظة.',
        } as SiteSettings;
      } catch (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }
    },
    enabled: isAuthenticated
  });

  // تحديث إعدادات الموقع
  const updateMutation = useMutation({
    mutationFn: async (updatedSettings: SiteSettingsFormValues) => {
      // سيتم إضافة نقطة نهاية API لاحقًا
      // const response = await fetch('/api/site-settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedSettings),
      // });
      // if (!response.ok) throw new Error('فشل في تحديث إعدادات الموقع');
      // return response.json();
      
      // محاكاة استجابة API
      return { id: 'settings', ...updatedSettings } as SiteSettings;
    },
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['/api/site-settings'], updatedSettings);
      toast({ title: 'تم الحفظ بنجاح', description: 'تم تحديث إعدادات الموقع بنجاح' });
    },
    onError: (error) => {
      toast({ title: 'خطأ!', description: `فشل في تحديث إعدادات الموقع: ${error.message}`, variant: 'destructive' });
    }
  });

  // نموذج إعدادات الموقع
  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: settings?.siteName || '',
      siteTagline: settings?.siteTagline || '',
      siteDescription: settings?.siteDescription || '',
      favicon: settings?.favicon || '',
      logo: settings?.logo || '',
      logoDark: settings?.logoDark || '',
      email: settings?.email || '',
      phone: settings?.phone || '',
      whatsapp: settings?.whatsapp || '',
      address: settings?.address || '',
      facebook: settings?.facebook || '',
      twitter: settings?.twitter || '',
      instagram: settings?.instagram || '',
      youtube: settings?.youtube || '',
      linkedin: settings?.linkedin || '',
      primaryColor: settings?.primaryColor || '',
      secondaryColor: settings?.secondaryColor || '',
      accentColor: settings?.accentColor || '',
      enableDarkMode: settings?.enableDarkMode ?? true,
      rtlDirection: settings?.rtlDirection ?? true,
      defaultLanguage: settings?.defaultLanguage || 'ar',
      enableNewsletter: settings?.enableNewsletter ?? true,
      enableScholarshipSearch: settings?.enableScholarshipSearch ?? true,
      footerText: settings?.footerText || '',
    },
  });

  // تحديث النموذج عند تغيير البيانات
  useEffect(() => {
    if (settings) {
      form.reset({
        siteName: settings.siteName,
        siteTagline: settings.siteTagline || '',
        siteDescription: settings.siteDescription || '',
        favicon: settings.favicon || '',
        logo: settings.logo || '',
        logoDark: settings.logoDark || '',
        email: settings.email || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        address: settings.address || '',
        facebook: settings.facebook || '',
        twitter: settings.twitter || '',
        instagram: settings.instagram || '',
        youtube: settings.youtube || '',
        linkedin: settings.linkedin || '',
        primaryColor: settings.primaryColor || '',
        secondaryColor: settings.secondaryColor || '',
        accentColor: settings.accentColor || '',
        enableDarkMode: settings.enableDarkMode,
        rtlDirection: settings.rtlDirection,
        defaultLanguage: settings.defaultLanguage,
        enableNewsletter: settings.enableNewsletter,
        enableScholarshipSearch: settings.enableScholarshipSearch,
        footerText: settings.footerText || '',
      });
    }
  }, [settings, form]);

  // معالجة حدث إرسال النموذج
  const onSubmit = (data: SiteSettingsFormValues) => {
    updateMutation.mutate(data);
  };

  // في حالة تحميل بيانات المصادقة أو عدم تسجيل الدخول
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen relative overflow-x-hidden">
      {/* السايدبار للجوال */}
      <Sidebar 
        isMobileOpen={sidebarOpen} 
        onClose={() => {
          console.log('SiteSettings: closing sidebar');
          setSidebarOpen(false);
        }} 
      />
      
      {/* المحتوى الرئيسي */}
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "w-full" : "mr-64"
      )}>
        <main className="p-4 md:p-6">
          {/* زر فتح السايدبار في الجوال والهيدر */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-2" 
                  onClick={() => setSidebarOpen(true)}
                  aria-label="فتح القائمة"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-xl md:text-2xl font-bold">إعدادات الموقع</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="ml-2 h-4 w-4" />
                إعادة تحميل
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
                    حفظ الإعدادات
                  </>
                )}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="mr-2">جاري التحميل...</span>
            </div>
          ) : isError ? (
            <div className="text-center py-4 text-red-500">
              <p>حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-2">
                إعادة المحاولة
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="general">
                      <Settings className="ml-2 h-4 w-4" />
                      إعدادات عامة
                    </TabsTrigger>
                    <TabsTrigger value="appearance">
                      <Palette className="ml-2 h-4 w-4" />
                      المظهر والألوان
                    </TabsTrigger>
                    <TabsTrigger value="contact">
                      <Phone className="ml-2 h-4 w-4" />
                      معلومات التواصل
                    </TabsTrigger>
                    <TabsTrigger value="social">
                      <Globe className="ml-2 h-4 w-4" />
                      التواصل الاجتماعي
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* إعدادات عامة */}
                  <TabsContent value="general">
                    <Card>
                      <CardHeader>
                        <CardTitle>الإعدادات العامة</CardTitle>
                        <CardDescription>
                          الإعدادات الأساسية للموقع مثل الاسم والوصف
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="siteName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>اسم الموقع</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="مثال: FULLSCO" />
                              </FormControl>
                              <FormDescription>
                                اسم الموقع كما سيظهر في شريط العنوان والهيدر
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="siteTagline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>شعار الموقع</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="مثال: منصة المنح الدراسية" />
                              </FormControl>
                              <FormDescription>
                                شعار قصير يظهر بجانب اسم الموقع
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="siteDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>وصف الموقع</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="وصف قصير للموقع" 
                                  rows={3}
                                />
                              </FormControl>
                              <FormDescription>
                                وصف قصير للموقع يظهر في نتائج البحث
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="footerText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>نص التذييل</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="مثال: © 2025 FULLSCO. جميع الحقوق محفوظة." />
                              </FormControl>
                              <FormDescription>
                                النص الذي سيظهر في تذييل الموقع
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="defaultLanguage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اللغة الافتراضية</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="اختر اللغة الافتراضية" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="ar">العربية</SelectItem>
                                    <SelectItem value="en">الإنجليزية</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  اللغة الافتراضية للموقع
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="rtlDirection"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>اتجاه RTL</FormLabel>
                                  <FormDescription>
                                    تمكين اتجاه RTL (من اليمين إلى اليسار)
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="enableDarkMode"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>الوضع الداكن</FormLabel>
                                  <FormDescription>
                                    تمكين خيار الوضع الداكن في الموقع
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="enableNewsletter"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>النشرة البريدية</FormLabel>
                                  <FormDescription>
                                    عرض نموذج الاشتراك في النشرة البريدية
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="enableScholarshipSearch"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>البحث عن المنح</FormLabel>
                                  <FormDescription>
                                    تمكين خاصية البحث عن المنح الدراسية
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* إعدادات المظهر */}
                  <TabsContent value="appearance">
                    <Card>
                      <CardHeader>
                        <CardTitle>المظهر والألوان</CardTitle>
                        <CardDescription>
                          إعدادات مظهر الموقع وتخصيص الألوان والشعارات
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>شعار الموقع (لوجو)</FormLabel>
                                <FormControl>
                                  <div className="flex gap-2">
                                    <Input 
                                      {...field} 
                                      placeholder="https://example.com/logo.png"
                                      dir="ltr"
                                    />
                                    {field.value && (
                                      <div className="w-10 h-10 border flex items-center justify-center overflow-hidden">
                                        <img 
                                          src={field.value} 
                                          alt="معاينة الشعار" 
                                          className="max-w-full max-h-full"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  رابط شعار الموقع للوضع الفاتح (PNG/SVG)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="logoDark"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>شعار الوضع الداكن</FormLabel>
                                <FormControl>
                                  <div className="flex gap-2">
                                    <Input 
                                      {...field} 
                                      placeholder="https://example.com/logo-dark.png"
                                      dir="ltr"
                                    />
                                    {field.value && (
                                      <div className="w-10 h-10 border bg-slate-800 flex items-center justify-center overflow-hidden">
                                        <img 
                                          src={field.value} 
                                          alt="معاينة الشعار" 
                                          className="max-w-full max-h-full"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  رابط شعار الموقع للوضع الداكن (PNG/SVG)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="favicon"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>أيقونة الموقع (Favicon)</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input 
                                    {...field} 
                                    placeholder="https://example.com/favicon.ico"
                                    dir="ltr"
                                  />
                                  {field.value && (
                                    <div className="w-10 h-10 border flex items-center justify-center overflow-hidden">
                                      <img 
                                        src={field.value} 
                                        alt="معاينة الأيقونة" 
                                        className="max-w-full max-h-full"
                                      />
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormDescription>
                                رابط أيقونة الموقع التي تظهر في المتصفح (ICO/PNG)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="primaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اللون الرئيسي</FormLabel>
                                <FormControl>
                                  <div className="flex gap-2">
                                    <Input 
                                      {...field} 
                                      placeholder="#3b82f6"
                                      dir="ltr"
                                    />
                                    <div 
                                      className="w-10 h-10 border"
                                      style={{ backgroundColor: field.value || '#ffffff' }}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  اللون الرئيسي للموقع (بتنسيق Hex)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="secondaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اللون الثانوي</FormLabel>
                                <FormControl>
                                  <div className="flex gap-2">
                                    <Input 
                                      {...field} 
                                      placeholder="#10b981"
                                      dir="ltr"
                                    />
                                    <div 
                                      className="w-10 h-10 border"
                                      style={{ backgroundColor: field.value || '#ffffff' }}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  اللون الثانوي للموقع (بتنسيق Hex)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="accentColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>لون التمييز</FormLabel>
                                <FormControl>
                                  <div className="flex gap-2">
                                    <Input 
                                      {...field} 
                                      placeholder="#8b5cf6"
                                      dir="ltr"
                                    />
                                    <div 
                                      className="w-10 h-10 border"
                                      style={{ backgroundColor: field.value || '#ffffff' }}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  لون التمييز للموقع (بتنسيق Hex)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* إعدادات التواصل */}
                  <TabsContent value="contact">
                    <Card>
                      <CardHeader>
                        <CardTitle>معلومات التواصل</CardTitle>
                        <CardDescription>
                          معلومات التواصل الأساسية للموقع
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>البريد الإلكتروني</FormLabel>
                                <FormControl>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-r-none border border-l-0 border-input bg-muted">
                                      <Mail className="h-4 w-4 text-muted-foreground" />
                                    </span>
                                    <Input 
                                      {...field} 
                                      className="rounded-r-none"
                                      placeholder="info@example.com"
                                      dir="ltr"
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  البريد الإلكتروني الرئيسي للاتصال
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>رقم الهاتف</FormLabel>
                                <FormControl>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-r-none border border-l-0 border-input bg-muted">
                                      <Phone className="h-4 w-4 text-muted-foreground" />
                                    </span>
                                    <Input 
                                      {...field} 
                                      className="rounded-r-none"
                                      placeholder="+1234567890"
                                      dir="ltr"
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  رقم الهاتف للاتصال
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="whatsapp"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>رقم واتساب</FormLabel>
                                <FormControl>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-r-none border border-l-0 border-input bg-muted">
                                      <Phone className="h-4 w-4 text-muted-foreground" />
                                    </span>
                                    <Input 
                                      {...field} 
                                      className="rounded-r-none"
                                      placeholder="+1234567890"
                                      dir="ltr"
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  رقم واتساب للاتصال (اختياري)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>العنوان</FormLabel>
                                <FormControl>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-r-none border border-l-0 border-input bg-muted">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                    </span>
                                    <Input 
                                      {...field} 
                                      className="rounded-r-none"
                                      placeholder="العنوان البريدي"
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  العنوان البريدي (اختياري)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* إعدادات التواصل الاجتماعي */}
                  <TabsContent value="social">
                    <Card>
                      <CardHeader>
                        <CardTitle>روابط التواصل الاجتماعي</CardTitle>
                        <CardDescription>
                          روابط حسابات الموقع على منصات التواصل الاجتماعي
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="facebook"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>فيسبوك</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="https://facebook.com/username"
                                    dir="ltr"
                                  />
                                </FormControl>
                                <FormDescription>
                                  رابط صفحة فيسبوك
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="twitter"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>تويتر</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="https://twitter.com/username"
                                    dir="ltr"
                                  />
                                </FormControl>
                                <FormDescription>
                                  رابط حساب تويتر
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="instagram"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>انستقرام</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="https://instagram.com/username"
                                    dir="ltr"
                                  />
                                </FormControl>
                                <FormDescription>
                                  رابط حساب انستقرام
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="youtube"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>يوتيوب</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="https://youtube.com/channel/..."
                                    dir="ltr"
                                  />
                                </FormControl>
                                <FormDescription>
                                  رابط قناة يوتيوب
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="linkedin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>لينكد إن</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="https://linkedin.com/company/..."
                                  dir="ltr"
                                />
                              </FormControl>
                              <FormDescription>
                                رابط صفحة لينكد إن
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setActiveTab('contact')}
                        >
                          السابق
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? (
                            <>
                              <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                              جاري الحفظ...
                            </>
                          ) : (
                            <>
                              <Check className="ml-2 h-4 w-4" />
                              حفظ الإعدادات
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          )}
        </main>
      </div>
    </div>
  );
}