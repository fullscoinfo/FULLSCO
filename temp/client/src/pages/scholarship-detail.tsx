import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Globe, 
  GraduationCap, 
  FileText, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Newsletter from '@/components/newsletter';
import { Scholarship, Level, Country, Category } from '@shared/schema';

const ScholarshipDetail = () => {
  const { slug } = useParams();
  
  const { data: scholarship, isLoading, error } = useQuery<Scholarship>({
    queryKey: [`/api/scholarships/slug/${slug}`],
  });

  const { data: countries } = useQuery<Country[]>({
    queryKey: ['/api/countries'],
  });

  const { data: levels } = useQuery<Level[]>({
    queryKey: ['/api/levels'],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: relatedScholarships } = useQuery<Scholarship[]>({
    queryKey: ['/api/scholarships', { limit: 3 }],
    enabled: !!scholarship,
  });

  // Set page metadata
  useEffect(() => {
    if (scholarship) {
      document.title = `${scholarship.title} - FULLSCO Scholarship`;
      
      // You can add more metadata here when implementing SEO
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', scholarship.description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = scholarship.description;
        document.head.appendChild(meta);
      }
    }
  }, [scholarship]);

  const getCountryName = (countryId?: number) => {
    if (!countryId || !countries) return '';
    const country = countries.find(c => c.id === countryId);
    return country?.name || '';
  };

  const getLevelName = (levelId?: number) => {
    if (!levelId || !levels) return '';
    const level = levels.find(l => l.id === levelId);
    return level?.name || '';
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId || !categories) return '';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 w-40 bg-gray-200 rounded mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Scholarship Not Found</h1>
        <p className="text-gray-600 mb-8">We couldn't find the scholarship you're looking for.</p>
        <Link href="/scholarships">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Scholarships
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/scholarships">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Scholarships
            </Button>
          </Link>
          
          <div className="flex flex-wrap items-center mb-2">
            <Badge variant="country" className="mr-2 mb-2">{getCountryName(scholarship.countryId)}</Badge>
            <Badge variant="secondary" className="mr-2 mb-2">{getLevelName(scholarship.levelId)}</Badge>
            {scholarship.isFullyFunded && (
              <Badge variant="success" className="mr-2 mb-2">Fully Funded</Badge>
            )}
            <Badge variant="outline" className="mb-2">{getCategoryName(scholarship.categoryId)}</Badge>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{scholarship.title}</h1>
        </div>
        
        {/* Hero image */}
        <div className="relative rounded-lg overflow-hidden mb-8 h-72">
          <img 
            src={scholarship.imageUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3"}
            alt={scholarship.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
              Deadline: {scholarship.deadline || 'Ongoing'}
            </span>
          </div>
        </div>
        
        {/* Key information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center mb-2">
                <Globe className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Host Country</h3>
              </div>
              <p>{getCountryName(scholarship.countryId)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center mb-2">
                <GraduationCap className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Degree Level</h3>
              </div>
              <p>{getLevelName(scholarship.levelId)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center mb-2">
                <DollarSign className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Funding</h3>
              </div>
              <p>{scholarship.amount || 'Varies'}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Scholarship details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <div className="prose max-w-none">
                  <p className="mb-6">{scholarship.description}</p>
                  
                  {scholarship.requirements && (
                    <>
                      <h3 className="text-xl font-bold mb-3">Requirements</h3>
                      <p className="mb-6">{scholarship.requirements}</p>
                    </>
                  )}
                  
                  <div className="mt-8">
                    <a 
                      href={scholarship.applicationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button className="mr-4" size="lg">
                        Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                    
                    <Button variant="outline" size="lg">
                      <Calendar className="mr-2 h-4 w-4" /> Add to Calendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Key Dates</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application Deadline:</span>
                    <span className="font-medium">{scholarship.deadline || 'Ongoing'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Share This Scholarship</h3>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Related scholarships */}
        {relatedScholarships && relatedScholarships.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Scholarships</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedScholarships
                .filter(s => s.id !== scholarship.id)
                .slice(0, 3)
                .map(relatedScholarship => (
                  <Card key={relatedScholarship.id} className="group overflow-hidden">
                    <div className="relative">
                      <img 
                        src={relatedScholarship.imageUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3"}
                        alt={relatedScholarship.title}
                        className="h-40 w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary mb-2">
                        <Link href={`/scholarships/${relatedScholarship.slug}`}>
                          <a>{relatedScholarship.title}</a>
                        </Link>
                      </h3>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{getCountryName(relatedScholarship.countryId)}</Badge>
                        <Link href={`/scholarships/${relatedScholarship.slug}`}>
                          <a className="text-sm font-medium text-primary hover:text-primary-700">
                            Details
                          </a>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
        
        {/* Newsletter subscription */}
        <div className="mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <FileText className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="text-lg font-bold mb-1">Application Resources</h3>
                  <p className="text-gray-600">Check out our guides on how to apply for scholarships successfully.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <Link href="/articles/how-to-write-winning-scholarship-essay">
                  <Button variant="outline" className="w-full justify-start">
                    Writing a Winning Essay
                  </Button>
                </Link>
                <Link href="/articles/common-scholarship-application-mistakes">
                  <Button variant="outline" className="w-full justify-start">
                    Common Application Mistakes
                  </Button>
                </Link>
                <Link href="/articles/how-to-prepare-scholarship-interview">
                  <Button variant="outline" className="w-full justify-start">
                    Interview Preparation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Newsletter />
      </div>
    </main>
  );
};

export default ScholarshipDetail;
