import { Link } from 'wouter';
import { 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  BarChart, 
  Users, 
  Calendar 
} from 'lucide-react';

const categories = [
  {
    title: 'By Degree Level',
    description: 'Undergraduate, Masters, PhD',
    icon: GraduationCap,
    link: '/scholarships?type=degree'
  },
  {
    title: 'By Destination',
    description: 'USA, UK, Canada, Australia, Europe',
    icon: MapPin,
    link: '/scholarships?type=destination'
  },
  {
    title: 'By Field of Study',
    description: 'Engineering, Medicine, Business, Arts',
    icon: BookOpen,
    link: '/scholarships?type=field'
  },
  {
    title: 'By Funding Type',
    description: 'Full Funding, Partial, Research Grants',
    icon: BarChart,
    link: '/scholarships?type=funding'
  },
  {
    title: 'By Eligibility',
    description: 'International Students, Nationality-Specific',
    icon: Users,
    link: '/scholarships?type=eligibility'
  },
  {
    title: 'Upcoming Deadlines',
    description: 'Applications closing soon',
    icon: Calendar,
    link: '/scholarships?type=deadline'
  }
];

const ScholarshipCategories = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">Browse Scholarships by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Find scholarship opportunities that match your academic interests, destination country, or degree level.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link key={index} href={category.link}>
              <a className="group flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary group-hover:bg-primary group-hover:text-white">
                  <category.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
                <ArrowRight className="ml-auto text-gray-400 group-hover:text-primary h-4 w-4" />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default ScholarshipCategories;
