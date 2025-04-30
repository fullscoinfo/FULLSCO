import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  GraduationCap, 
  FileText, 
  User, 
  Settings, 
  Search, 
  BarChart,
  Plus, 
  Edit,
  UserPlus,
  PieChart,
  Lock
} from 'lucide-react';

const AdminPreview = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">Powerful Admin Dashboard</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our comprehensive admin panel makes managing scholarships, content, and SEO a breeze.</p>
        </div>
        
        <div className="relative mx-auto max-w-4xl rounded-lg border border-gray-200 shadow-lg overflow-hidden">
          {/* Admin Dashboard Preview */}
          <div className="h-[500px] bg-gray-50 overflow-hidden">
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-56 bg-gray-900 text-white p-4 hidden md:block">
                <div className="mb-6">
                  <span className="text-xl font-bold">FULL<span className="text-accent">SCO</span></span>
                  <span className="text-xs text-gray-400 ml-1">Admin</span>
                </div>
                
                <nav className="space-y-1">
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md bg-primary text-white font-medium">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800">
                    <GraduationCap className="mr-2 h-4 w-4" /> Scholarships
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800">
                    <FileText className="mr-2 h-4 w-4" /> Blog Posts
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800">
                    <User className="mr-2 h-4 w-4" /> Users
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800">
                    <Search className="mr-2 h-4 w-4" /> SEO
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800">
                    <BarChart className="mr-2 h-4 w-4" /> Analytics
                  </a>
                </nav>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-6 overflow-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Dashboard Overview</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Welcome, Admin</span>
                    <img 
                      src="https://randomuser.me/api/portraits/men/1.jpg" 
                      alt="Admin"
                      className="h-8 w-8 rounded-full"
                    />
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-primary-100 text-primary mr-4">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Scholarships</p>
                          <p className="text-2xl font-semibold">1,250</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-accent-100 text-accent mr-4">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Registered Users</p>
                          <p className="text-2xl font-semibold">8,540</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-secondary-100 text-secondary-500 mr-4">
                          <BarChart className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Page Views</p>
                          <p className="text-2xl font-semibold">245,689</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Recent Activity */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <h4 className="text-md font-semibold mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center p-2 rounded-md hover:bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary mr-3">
                          <Plus className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">New scholarship added: <span className="font-medium">Gates Cambridge Scholarship</span></p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-2 rounded-md hover:bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-500 mr-3">
                          <Edit className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">Blog post updated: <span className="font-medium">Tips for Scholarship Interviews</span></p>
                          <p className="text-xs text-gray-500">5 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-2 rounded-md hover:bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent mr-3">
                          <UserPlus className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">New user registered: <span className="font-medium">John Smith</span></p>
                          <p className="text-xs text-gray-500">Yesterday</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Quick Actions */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-md font-semibold mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button className="p-3 flex flex-col items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700">
                        <Plus className="h-5 w-5 mb-1 text-primary" />
                        <span className="text-xs">Add Scholarship</span>
                      </button>
                      
                      <button className="p-3 flex flex-col items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700">
                        <FileText className="h-5 w-5 mb-1 text-primary" />
                        <span className="text-xs">Create Post</span>
                      </button>
                      
                      <button className="p-3 flex flex-col items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700">
                        <PieChart className="h-5 w-5 mb-1 text-primary" />
                        <span className="text-xs">View Reports</span>
                      </button>
                      
                      <button className="p-3 flex flex-col items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700">
                        <Settings className="h-5 w-5 mb-1 text-primary" />
                        <span className="text-xs">Settings</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
            <div className="text-center p-6">
              <span className="inline-block mb-4 p-3 rounded-full bg-white/10">
                <Lock className="h-8 w-8 text-white" />
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Admin Dashboard</h3>
              <p className="text-white/80 mb-4 max-w-md">Manage scholarships, blog content, and SEO settings with our powerful admin tools.</p>
              <Link href="/admin/login">
                <Button variant="accent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPreview;
