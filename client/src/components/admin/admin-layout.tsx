import { useState, useEffect } from 'react';
import { useLocation, Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import Sidebar from '@/components/admin/new-sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu, Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}

const AdminLayout = ({ children, title, actions }: AdminLayoutProps) => {
  const { isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [, navigate] = useLocation();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    } else if (!authLoading && isAuthenticated && !isAdmin) {
      // إذا كان المستخدم مسجل دخول ولكن ليس لديه صلاحية مدير
      navigate('/');
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  // في حالة جاري التحميل
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // في حالة عدم تسجيل الدخول أو ليس مدير
  if (!isAuthenticated || !isAdmin) {
    return null; // سيتم التوجيه بواسطة useEffect
  }

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* السايدبار */}
      <Sidebar 
        isMobileOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* المحتوى الرئيسي */}
      <main 
        className={cn(
          "flex-1 min-h-screen transition-all duration-300",
          !isMobile && "mr-64"
        )}
      >
        {/* الهيدر */}
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-3"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="فتح القائمة"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </header>

        {/* المحتوى */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
      
      {/* مكون الإشعارات */}
      <Toaster />
    </div>
  );
};

export default AdminLayout;