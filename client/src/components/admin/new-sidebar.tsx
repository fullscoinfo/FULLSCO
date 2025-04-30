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
  Home,
  FolderTree,
  School,
  Globe,
  MapPin,
  Palette,
  FileEdit,
  ListTree,
  ImageIcon,
  ShieldCheck,
  Database,
  ChevronDown,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { NotificationBell } from '@/components/notifications/notification-provider';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type NavItem = {
  href?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: NavItem[];
};

// تجميع العناصر في مجموعات منطقية
const navItems: NavItem[] = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  
  { 
    label: 'إدارة المنح',
    icon: GraduationCap,
    items: [
      { href: '/admin/scholarships', label: 'المنح الدراسية', icon: GraduationCap },
      { href: '/admin/scholarships/create', label: 'إضافة منحة جديدة', icon: FileEdit },
      { href: '/admin/categories', label: 'التصنيفات', icon: FolderTree },
      { href: '/admin/levels', label: 'المستويات الدراسية', icon: School },
      { href: '/admin/countries', label: 'الدول', icon: Globe },
    ]
  },
  
  { 
    label: 'المحتوى', 
    icon: FileText,
    items: [
      { href: '/admin/posts', label: 'المقالات', icon: FileText },
      { href: '/admin/posts/create', label: 'إضافة مقال جديد', icon: FileEdit },
      { href: '/admin/pages', label: 'الصفحات الثابتة', icon: FileEdit },
      { href: '/admin/menus', label: 'القوائم والروابط', icon: ListTree },
      { href: '/admin/media', label: 'مكتبة الوسائط', icon: ImageIcon },
    ]
  },
  
  { 
    label: 'إدارة المستخدمين',
    icon: Users,
    items: [
      { href: '/admin/users', label: 'المستخدمين', icon: Users },
      { href: '/admin/roles', label: 'الأدوار والتصاريح', icon: ShieldCheck },
    ]
  },
  
  { 
    label: 'الإعدادات',
    icon: Settings,
    items: [
      { href: '/admin/site-settings', label: 'تخصيص الموقع', icon: Palette },
      { href: '/admin/settings', label: 'الإعدادات العامة', icon: Settings },
      { href: '/admin/seo', label: 'تحسين محركات البحث', icon: Search },
      { href: '/admin/analytics', label: 'التحليلات', icon: BarChart },
      { href: '/admin/backups', label: 'النسخ الاحتياطي', icon: Database },
    ]
  },
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  // للكشف عن المجموعة النشطة تلقائيًا
  useEffect(() => {
    // تمديد المجموعة التي تحتوي على الرابط النشط تلقائيًا
    const newExpandedGroups: Record<string, boolean> = {};
    
    navItems.forEach((item, index) => {
      if (item.items) {
        const hasActiveItem = item.items.some(subItem => subItem.href === location);
        if (hasActiveItem) {
          newExpandedGroups[`group-${index}`] = true;
        }
      }
    });
    
    setExpandedGroups(prevState => ({
      ...prevState,
      ...newExpandedGroups
    }));
  }, [location]);
  
  // إزالة تعليق overflow من الجسم عند تنظيف المكون
  useEffect(() => {
    // إعادة تمكين التمرير عند تفكيك المكون
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // معالجة فتح وإغلاق السايدبار
  useEffect(() => {
    if (isMobile) {
      if (isMobileOpen) {
        // فتح السايدبار في وضع الموبايل
        document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
      } else {
        // إغلاق السايدبار في وضع الموبايل
        document.body.style.overflow = ''; // إعادة تمكين التمرير
      }
    } else {
      // تأكد من إعادة تمكين التمرير دائمًا في وضع سطح المكتب
      document.body.style.overflow = '';
    }
  }, [isMobileOpen, isMobile]);

  const handleLogout = () => {
    // إعادة تمكين التمرير قبل تسجيل الخروج
    document.body.style.overflow = '';
    logout();
  };

  const isActive = (path: string) => location === path;
  
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };
  
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
          "bg-background flex flex-col border-r shadow-lg z-50 transition-all duration-300 ease-in-out",
          isMobile 
            ? "fixed inset-y-0 right-0 w-72 transform" 
            : "w-64 h-screen sticky top-0"
        )}
        style={{
          transform: isMobile 
            ? isMobileOpen ? 'translateX(0)' : 'translateX(100%)' 
            : 'none'
        }}
        aria-hidden={isMobile && !isMobileOpen}
      >
        {/* زر الإغلاق - تم تغيير الموضع ليناسب الاتجاه العربي RTL */}
        {isMobile && (
          <button 
            className="absolute -left-10 top-4 bg-primary text-primary-foreground p-2 rounded-l-md" 
            onClick={onClose}
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* رأس السايدبار */}
        <div className="p-4 flex items-center justify-between border-b">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold">
              FULL<span className="text-primary">SCO</span>
            </span>
            <span className="text-xs text-muted-foreground ml-1">المدير</span>
          </Link>
          <NotificationBell />
        </div>
        
        {/* قائمة التنقل */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <Link href="/">
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start px-3 py-2 h-auto text-sm rounded-md mb-4",
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              العودة للموقع
            </Button>
          </Link>

          <div className="space-y-1">
            {navItems.map((item, index) => {
              // إذا كان العنصر بدون قائمة فرعية
              if (!item.items && item.href) {
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start px-3 py-2 h-auto text-sm rounded-md my-1",
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              }
              
              // إذا كان العنصر مع قائمة فرعية
              if (item.items) {
                const groupKey = `group-${index}`;
                const isExpanded = expandedGroups[groupKey];
                
                return (
                  <Collapsible
                    key={groupKey}
                    open={isExpanded}
                    onOpenChange={() => toggleGroup(groupKey)}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between px-3 py-2 h-auto text-sm rounded-md my-1"
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronLeft className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="pr-4 py-1 space-y-1">
                        {item.items.map((subItem) => (
                          <Link key={subItem.href} href={subItem.href || '#'}>
                            <Button
                              variant={isActive(subItem.href || '') ? "default" : "ghost"}
                              className={cn(
                                "w-full justify-start px-3 py-2 h-auto text-sm rounded-md",
                              )}
                            >
                              <subItem.icon className="ml-2 h-4 w-4" />
                              {subItem.label}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              }
              
              return null;
            })}
          </div>
        </nav>
        
        {/* ذيل السايدبار */}
        <div className="p-4 border-t mt-auto">
          <Button 
            variant="destructive" 
            className="w-full justify-start"
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