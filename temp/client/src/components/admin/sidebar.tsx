import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  LayoutDashboard, 
  GraduationCap, 
  FileText, 
  Users, 
  Settings, 
  Search, 
  BarChart, 
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/scholarships', label: 'المنح الدراسية', icon: GraduationCap },
  { href: '/admin/posts', label: 'المقالات', icon: FileText },
  { href: '/admin/users', label: 'المستخدمين', icon: Users },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
  { href: '/admin/seo', label: 'تحسين محركات البحث', icon: Search },
  { href: '/admin/analytics', label: 'التحليلات', icon: BarChart },
];

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isMobileOpen, onClose }: SidebarProps) => {
  const [location] = useLocation();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [prevOpen, setPrevOpen] = useState(false);

  // تسجيل الحالة في الكونسول للتصحيح
  console.log('Sidebar rendered with:', { isMobileOpen, isMobile, location });

  // كود تصحيح مشكلة ظهور السايدبار عند الضغط على زر القائمة
  useEffect(() => {
    if (isMobileOpen !== prevOpen) {
      setPrevOpen(isMobileOpen);

      // تأكد من تطبيق التغييرات البصرية
      if (sidebarRef.current) {
        if (isMobileOpen) {
          sidebarRef.current.classList.remove('sidebar-hidden');
          sidebarRef.current.classList.add('sidebar-visible');
          
          // تطبيق نمط عرض فوري
          sidebarRef.current.style.transform = 'translateX(0)';
          document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
        } else {
          sidebarRef.current.classList.remove('sidebar-visible');
          sidebarRef.current.classList.add('sidebar-hidden');
          
          // تطبيق نمط إخفاء فوري
          sidebarRef.current.style.transform = 'translateX(100%)';
          document.body.style.overflow = ''; // إعادة تمكين التمرير
        }
      }
    }
  }, [isMobileOpen, prevOpen]);

  const handleLogout = () => {
    logout();
    // تعطيل إغلاق القائمة الجانبية عند تسجيل الخروج
    // if (isMobile) {
    //   onClose();
    // }
  };

  const isActive = (path: string) => location === path;
  
  return (
    <>
      {/* طبقة التظليل خلف السايدبار عند فتحه في الموبايل */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* السايدبار */}
      <aside 
        ref={sidebarRef}
        className={cn(
          "bg-sidebar flex flex-col border-r border-sidebar-border z-50 transition-transform duration-300 ease-in-out",
          isMobile 
            ? "fixed inset-y-0 right-0 w-64" 
            : "w-64 h-screen"
        )}
        style={{
          transform: isMobile 
            ? isMobileOpen ? 'translateX(0)' : 'translateX(100%)' 
            : 'none'
        }}
        aria-hidden={isMobile && !isMobileOpen}
      >
        {/* زر الإغلاق */}
        {isMobile && (
          <div className="absolute -left-12 top-4">
            <Button 
              size="icon" 
              variant="ghost" 
              className="bg-sidebar-accent text-sidebar-accent-foreground rounded-r-none" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* رأس السايدبار */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold text-sidebar-foreground">
              FULL<span className="text-sidebar-accent">SCO</span>
            </span>
            <span className="text-xs text-sidebar-foreground/60 mr-1">Admin</span>
          </Link>
        </div>
        
        {/* قائمة التنقل */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <Link href="/">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start px-3 py-2 h-auto text-sm rounded-md transition-colors mb-4 border border-sidebar-accent/30",
                "text-sidebar-foreground/80 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
              )}
            >
              <Home className="ml-2 h-4 w-4" />
              العودة للموقع
            </Button>
          </Link>

          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start px-3 py-2 h-auto text-sm rounded-md transition-colors",
                  isActive(item.href)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="ml-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        
        {/* ذيل السايدبار */}
        <div className="p-4 border-t border-sidebar-border mt-auto">
          <Button 
            variant="outline" 
            className="w-full justify-start text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
            onClick={handleLogout}
          >
            <LogOut className="ml-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
