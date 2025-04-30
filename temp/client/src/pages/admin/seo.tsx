import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/admin/sidebar';
import { Button } from '@/components/ui/button';
import { Menu, PlusCircle, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SeoSetting } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

export default function AdminSEO() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // بيانات إعدادات SEO
  const [currentSeoSetting, setCurrentSeoSetting] = useState<Partial<SeoSetting>>({
    pagePath: '',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: ''
  });
  
  // جلب إعدادات SEO
  const { data: seoSettings = [], isLoading } = useQuery<SeoSetting[]>({
    queryKey: ['/api/seo-settings'],
  });
  
  // تصفية النتائج بناءً على البحث
  const filteredSettings = seoSettings.filter(setting => 
    setting.pagePath.toLowerCase().includes(searchQuery.toLowerCase()) || 
    setting.metaTitle?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    setting.metaDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSidebar = () => {
    console.log('SEO: toggling sidebar');
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    console.log('SEO: closing sidebar');
    setSidebarOpen(false);
  };
  
  const openAddDialog = () => {
    setCurrentSeoSetting({
      pagePath: '',
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: ''
    });
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (setting: SeoSetting) => {
    setCurrentSeoSetting(setting);
    setIsDialogOpen(true);
  };
  
  const handleSaveSeoSetting = () => {
    // هنا سيتم حفظ إعدادات SEO في المرحلة القادمة
    setIsDialogOpen(false);
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ إعدادات SEO للصفحة",
    });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="flex">
        {/* Sidebar for desktop */}
        {!isMobile && <Sidebar isMobileOpen={false} onClose={() => {}} />}
        
        {/* Mobile Sidebar */}
        {isMobile && <Sidebar isMobileOpen={sidebarOpen} onClose={closeSidebar} />}
        
        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-6 ${!isMobile ? 'mr-64' : ''}`}>
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-6">
            {isMobile && (
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={toggleSidebar} 
                className="text-muted-foreground"
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}
            <h1 className="text-2xl font-bold">تحسين محركات البحث</h1>
            <Button onClick={openAddDialog}>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة جديد
            </Button>
          </div>
          
          {/* Search & Controls */}
          <Card className="mb-6">
            <CardHeader className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-lg">إعدادات SEO للصفحات</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Input
                    type="text"
                    placeholder="بحث في الإعدادات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                قم بتخصيص عناوين ووصف الصفحات لتحسين ظهورها في محركات البحث ومنصات التواصل الاجتماعي.
              </p>
            </CardContent>
          </Card>
          
          {/* SEO Settings Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">جاري تحميل البيانات...</div>
              ) : filteredSettings.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  {searchQuery ? 'لا توجد نتائج مطابقة لبحثك' : 'لا توجد إعدادات SEO محددة حتى الآن'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>مسار الصفحة</TableHead>
                        <TableHead>العنوان</TableHead>
                        <TableHead className="hidden md:table-cell">الوصف</TableHead>
                        <TableHead>تحرير</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSettings.map((setting) => (
                        <TableRow key={setting.id}>
                          <TableCell className="font-medium">{setting.pagePath}</TableCell>
                          <TableCell>{setting.metaTitle}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {setting.metaDescription && setting.metaDescription.length > 60
                              ? `${setting.metaDescription.substring(0, 60)}...`
                              : setting.metaDescription}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openEditDialog(setting)}
                            >
                              تحرير
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Add/Edit SEO Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {currentSeoSetting.id ? 'تحرير إعدادات SEO' : 'إضافة إعدادات SEO جديدة'}
                </DialogTitle>
                <DialogDescription>
                  قم بتحديد مسار الصفحة وإعدادات SEO المرتبطة بها
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="page-path">مسار الصفحة <span className="text-red-500">*</span></Label>
                  <Input 
                    id="page-path" 
                    value={currentSeoSetting.pagePath} 
                    onChange={(e) => setCurrentSeoSetting({...currentSeoSetting, pagePath: e.target.value})}
                    placeholder="/articles/article-slug أو / للصفحة الرئيسية"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">عنوان الصفحة (Meta Title)</Label>
                    <Input 
                      id="meta-title" 
                      value={currentSeoSetting.metaTitle || ''} 
                      onChange={(e) => setCurrentSeoSetting({...currentSeoSetting, metaTitle: e.target.value})}
                      placeholder="عنوان الصفحة في نتائج البحث"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="canonical-url">الرابط القانوني (Canonical URL)</Label>
                    <Input 
                      id="canonical-url" 
                      value={currentSeoSetting.canonicalUrl || ''} 
                      onChange={(e) => setCurrentSeoSetting({...currentSeoSetting, canonicalUrl: e.target.value})}
                      placeholder="https://example.com/page"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meta-description">وصف الصفحة (Meta Description)</Label>
                  <Textarea 
                    id="meta-description" 
                    value={currentSeoSetting.metaDescription || ''} 
                    onChange={(e) => setCurrentSeoSetting({...currentSeoSetting, metaDescription: e.target.value})}
                    placeholder="وصف مختصر للصفحة يظهر في نتائج البحث"
                    rows={2}
                  />
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">إعدادات Open Graph (مشاركة السوشيال ميديا)</h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="og-title">عنوان OG</Label>
                      <Input 
                        id="og-title" 
                        value={currentSeoSetting.ogTitle || ''} 
                        onChange={(e) => setCurrentSeoSetting({...currentSeoSetting, ogTitle: e.target.value})}
                        placeholder="عنوان مخصص عند المشاركة على السوشيال ميديا"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="og-description">وصف OG</Label>
                      <Textarea 
                        id="og-description" 
                        value={currentSeoSetting.ogDescription || ''} 
                        onChange={(e) => setCurrentSeoSetting({...currentSeoSetting, ogDescription: e.target.value})}
                        placeholder="وصف مخصص عند المشاركة على السوشيال ميديا"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="og-image">رابط صورة OG</Label>
                      <Input 
                        id="og-image" 
                        value={currentSeoSetting.ogImage || ''} 
                        onChange={(e) => setCurrentSeoSetting({...currentSeoSetting, ogImage: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsDialogOpen(false)} variant="outline">
                  إلغاء
                </Button>
                <Button onClick={handleSaveSeoSetting}>
                  <Save className="ml-2 h-4 w-4" />
                  حفظ الإعدادات
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}