import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/admin/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart, 
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// بيانات تجريبية للتحليلات (يتم استبدالها بالبيانات الحقيقية من الخادم في المرحلة التالية)
const monthlyVisits = [
  { name: 'يناير', visits: 4000, articles: 10, scholarships: 5 },
  { name: 'فبراير', visits: 3000, articles: 8, scholarships: 6 },
  { name: 'مارس', visits: 2000, articles: 11, scholarships: 4 },
  { name: 'أبريل', visits: 2780, articles: 7, scholarships: 8 },
  { name: 'مايو', visits: 1890, articles: 15, scholarships: 3 },
  { name: 'يونيو', visits: 2390, articles: 12, scholarships: 7 },
  { name: 'يوليو', visits: 3490, articles: 9, scholarships: 9 },
];

const topArticles = [
  { name: 'كيفية كتابة مقال للمنح الدراسية', views: 1200 },
  { name: 'أفضل الجامعات للدراسة في الخارج', views: 980 },
  { name: 'نصائح للحصول على قبول جامعي', views: 850 },
  { name: 'كيفية الحصول على منحة دراسية كاملة', views: 780 },
  { name: 'خطوات تحضير السيرة الذاتية للمنح', views: 650 },
];

const trafficSources = [
  { name: 'محركات البحث', value: 65 },
  { name: 'السوشيال ميديا', value: 20 },
  { name: 'روابط مباشرة', value: 10 },
  { name: 'أخرى', value: 5 },
];

// ألوان للرسوم البيانية
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState('monthly');
  
  const toggleSidebar = () => {
    console.log('Analytics: toggling sidebar');
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    console.log('Analytics: closing sidebar');
    setSidebarOpen(false);
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
            <h1 className="text-2xl font-bold">التحليلات</h1>
            
            <div className="w-48">
              <Select 
                value={timeRange} 
                onValueChange={setTimeRange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفترة الزمنية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="yearly">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الزيارات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">17,550</div>
                <p className="text-xs text-green-500 mt-1">
                  +15% من الشهر الماضي
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">المقالات المنشورة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72</div>
                <p className="text-xs text-green-500 mt-1">
                  +8% من الشهر الماضي
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">المنح المنشورة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-green-500 mt-1">
                  +5% من الشهر الماضي
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">المشتركين في النشرة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">548</div>
                <p className="text-xs text-green-500 mt-1">
                  +12% من الشهر الماضي
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* الزيارات الشهرية */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الزيارات</CardTitle>
                <CardDescription>
                  إجمالي الزيارات خلال الأشهر الماضية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyVisits}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="visits" 
                        name="الزيارات"
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* توزيع مصادر الزيارات */}
            <Card>
              <CardHeader>
                <CardTitle>مصادر الزيارات</CardTitle>
                <CardDescription>
                  توزيع الزيارات حسب مصدر الوصول
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trafficSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* المقالات الأكثر مشاهدة */}
            <Card>
              <CardHeader>
                <CardTitle>المقالات الأكثر مشاهدة</CardTitle>
                <CardDescription>
                  أكثر المقالات التي تمت زيارتها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={topArticles}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" name="المشاهدات" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* إحصائيات المحتوى */}
            <Card>
              <CardHeader>
                <CardTitle>نشاط المحتوى</CardTitle>
                <CardDescription>
                  مقارنة بين المقالات والمنح المنشورة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyVisits}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="articles" name="المقالات" fill="#0088FE" />
                      <Bar dataKey="scholarships" name="المنح الدراسية" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}