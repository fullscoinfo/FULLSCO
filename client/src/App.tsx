import { Switch, Route, useLocation } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Scholarships from "@/pages/scholarships";
import ScholarshipDetail from "@/pages/scholarship-detail";
import Articles from "@/pages/articles";
import ArticleDetail from "@/pages/article-detail";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminScholarships from "@/pages/admin/scholarships";
import AdminPosts from "@/pages/admin/posts";
import AdminUsers from "@/pages/admin/users";
import AdminSettings from "@/pages/admin/settings";
import AdminSEO from "@/pages/admin/seo";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminCategories from "@/pages/admin/categories";
import AdminLevels from "@/pages/admin/levels";
import AdminCountries from "@/pages/admin/countries";
import AdminSiteSettings from "@/pages/admin/site-settings";
import AdminPages from "@/pages/admin/pages";
import AdminMenus from "@/pages/admin/menus";
import AdminMedia from "@/pages/admin/media";
import AdminRoles from "@/pages/admin/roles";
import AdminBackups from "@/pages/admin/backups";
import CreateScholarship from "@/pages/admin/create-scholarship";
import CreatePost from "@/pages/admin/create-post";
import AdminLogin from "@/pages/admin/login";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect } from "react";
import { NotificationProvider } from "@/components/notifications/notification-provider";

function App() {
  // Get current location to determine if we're on an admin page
  const [location] = useLocation();
  const isAdminPage = location.startsWith("/admin");

  // Add metadata to document head
  useEffect(() => {
    document.title = "FULLSCO - منصة المنح الدراسية";
    
    // تعيين اتجاه الصفحة للغة العربية
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }, []);

  // تغليف صفحات لوحة التحكم بمزود الإشعارات
  const wrapInNotificationProvider = (component: React.ReactNode) => {
    if (isAdminPage && location !== '/admin/login') {
      return (
        <NotificationProvider>
          {component}
        </NotificationProvider>
      );
    }
    return component;
  };

  return (
    <TooltipProvider>
      {!isAdminPage && <Header />}
      {wrapInNotificationProvider(
        <Switch>
          {/* Public routes */}
          <Route path="/" component={Home} />
          <Route path="/scholarships" component={Scholarships} />
          <Route path="/scholarships/:slug" component={ScholarshipDetail} />
          <Route path="/articles" component={Articles} />
          <Route path="/articles/:slug" component={ArticleDetail} />
          
          {/* Admin routes */}
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/scholarships" component={AdminScholarships} />
          <Route path="/admin/categories" component={AdminCategories} />
          <Route path="/admin/levels" component={AdminLevels} />
          <Route path="/admin/countries" component={AdminCountries} />
          <Route path="/admin/posts" component={AdminPosts} />
          <Route path="/admin/users" component={AdminUsers} />
          <Route path="/admin/settings" component={AdminSettings} />
          <Route path="/admin/site-settings" component={AdminSiteSettings} />
          <Route path="/admin/pages" component={AdminPages} />
          <Route path="/admin/menus" component={AdminMenus} />
          <Route path="/admin/media" component={AdminMedia} />
          <Route path="/admin/roles" component={AdminRoles} />
          <Route path="/admin/backups" component={AdminBackups} />
          <Route path="/admin/seo" component={AdminSEO} />
          <Route path="/admin/analytics" component={AdminAnalytics} />
          <Route path="/admin/scholarships/create" component={CreateScholarship} />
          <Route path="/admin/posts/create" component={CreatePost} />
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      )}
      {!isAdminPage && <Footer />}
    </TooltipProvider>
  );
}

export default App;
