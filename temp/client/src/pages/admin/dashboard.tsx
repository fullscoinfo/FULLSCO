import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from '@/components/admin/sidebar';
import { 
  BarChart2, 
  Users, 
  GraduationCap, 
  FileText, 
  PlusCircle, 
  Edit, 
  UserPlus,
  Eye,
  Activity,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'wouter';
import { formatNumber, cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminDashboard = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch statistics
  const { data: scholarships } = useQuery({
    queryKey: ['/api/scholarships'],
    enabled: isAuthenticated,
  });

  const { data: posts } = useQuery({
    queryKey: ['/api/posts'],
    enabled: isAuthenticated,
  });

  const { data: users } = useQuery({
    queryKey: ['/api/users'],
    enabled: isAuthenticated,
  });

  const { data: subscribers } = useQuery({
    queryKey: ['/api/subscribers'],
    enabled: isAuthenticated,
  });

  if (authLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">جاري التحميل...</div>;
  }

  const stats = [
    {
      title: "إجمالي المنح",
      value: scholarships?.length || 0,
      icon: GraduationCap,
      color: "bg-primary/10 text-primary"
    },
    {
      title: "المستخدمين",
      value: users?.length || 0,
      icon: Users,
      color: "bg-accent/10 text-accent"
    },
    {
      title: "المقالات",
      value: posts?.length || 0,
      icon: FileText,
      color: "bg-secondary/10 text-secondary"
    },
    {
      title: "المشتركين",
      value: subscribers?.length || 0,
      icon: Users,
      color: "bg-emerald-500/10 text-emerald-600"
    }
  ];

  const recentActivity = [
    {
      type: "add",
      entity: "منحة",
      title: "منحة جيتس كامبريدج",
      time: "منذ ساعتين",
      icon: PlusCircle,
      color: "bg-primary/10 text-primary"
    },
    {
      type: "edit",
      entity: "مقال",
      title: "نصائح لمقابلات المنح الدراسية",
      time: "منذ 5 ساعات",
      icon: Edit,
      color: "bg-secondary/10 text-secondary"
    },
    {
      type: "add",
      entity: "مستخدم",
      title: "أحمد محمود",
      time: "الأمس",
      icon: UserPlus,
      color: "bg-accent/10 text-accent"
    },
    {
      type: "view",
      entity: "مقال",
      title: "كيف تكتب مقال ناجح للمنحة الدراسية",
      time: "منذ يومين",
      icon: Eye,
      color: "bg-purple-500/10 text-purple-600"
    }
  ];

  return (
    <div className="bg-background min-h-screen relative overflow-x-hidden">
      {/* السايدبار للجوال */}
      <Sidebar 
        isMobileOpen={sidebarOpen} 
        onClose={() => {
          console.log('Dashboard: closing sidebar');
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
          <div className="flex items-center justify-between mb-6">
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
              <h1 className="text-xl md:text-2xl font-bold">لوحة التحكم</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground ml-3 hidden sm:inline-block">مرحباً، {user?.fullName || user?.username}</span>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">{user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {/* شبكة الإحصائيات */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-soft">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${stat.color} ml-4`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-xl md:text-2xl font-semibold">{formatNumber(stat.value)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* سجل النشاطات */}
            <Card className="shadow-soft lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">آخر النشاطات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center ml-3 shrink-0`}>
                        <activity.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">
                            {activity.type === 'add' && 'إضافة'}
                            {activity.type === 'edit' && 'تحديث'}
                            {activity.type === 'view' && 'مشاهدة'}
                          </span>
                          {' '}
                          {activity.entity}: <span className="font-medium">{activity.title}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* الإجراءات السريعة */}
            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link href="/admin/scholarships/create">
                    <Button className="w-full justify-start" variant="outline">
                      <PlusCircle className="ml-2 h-4 w-4" /> إضافة منحة جديدة
                    </Button>
                  </Link>
                  <Link href="/admin/posts/create">
                    <Button className="w-full justify-start" variant="outline">
                      <PlusCircle className="ml-2 h-4 w-4" /> إنشاء مقال جديد
                    </Button>
                  </Link>
                  <Link href="/admin/analytics">
                    <Button className="w-full justify-start" variant="outline">
                      <Activity className="ml-2 h-4 w-4" /> عرض التحليلات
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* نظرة عامة على الموقع */}
          <Card className="shadow-soft mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">نظرة عامة على الموقع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 md:h-80 flex items-center justify-center bg-muted/30 rounded-md border border-dashed border-muted">
                <div className="text-center">
                  <BarChart2 className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">سيتم عرض بيانات التحليلات هنا</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
